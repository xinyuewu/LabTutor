using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
        public Module module { get; set; }
        public Class classes { get; set; }
        public Application app { get; set; }

        public List<ClassInfo> classInfo { get; set; }

        public static Object getWeight()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var weights = new Object();
                var config = db.Configs;

                weights = (new
                {
                    prefWeight = config.Where(c => c.name.Equals("prefWeight")).FirstOrDefault().value,
                    yearWeight = config.Where(c => c.name.Equals("yearWeight")).FirstOrDefault().value,
                    stuWeight = config.Where(c => c.name.Equals("stuWeight")).FirstOrDefault().value
                });

                return weights;
            }
        }

        public static void saveWeight(int prefWeight, int yearWeight, int stuWeight)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var config = db.Configs;
                config.Where(c => c.name.Equals("prefWeight")).FirstOrDefault().value = prefWeight;
                config.Where(c => c.name.Equals("yearWeight")).FirstOrDefault().value = yearWeight;
                config.Where(c => c.name.Equals("stuWeight")).FirstOrDefault().value = stuWeight;

                db.SaveChanges();
            }
        }

        public void createAllocation()
        {
            allocateAlgorithm1();//allocate for sememster 1 
            allocateAlgorithm2();//allocate for sememster 2 
        }

        public void allocateAlgorithm1()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                //get weight from database 
                var config = db.Configs;
                int prefWeight = config.Where(c => c.name.Equals("prefWeight")).FirstOrDefault().value;
                int yearWeight = config.Where(c => c.name.Equals("yearWeight")).FirstOrDefault().value;
                int stuWeight = config.Where(c => c.name.Equals("stuWeight")).FirstOrDefault().value;

                //get all lab classes and sort them in descending order 
                var labs = db.Classes.Where(c => c.type == "lab" && c.Module.semester == 1 && c.Module.year <= 3).OrderByDescending(l => l.Module.year).ToList();
                List<int> labId = new List<int>();
                foreach (var l in labs)
                {
                    labId.Add(l.classId);
                }

                Dictionary<int, double> workingHours = new Dictionary<int, double>();
                var stu = db.Students.Where(s => s.year <= 4);
                List<int> stuId = new List<int>();
                foreach (var s in stu)
                {
                    stuId.Add(s.studentId);
                    workingHours.Add(s.studentId, 0);
                }

                //create matric and set weight according to "preferences" and "1-year-approach" 
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
                            else
                            {
                                weight[i][j].weight = 0;
                            }
                        }
                        catch
                        {
                            System.Diagnostics.Debug.WriteLine("Preference doesn't exist!");
                        }

                        //check time clash
                        if (checkTimeClash(lId, sId))
                        {
                            weight[i][j].weight = null;
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

                            if ((maxHour == null) || (workingHours[sortedStudents[j].studentId] + (endTime - startTime).TotalHours <= maxHour)) //maxHour
                            {
                                Allocation allo = new Allocation();
                                allo.classId = sortedStudents[j].classId;
                                allo.studentId = sortedStudents[j].studentId;
                                db.Allocations.Add(allo);

                                workingHours[sortedStudents[j].studentId] += (endTime - startTime).TotalHours;

                                //more applicants assigned 
                                for (var k = i + 1; k < weight.Count(); k++)
                                {
                                    foreach (var w in weight[k])
                                    {
                                        if (w.studentId == sortedStudents[j].studentId)
                                        {
                                            w.weight -= stuWeight;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                //set weight in other following classes to be null
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

                            //add applicant's allocated working hours to the "student" table
                            var st = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                            st.workingHour1 = workingHours[sortedStudents[j].studentId];

                        }
                    }

                }

                db.SaveChanges();
            }
        }

        public void allocateAlgorithm2()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                //get weight from database 
                var config = db.Configs;
                int prefWeight = config.Where(c => c.name.Equals("prefWeight")).FirstOrDefault().value;
                int yearWeight = config.Where(c => c.name.Equals("yearWeight")).FirstOrDefault().value;
                int stuWeight = config.Where(c => c.name.Equals("stuWeight")).FirstOrDefault().value;

                //get all lab classes and sort them in descending order 
                var labs = db.Classes.Where(c => c.type == "lab" && c.Module.semester == 2 && c.Module.year <= 3).OrderByDescending(c => c.Module.year).ToList();
                List<int> labId = new List<int>();
                foreach (var l in labs)
                {
                    labId.Add(l.classId);
                }

                Dictionary<int, double> workingHours = new Dictionary<int, double>();
                var stu = db.Students.Where(s => s.year <= 4).OrderBy(s => s.workingHour1);//students not allocated in the first sememster will be first considered in the second semester
                List<int> stuId = new List<int>();
                foreach (var s in stu)
                {
                    stuId.Add(s.studentId);
                    workingHours.Add(s.studentId, 0);
                }

                //create matric and set weight according to "preferences" and "1-year-approach" 
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
                            else
                            {
                                weight[i][j].weight = 0;
                            }
                        }
                        catch
                        {
                            System.Diagnostics.Debug.WriteLine("Preference doesn't exist!");
                        }


                        //check time clash
                        if (checkTimeClash(lId, sId))
                        {
                            weight[i][j].weight = null;
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

                            if ((maxHour == null) || (workingHours[sortedStudents[j].studentId] + (endTime - startTime).TotalHours <= maxHour)) //maxHour
                            {
                                Allocation allo = new Allocation();
                                allo.classId = sortedStudents[j].classId;
                                allo.studentId = sortedStudents[j].studentId;
                                db.Allocations.Add(allo);

                                workingHours[sortedStudents[j].studentId] += (endTime - startTime).TotalHours;

                                //more applicants assigned 
                                for (var k = i + 1; k < weight.Count(); k++)
                                {
                                    foreach (var w in weight[k])
                                    {
                                        if (w.studentId == sortedStudents[j].studentId)
                                        {
                                            w.weight -= stuWeight;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                //set weight in other following classes to be null
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

                            //add applicant's allocated working hours to the "student" table
                            var st = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                            st.workingHour2 = workingHours[sortedStudents[j].studentId];
                        }
                    }
                }

                db.SaveChanges();
            }
        }

        private static bool checkTimeClash(int classId, int studentId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                //check if timeClash
                var lab = db.Classes.Where(l => l.classId == classId).FirstOrDefault();
                var student = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                var myModules = db.Modules.Where(m => m.degree.Contains(student.degree) && m.year == student.year && m.semester == lab.Module.semester);
                foreach (var myModule in myModules)
                {
                    var myClas = db.Classes.Where(c => c.moduleId == myModule.moduleId);
                    foreach (var myCla in myClas)
                    {
                        if (!((DateTime.Compare(myCla.endTime, lab.startTime) <= 0) || (DateTime.Compare(myCla.startTime, lab.endTime) >= 0)))
                        {
                            return true;
                        }
                    }
                }
                return false;
            }
        }

        public static List<Object> getAllocation(int semester, int studentId, int lecturerId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var eventList = new List<Object>();

                var labs = db.Classes.Where(c => c.type.Equals("lab") && c.Module.semester == semester && c.Module.year <= 4);
                foreach (var lab in labs)
                {
                    int allocatedTutorNumber = 0;
                    string color = "";

                    var tutorName = new List<Object>();
                    var tutors = db.Allocations.Where(a => a.classId == lab.classId);
                    foreach (var tutor in tutors)
                    {
                        allocatedTutorNumber++;
                        tutorName.Add(new
                        {
                            studentId = tutor.studentId,
                            name = tutor.Student.fName + " " + tutor.Student.lName,
                            degree = tutor.Student.degree,
                            year = tutor.Student.year,
                            maxHour = tutor.Student.maxHour,
                            workingHour1 = tutor.Student.workingHour1,
                            workingHour2 = tutor.Student.workingHour2
                        });
                        if (tutor.studentId == studentId)
                        {
                            color = "#ff9933";
                        }
                    }

                    if (studentId == -1)
                    {
                        color = allocatedTutorNumber < lab.tutorNumber ? "#ff9933" : "#3a87ad";
                    }

                    if (lecturerId != -1)
                    {
                        var teachings = lab.Module.Teachings;
                        foreach (var teaching in teachings)
                        {
                            if (teaching.lecturerId == lecturerId)
                            {
                                color = "#ff9933";
                                break;
                            }
                        }
                    }

                    var lecturers = new List<Object>();
                    var teaches = db.Teachings.Where(t => t.moduleId == lab.moduleId);
                    foreach (var teach in teaches)
                    {
                        lecturers.Add(new
                        {
                            lecturerId = teach.lecturerId,
                            name = teach.Lecturer.fName + " " + teach.Lecturer.lName,
                            email = teach.Lecturer.User.email
                        });
                    }

                    eventList.Add(new
                        {
                            id = lab.classId,
                            title = lab.Module.name,
                            start = lab.startTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                            end = lab.endTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                            type = lab.type,
                            tutorNumber = lab.tutorNumber,
                            moduleId = lab.moduleId,
                            year = lab.Module.year,
                            degree = lab.Module.degree,
                            tutorName = tutorName,
                            lecturers = lecturers,
                            borderColor = color,
                            backgroundColor = color
                        });
                }
                return eventList;
            }
        }

        public static List<Object> getStudentsForMultiselectList(int classId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var lab = db.Classes.Where(c => c.classId == classId).FirstOrDefault();
                var allocations = db.Allocations.Where(a => a.classId == classId);
                int allocatedTutorNumber = allocations.Count();
                var preferences = db.Preferences.Where(p => p.classId == classId);

                var students = db.Students.Where(s => s.year > lab.Module.year);
                var groupList = new List<Object>();
                int studentNumber = students.Count();

                var likedList = new List<Object>();
                var dislikedList = new List<Object>();
                var neutralList = new List<Object>();

                foreach (var stu in students)
                {
                    bool disabled = false;
                    bool allocated = false;
                    bool hoursExceeded = false;
                    if (allocations.Where(allo => allo.studentId == stu.studentId).FirstOrDefault() != null)
                    {
                        allocated = true;
                    }

                    if (allocatedTutorNumber < lab.tutorNumber)
                    {
                        if (allocated)
                        {
                            disabled = false;
                        }
                        else
                        {
                            if (lab.Module.semester == 1)
                            {
                                if (stu.workingHour1 + (lab.endTime - lab.startTime).TotalHours <= stu.maxHour)
                                {
                                    disabled = false;
                                }
                                else
                                {
                                    disabled = true;
                                    hoursExceeded = true;
                                }
                            }
                            else
                            {
                                if (stu.workingHour2 + (lab.endTime - lab.startTime).TotalHours <= stu.maxHour)
                                {
                                    disabled = false;
                                }
                                else
                                {
                                    disabled = true;
                                    hoursExceeded = true;
                                }
                            }
                        }
                    }
                    else
                    {
                        disabled = !allocated;

                        if (allocated)
                        {
                            disabled = false;
                        }
                        else
                        {
                            if (lab.Module.semester == 1)
                            {
                                if (stu.workingHour1 + (lab.endTime - lab.startTime).TotalHours > stu.maxHour)
                                {
                                    hoursExceeded = true;
                                }
                            }
                            else
                            {
                                if (stu.workingHour2 + (lab.endTime - lab.startTime).TotalHours <= stu.maxHour)
                                {
                                    hoursExceeded = true;
                                }
                            }
                        }
                    }
                    
                    //check time clash
                    bool timeClash = false;
                    if (checkTimeClash(classId, stu.studentId))
                    {
                        timeClash = true;
                    }

                    var color = new Object();
                    var pref = preferences.Where(pr => pr.studentId == stu.studentId).FirstOrDefault();
                    if (pref != null)
                    {
                        if (pref.prefered.Equals("liked"))
                        {
                            likedList.Add(new
                            {
                                value = stu.studentId,
                                label = stu.fName + " " + stu.lName + (timeClash ? "(Time Clash)" : ""),
                                title = stu.degree + ", year " + stu.year + "\n"
                                        + "Maximum working hours: " + stu.maxHour + "\n"
                                        + "Allocated hours (S1): " + stu.workingHour1 + "\n"
                                        + "Allocated hours (S2): " + stu.workingHour2,
                                selected = allocated,
                                disabled = disabled,
                                hoursExceeded = hoursExceeded
                            });
                        }
                        else if (pref.prefered.Equals("disliked"))
                        {
                            dislikedList.Add(new
                            {
                                value = stu.studentId,
                                label = stu.fName + " " + stu.lName + (timeClash ? "(Time Clash)" : ""),
                                title = stu.degree + ", year " + stu.year + "\n"
                                        + "Maximum working hours: " + stu.maxHour + "\n"
                                        + "Allocated hours (S1): " + stu.workingHour1 + "\n"
                                        + "Allocated hours (S2): " + stu.workingHour2,
                                selected = allocated,
                                disabled = disabled,
                                hoursExceeded = hoursExceeded
                            });
                        }
                    }
                    else
                    {
                        neutralList.Add(new
                        {
                            value = stu.studentId,
                            label = stu.fName + " " + stu.lName + (timeClash ? "(Time Clash)" : ""),
                            title = stu.degree + ", year " + stu.year + "\n"
                                    + "Maximum working hours: " + stu.maxHour + "\n"
                                    + "Allocated hours (S1): " + stu.workingHour1 + "\n"
                                    + "Allocated hours (S2): " + stu.workingHour2,
                            selected = allocated,
                            disabled = disabled,
                            hoursExceeded = hoursExceeded
                        });
                    }
                }

                groupList.Add(new
                {
                    label = "Like",
                    children = likedList.ToArray()
                });

                groupList.Add(new
                {
                    label = "Dislike",
                    children = dislikedList.ToArray()
                });
                groupList.Add(new
                {
                    label = "Neutral",
                    children = neutralList.ToArray()
                });

                return groupList;
            }
        }

        public static void saveStudentsForMultiselectList(IEnumerable<string> selected_students, int classId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var lab = db.Classes.Where(c => c.classId == classId).FirstOrDefault();
                double classTime = (lab.endTime - lab.startTime).TotalHours;

                //remove old allocations
                var allocations = db.Allocations.Where(a => a.classId == classId);
                foreach (var allocation in allocations)
                {
                    var oldstudent = db.Students.Where(s => s.studentId == allocation.studentId).FirstOrDefault();
                    if (lab.Module.semester == 1)
                    {
                        oldstudent.workingHour1 -= classTime;
                    }
                    else
                    {
                        oldstudent.workingHour2 -= classTime;
                    }
                }
                db.Allocations.RemoveRange(allocations);

                //store new allocations
                foreach (var stu in selected_students)
                {
                    int studentId = Int32.Parse(stu);

                    Allocation allo = new Allocation();
                    allo.classId = classId;
                    allo.studentId = studentId;
                    db.Allocations.Add(allo);

                    var newstudent = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                    if (lab.Module.semester == 1)
                    {
                        newstudent.workingHour1 += classTime;
                    }
                    else
                    {
                        newstudent.workingHour2 += classTime;
                    }

                }
                db.SaveChanges();
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
                var students = db.Students;
                foreach (var student in students)
                {
                    student.workingHour1 = 0;
                    student.workingHour2 = 0;
                }
                db.Allocations.RemoveRange(db.Allocations);
                var config = db.Configs.Where(c => c.name.Equals("published")).FirstOrDefault();
                config.value = 0;
                db.SaveChanges();
            }
        }

        public void populateDatabase()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                Random rnd = new Random();
                string[] degrees = { "AC", "CS" };
                int applicantsNumber = rnd.Next(25, 30);

                for (int i = 0; i < applicantsNumber; i++)
                {
                    Student stu = new Student();
                    stu.matricNumber = i;
                    stu.fName = "Applicant";
                    stu.lName = (i + 1).ToString();
                    stu.degree = degrees[rnd.Next(0, 2)];
                    stu.year = rnd.Next(2, 5);
                    stu.maxHour = rnd.Next(2, 20);
                    stu.workingHour1 = 0;
                    stu.workingHour2 = 0;
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
                    var modules = db.Modules.Where(m => m.year < stu.year && m.degree.Contains(stu.degree));
                    foreach (var module in modules)
                    {
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
                db.Allocations.RemoveRange(db.Allocations);
                var config = db.Configs.Where(c => c.name.Equals("published")).FirstOrDefault();
                config.value = 0;

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
                    stu.studentId = item.studentId;
                    stu.fName = item.fName;
                    stu.lName = item.lName;
                    stu.degree = item.degree;
                    stu.year = item.year;
                    stu.maxHour = item.maxHour;
                    stu.workingHour1 = item.workingHour1;
                    stu.workingHour2 = item.workingHour2;
                    stuList.Add(stu);
                }
                return stuList;
            }
        }

        public static Object getStudentInfo(int studentId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var studentInfo = new Object();
                var student = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();

                var allocatedLabs = new List<Object>();
                var labs = db.Allocations.Where(a => a.studentId == studentId);
                foreach (var lab in labs)
                {
                    allocatedLabs.Add(new
                    {
                        year = lab.Class.Module.year,
                        degree = lab.Class.Module.degree,
                        module = lab.Class.Module.name,
                        semester = lab.Class.Module.semester,
                        time = lab.Class.startTime.ToString("dddd HH:mm") + " ~ " + lab.Class.endTime.ToString("HH:mm"),
                        //prefered = db.Preferences.Where(p => p.studentId == studentId && p.classId == lab.classId).FirstOrDefault().prefered
                    });
                }

                var preferences = new List<Object>();
                var classes = db.Preferences.Where(p => p.studentId == studentId);
                string liked = "";
                string disliked = "";
                foreach (var cla in classes)
                {
                    if (cla.prefered.Equals("liked"))
                    {
                        liked += cla.Class.Module.name + "\n(" + cla.Class.startTime.ToString("dddd HH:mm") + " ~ " + cla.Class.endTime.ToString("HH:mm") + ")\n";
                    }
                    else
                    {
                        disliked += cla.Class.Module.name + "\n(" + cla.Class.startTime.ToString("dddd HH:mm") + " ~ " + cla.Class.endTime.ToString("HH:mm") + ")\n";
                    }
                }
                preferences.Add(new
                {
                    liked = String.IsNullOrEmpty(liked) ? liked : liked.Remove(liked.Length - 1),
                    disliked = String.IsNullOrEmpty(disliked) ? disliked : disliked.Remove(disliked.Length - 1)
                });


                studentInfo = (new
                    {
                        name = student.fName + " " + student.lName,
                        matricNumber = student.matricNumber,
                        degree = student.degree,
                        year = student.year,
                        NI = student.NI,
                        paymentRate = student.paymentRate,
                        maxHour = student.maxHour,
                        workingHour1 = student.workingHour1,
                        workingHour2 = student.workingHour2,
                        allocatedLabs = allocatedLabs,
                        preferences = preferences
                    });

                return studentInfo;
            }
        }

        public static bool getPublishState()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var config = db.Configs.Where(c => c.name.Equals("published")).FirstOrDefault();
                bool published = config.value != 0;
                return published;
            }
        }

        public void changePublishState()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var config = db.Configs.Where(c => c.name.Equals("published")).FirstOrDefault();
                config.value = config.value != 0 ? 0 : 1;
                db.SaveChanges();
            }
        }

    }
}