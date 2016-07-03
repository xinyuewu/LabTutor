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
            allocateAlgorithm(1);
            allocateAlgorithm(2);
        }

        public void allocateAlgorithm(int semester)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                //get all lab classes and sort them in descending order 
                var labs = db.Classes.Where(c => c.type == "lab" && c.Module.semester == semester).OrderByDescending(l => l.Module.year).ToList();
                List<int> labId = new List<int>();
                foreach (var l in labs)
                {
                    labId.Add(l.classId);
                }

                Dictionary<int, double> workingHours = new Dictionary<int, double>();
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
                    for (var j = 0; j < (tutorNumber < sortedStudents.Count() ? tutorNumber : sortedStudents.Count()); j++)
                    {
                        int studentId = sortedStudents[j].studentId;

                        if (sortedStudents[j].weight != null)
                        {
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
                                System.Diagnostics.Debug.WriteLine("sortedStudents[j].studentId " + sortedStudents[j].studentId + ", workingHours " + workingHours[sortedStudents[j].studentId]);
                            }
                            else
                            {
                                //maxHour
                                for (var k = i; k < weight.Count(); k++)
                                {
                                    foreach (var w in weight[k])
                                    {
                                        if (w.studentId == sortedStudents[j].studentId)
                                        {
                                            w.weight = null;
                                        }
                                    }
                                }
                            }
                            var st = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                            st.workingHour = workingHours[sortedStudents[j].studentId];
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
                // printList(sortedWeight);
            }
        }

        public static List<Object> getAllocation(int semester)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                int allocatedTutorNumber = 0;
                var eventList = new List<Object>();

                var labs = db.Classes.Where(c => c.type.Equals("lab") && c.Module.semester == semester && c.Module.year <= 3);
                foreach (var lab in labs)
                {
                    string tutorName = "";
                    var tutors = db.Allocations.Where(a => a.classId == lab.classId);

                    foreach(var tutor in tutors)
                    {
                        allocatedTutorNumber++;
                        tutorName += tutor.Student.fName + tutor.Student.lName + ", ";                        
                    }


                    eventList.Add(new
                        {
                            id = lab.classId,
                            title = lab.Module.name,
                            start = lab.startTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                            end = lab.endTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                            tutorName = String.IsNullOrEmpty(tutorName) ? tutorName: tutorName.Remove(tutorName.Length - 2),
                            type = lab.type,
                            tutorNumber = lab.tutorNumber,
                            moduleId = lab.moduleId,
                            tutors = tutorName,
                            borderColor = allocatedTutorNumber < lab.tutorNumber ? "#ff9933" : "#3a87ad",
                            backgroundColor = allocatedTutorNumber < lab.tutorNumber ? "#ff9933" : "#3a87ad"
                        });
                }
                return eventList;
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

        public void populateDatabase()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                Random rnd = new Random();
                string[] degrees = { "AC", "CS" };
                int applicantsNumber = rnd.Next(10, 40);

                for (int i = 0; i < applicantsNumber; i++)
                {
                    Student stu = new Student();
                    stu.matricNumber = i;
                    stu.fName = "Applicant";
                    stu.lName = i.ToString();
                    stu.degree = degrees[rnd.Next(0, 2)];
                    stu.year = rnd.Next(2, 5);
                    stu.maxHour = rnd.Next(2, 20);
                    stu.applied = true;
                    db.Students.Add(stu);//add student[i] to "student" table

                    var myModules = db.Modules.Where(m => m.degree.Contains(stu.degree) && m.year == stu.year);
                    List<ClassInfo> myClass = new List<ClassInfo>();
                    foreach (var m in myModules)
                    {
                        var myCla = db.Classes.Where(c => c.moduleId == m.moduleId);
                        foreach (var c in myCla)
                        {
                            ClassInfo cla = new ClassInfo();
                            cla.moduleId = m.moduleId;
                            cla.title = m.name;
                            cla.classId = c.classId;
                            cla.startTime = c.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                            cla.endTime = c.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                            myClass.Add(cla);//get student[i]'s own classes
                        }
                    }


                    List<ClassInfo> availableLabs = new List<ClassInfo>();
                    var modules = db.Modules.Where(m => m.year <= stu.year && m.degree.Contains(stu.degree));
                    foreach (var module in modules)
                    {
                        Grade finalGrade = new Grade();
                        finalGrade.finalGrade = System.Convert.ToDouble(rnd.Next(40, 100));
                        finalGrade.moduleId = module.moduleId;
                        finalGrade.studentId = stu.studentId;
                        db.Grades.Add(finalGrade);//add student[i] to "grades" table

                        var labs = db.Classes.Where(c => c.moduleId == module.moduleId).Where(c => c.type == "lab");
                        foreach (var lab in labs)
                        {
                            bool noTimeClash = true;
                            for (int index = 0; index < myClass.Count(); index++)
                            {
                                if (!((DateTime.Compare(DateTime.Parse(myClass[index].endTime), lab.startTime) <= 0) || (DateTime.Compare(DateTime.Parse(myClass[index].startTime), lab.endTime) >= 0)))
                                {
                                    noTimeClash = false;
                                    break;
                                }
                            }

                            if (noTimeClash)
                            {
                                ClassInfo cla = new ClassInfo();
                                cla.title = module.name;
                                cla.classId = lab.classId;
                                cla.startTime = lab.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                                cla.endTime = lab.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                                cla.moduleId = module.moduleId;
                                availableLabs.Add(cla);//get all lab classes that student[i] can tutor
                            }

                        }
                    }

                    //add student[i] to "preferences" table
                    int likedNumber = rnd.Next(0, availableLabs.Count());
                    for (int number = 0; number < likedNumber; number++)
                    {
                        Preference pref = new Preference();
                        int index = rnd.Next(0, availableLabs.Count());
                        pref.classId = availableLabs[index].classId;
                        pref.studentId = stu.studentId;
                        pref.prefered = "liked";
                        db.Preferences.Add(pref);
                        availableLabs.RemoveAt(index);
                    }
                    int dislikedNumber = rnd.Next(0, availableLabs.Count());
                    for (int number = 0; number < dislikedNumber; number++)
                    {
                        Preference pref = new Preference();
                        int index = rnd.Next(0, availableLabs.Count());
                        pref.classId = availableLabs[index].classId;
                        pref.studentId = stu.studentId;
                        pref.prefered = "disliked";
                        db.Preferences.Add(pref);
                    }

                    db.SaveChanges();

                }

            }
        }

        public void clearStudentData()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                db.Students.RemoveRange(db.Students);
                db.Preferences.RemoveRange(db.Preferences);
                db.Grades.RemoveRange(db.Grades);
                db.Allocations.RemoveRange(db.Allocations);

                db.SaveChanges();
            }
        }

        public List<Student> getStudents()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                List<Student> stuList = new List<Student>();
                var students = db.Students;
                foreach (var item in students)
                {  
                    Student stu = new Student();
                    stu.fName = item.fName;
                    stu.lName = item.lName;
                    stu.degree = item.degree;
                    stu.year = item.year;
                    stu.maxHour = item.maxHour;
                    stu.workingHour = item.workingHour;
                    stuList.Add(stu);
                }
                return stuList;
            }
        }
    }
}