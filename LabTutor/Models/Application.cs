using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class Application
    {
        public Student student { get; set; }
        public Grade grade { get; set; }
 
        public List<ClassInfo> classInfo { get; set; }
        public List<ClassInfo> timeClashClass { get; set; }

     
        public List<object> likedClass { get; set; }
        public List<object> dislikedClass { get; set; }

        public Application()
        {
            student = new Student();
            classInfo = new List<ClassInfo>();
            timeClashClass = new List<ClassInfo>();
            likedClass = new List<object>();
            dislikedClass = new List<object>();
        }


        public void getAllClasses(int userId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Find(userId);

                student = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault();

                List<ClassInfo> myClass = getMyClass();

                getLabClass(myClass);

            }

        }

        public List<ClassInfo> getMyClass()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var myModules = db.Modules.Where(m => m.degree.Contains(student.degree) && m.year == student.year);

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
                        myClass.Add(cla);//add to a list which contains only the classes this applicant is studying

                        cla.myclass = true;
                        classInfo.Add(cla);//add to a list which contains all classes presented on the view timetable, including classes that can be selected and classes that this applicant is studying
                    }
                }

                return myClass;
            }
            
        }

        public void getLabClass(List<ClassInfo> myClass)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var grades = db.Grades.Where(g => g.studentId == student.studentId); // only get classes that the applicant has studied (have grades for it)

                foreach (var g in grades)
                {
                    if (g.Module.year < student.year) //choose from classes that are lower year classes
                    {
                        var classes = db.Classes.Where(c => c.moduleId == g.Module.moduleId).Where(c => c.type == "lab");

                        foreach (var c in classes)
                        {


                            bool noTimeClash = true;
                            for (int i = 0; i < myClass.Count(); i++)
                            {
                                // (myClass[i] ends before this class starts) || (myClass[i] starts after this class ends)
                                if (!((DateTime.Compare(DateTime.Parse(myClass[i].endTime), c.startTime) <= 0) || (DateTime.Compare(DateTime.Parse(myClass[i].startTime), c.endTime) >= 0)))
                                {
                                    noTimeClash = false;

                                    ClassInfo cla = new ClassInfo();
                                    cla.title = g.Module.name;
                                    cla.classId = c.classId;
                                    cla.startTime = c.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                                    cla.endTime = c.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                                    cla.myclass = false;
                                    cla.moduleId = g.moduleId;
                                    timeClashClass.Add(cla);
                                    break;
                                }
                            }

                            if (noTimeClash)
                            {
                                ClassInfo cla = new ClassInfo();
                                cla.title = g.Module.name;
                                cla.classId = c.classId;
                                cla.startTime = c.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                                cla.endTime = c.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                                cla.myclass = false;
                                cla.moduleId = g.moduleId;
                                classInfo.Add(cla);
                            }

                        }
                    }
                }
            }
        }


        public void addApplication(int userId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Find(userId);                               
                Student stu = new Student();
                stu = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault();
                
                if (student.maxHour != null)
                {
                    stu.maxHour = student.maxHour;
                }

                if (student.NI != null)
                {
                    stu.NI = student.NI;
                }

                stu.applied = true;
                db.SaveChanges();
                
            }
        }


        public void updateApplication(int userId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Find(userId);
                Student stu = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault();

                if (student.maxHour != null)
                {
                    stu.maxHour = student.maxHour;
                }
                else
                {
                    stu.maxHour = null;
                }

                if (student.NI != null)
                {
                    stu.NI = student.NI;
                }
                else 
                {
                    stu.NI = null;
                }

                db.SaveChanges();

            }
        }
        

        public void readApplication(int userId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Find(userId);
                                
                student = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault();

                var pref = db.Preferences.Where(p => p.studentId == student.studentId);

                var grades = db.Grades.Where(g => g.studentId == student.studentId);

                foreach (var item in grades)
                {
                    if (item.Module.year < student.year)
                    {
                        var result = db.Classes.Where(c => c.moduleId == item.Module.moduleId);

                        foreach (var i in result)
                        {
                            ClassInfo cla = new ClassInfo();
                            cla.title = item.Module.name;
                            cla.classId = i.classId;  
                            cla.startTime = i.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                            cla.endTime = i.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                            cla.prefered = "neutral";
                            foreach (var p in pref)
                            {
                                if (p.classId == cla.classId)
                                {
                                    if (p.prefered.Equals("liked")) { cla.prefered = "liked"; }
                                    else if (p.prefered.Equals("disliked")) { cla.prefered = "disliked"; }
                                    else if (p.prefered.Equals("neutral")) { cla.prefered = "neutral"; }
                                }
                            }
                            classInfo.Add(cla);
                        }
                    }

                }

            }
        }


        public void deleteApplication(int userId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Find(userId);
                student = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault();
                student.maxHour = null;
                student.applied = false;
                db.Preferences.RemoveRange(db.Preferences.Where(s => s.studentId == student.studentId));
                db.SaveChanges();
            }
        }
    }

}