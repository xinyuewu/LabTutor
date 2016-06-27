using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class Allocate
    {
        public Allocation allocation { get; set; }
        public Student student { get; set; }
        public Grade grade { get; set; }
        public Module module { get; set; }
        public Class classes { get; set; }
        public Application app { get; set; }

        public List<ClassInfo> classInfo { get; set; }

        public int prefWeight = 1;
        public int yearWeight = 1;
        public int minusWeight = 5;

        public void createAllocation()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                //get all lab classes and sort them in descending order 
                var labs = db.Classes.Where(c => c.type == "lab").OrderByDescending(l => l.Module.year).ToList();
                List<int> labId = new List<int>();
                foreach (var l in labs)
                {
                    labId.Add(l.classId);
                }

                Dictionary<int, double> workingHours = new Dictionary<int,double>();
                var stu = db.Students.Where(s => s.applied == true);
                List<int> stuId = new List<int>();
                foreach (var s in stu)
                {
                    stuId.Add(s.studentId);
                    workingHours.Add(s.studentId, 0);
                }

                
                List<List<Weight>> weight = new List<List<Weight>>();
                for (var i = 0; i < labs.Count(); i++)
                {
                    weight.Add(new List<Weight>());
                    for (var j = 0; j < stuId.Count; j++)
                    {
                        weight[i].Add(new Weight(labId[i], stuId[j], prefWeight));
                        int lId = labId[i];
                        int sId = stuId[j];

                        //preference
                        string prefered = "neutral";
                        try
                        {
                            prefered = db.Preferences.Where(p => p.classId == lId).Where(p => p.studentId == sId).FirstOrDefault().prefered;
                            if (prefered.Equals("liked"))
                            {
                                weight[i][j].weight = 2 * prefWeight;
                            }
                            else if (prefered.Equals("disliked"))
                            {
                                weight[i][j].weight = 0;
                            }
                            else if (prefered.Equals("timeClash"))
                            {
                                weight[i][j].weight = null;
                            }
                        }
                        catch
                        {
                            System.Diagnostics.Debug.WriteLine("Preference doesn't exist!");
                        }



                        //1-year approach
                        int stuYear = db.Students.Where(s => s.studentId == sId).FirstOrDefault().year;
                        int labYear = db.Classes.Where(c => c.classId == lId).FirstOrDefault().Module.year;
                        if (stuYear > labYear)
                        {
                            switch (stuYear - labYear)
                            {
                                case 1: weight[i][j].weight += 3 * yearWeight; break;
                                case 2: weight[i][j].weight += 2 * yearWeight; break;
                                case 3: weight[i][j].weight += 1 * yearWeight; break;
                            }
                        }
                        else
                        {
                            weight[i][j].weight = null;
                        }
                    }
                }

                
                List<List<Weight>> sortedWeight = new List<List<Weight>>();
                
                for (var i = 0; i < weight.Count(); i++)
                {
                    //sort students for each lab class
                    List<Weight> sortedStudents = weight[i].OrderByDescending(w => w.weight).ToList();
                    sortedWeight.Add(sortedStudents);

                    int classId = weight[i][0].classId;
                    int tutorNumber = db.Classes.Where(c => c.classId == classId).FirstOrDefault().tutorNumber;
                    DateTime startTime = db.Classes.Where(c => c.classId == classId).FirstOrDefault().startTime;
                    DateTime endTime = db.Classes.Where(c => c.classId == classId).FirstOrDefault().endTime;

                    //the number of tutors
                    for (var j = 0; j < (tutorNumber < sortedStudents.Count()? tutorNumber:sortedStudents.Count()); j++ )
                    {
                        if (sortedStudents[j].weight != null)
                        {
                            int studentId = sortedStudents[j].studentId;
                            int? maxHour = db.Students.Where(s => s.studentId == studentId).FirstOrDefault().maxHour;

                            if ((maxHour == null) || (workingHours[sortedStudents[j].studentId] + (endTime - startTime).TotalHours <= maxHour))
                            {
                                System.Diagnostics.Debug.WriteLine("maxHour " + maxHour);
                                System.Diagnostics.Debug.WriteLine("(endTime - startTime).TotalHours " + (endTime - startTime).TotalHours);

                                Allocation allo = new Allocation();
                                allo.classId = sortedStudents[j].classId;
                                allo.studentId = sortedStudents[j].studentId;
                                db.Allocations.Add(allo);

                                workingHours[sortedStudents[j].studentId] += (endTime - startTime).TotalHours;
                                System.Diagnostics.Debug.WriteLine("sortedStudents[j].studentId "+ sortedStudents[j].studentId+ ", workingHours " + workingHours[sortedStudents[j].studentId]);
                            }
                            else
                            {
                                //maxHour
                                for (var k = i; k < weight.Count(); k++)
                                {
                                    foreach (var w in weight[k])
                                    {
                                        if (w.studentId == sortedStudents[0].studentId)
                                        {
                                            w.weight = null;
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            break;
                        }
                    }
                    
                    //everyone assigned 
                    for (var k = i + 1; k < weight.Count(); k++)
                    {
                        foreach (var w in weight[k])
                        {
                            if (w.studentId == sortedStudents[0].studentId)
                            {
                                w.weight -= minusWeight;
                            }
                        }
                    }
                }

                db.SaveChanges();

                System.Diagnostics.Debug.WriteLine("after sorted:");
                printList(sortedWeight);
            }
        }

        public void printList(List<List<Weight>> weight)
        {
            for (var i = 0; i < weight.Count(); i++)
            {
                for (var j = 0; j < weight[i].Count; j++)
                {
                    System.Diagnostics.Debug.WriteLine(weight[i][j].classId + ", " + weight[i][j].studentId + ", " + weight[i][j].weight);
                }
                System.Diagnostics.Debug.WriteLine("--------------");
            }
        }

        public void deleteAllocation()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {                
                db.Allocations.RemoveRange(db.Allocations);
                db.SaveChanges();
            }
        }

    }
}