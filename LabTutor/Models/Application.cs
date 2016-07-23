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
                db.Users.Remove(usr);
                db.Students.Remove(db.Students.Where(s => s.userId == userId).FirstOrDefault());
                db.Preferences.RemoveRange(db.Preferences.Where(p => p.Student.userId == userId));
                db.Grades.RemoveRange(db.Grades.Where(g => g.Student.userId == userId));
                db.Allocations.RemoveRange(db.Allocations.Where(a => a.Student.userId == userId));
                db.SaveChanges();
            }
        }


        public List<ClassInfo> getMyClasses(int studentId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var student = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                var myModules = db.Modules.Where(m => m.degree.Contains(student.degree) && m.year == student.year);
                List<ClassInfo> myClass = new List<ClassInfo>();
                foreach (var m in myModules)
                {
                    var myCla = db.Classes.Where(c => c.moduleId == m.moduleId);
                    foreach (var c in myCla)
                    {
                        ClassInfo cla = new ClassInfo();
                        cla.title = m.name;
                        cla.classId = c.classId;
                        cla.startTime = c.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                        cla.endTime = c.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                        myClass.Add(cla);
                    }
                }
                return myClass;
            }
        }


        public static List<Object> getPreference(int semester, int studentId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var eventList = new List<Object>();

                var student = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                var myModules = db.Modules.Where(m => m.degree.Contains(student.degree) && m.year == student.year && m.semester == semester);
                List<ClassInfo> myClass = new List<ClassInfo>();
                foreach (var m in myModules)
                {
                    var myCla = db.Classes.Where(c => c.moduleId == m.moduleId);
                    foreach (var c in myCla)
                    {
                        ClassInfo cla = new ClassInfo();
                        cla.title = m.name;
                        cla.classId = c.classId;
                        cla.startTime = c.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                        cla.endTime = c.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                        myClass.Add(cla);//add to a list which contains only the classes this applicant is studying

                        eventList.Add(new
                            {
                                id = c.classId,
                                title = c.Module.name,
                                start = c.startTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                end = c.endTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                year = c.Module.year,
                                degree = c.Module.degree,
                                tutorNumber = c.tutorNumber,
                                preference = "",
                                borderColor = "#8c8c8c",
                                backgroundColor = "#8c8c8c"
                            });
                    }
                }

                var grades = db.Grades.Where(g => g.studentId == studentId);
                foreach (var grade in grades)
                {
                    var labs = db.Classes.Where(c => c.moduleId == grade.moduleId && c.type.Equals("lab") && c.Module.semester == semester);
                    foreach (var lab in labs)
                    {
                        bool noTimeClash = true;

                        for (int i = 0; i < myClass.Count(); i++)
                        {
                            if (!((DateTime.Compare(DateTime.Parse(myClass[i].endTime), lab.startTime) <= 0) || (DateTime.Compare(DateTime.Parse(myClass[i].startTime), lab.endTime) >= 0)))
                            {
                                noTimeClash = false;
                                break;
                            }
                        }

                        string color = "";
                        if (noTimeClash)
                        {
                            var preferences = db.Preferences.Where(p => p.studentId == studentId && p.classId == lab.classId).FirstOrDefault();
                            if (preferences != null)
                            {
                                if (preferences.prefered.Equals("liked"))
                                {
                                    color = "#86b300";
                                }
                                else
                                {
                                    color = "#ff9933";
                                }
                            }
                            eventList.Add(new
                            {
                                id = lab.classId,
                                title = lab.Module.name,
                                start = lab.startTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                end = lab.endTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                                degree = lab.Module.degree,
                                year = lab.Module.year,
                                tutorNumber = lab.tutorNumber,
                                preference = preferences == null ? "neutral" : preferences.prefered,
                                borderColor = color,
                                backgroundColor = color
                            });
                        }


                    }
                }

                return eventList;
            }
        }


        public static Object getNImaxHour(int studentId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var stu = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();

                var NImaxHour = new Object();

                NImaxHour = (new
                {
                    ni = stu.NI,
                    maxHour = stu.maxHour
                });
                return NImaxHour;
            }
        }


        public static void updatePreference(int maxhour, int studentId, string ni, IEnumerable<string> neutralList, IEnumerable<string> likedList, IEnumerable<string> dislikedList)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var stu = db.Students.Where(s => s.studentId == studentId).FirstOrDefault();
                if (maxhour != null) stu.maxHour = maxhour;
                if (ni != null) stu.NI = ni;

                var pref = db.Preferences.Where(p => p.studentId == studentId);

                if (neutralList != null)
                {
                    foreach (var item in neutralList)
                    {
                        int classId = Int32.Parse(item);
                        var entity = pref.Where(e => e.classId == classId).FirstOrDefault();
                        if (entity != null)
                        {
                            db.Preferences.Remove(entity);
                        }                     
                    }
                }
                if (likedList != null)
                {
                    foreach (var item in likedList)
                    {
                        int classId = Int32.Parse(item);
                        var entity = pref.Where(e => e.classId == classId).FirstOrDefault();
                        if (entity != null)
                        {
                            entity.prefered = "liked";
                        }
                        else
                        {
                            Preference p = new Preference();
                            p.classId = Int32.Parse(item);
                            p.studentId = studentId;
                            p.prefered = "liked";
                            db.Preferences.Add(p);
                        }
                    }
                }
                if (dislikedList != null)
                {
                    foreach (var item in dislikedList)
                    {
                        int classId = Int32.Parse(item);
                        var entity = pref.Where(e => e.classId == classId).FirstOrDefault();
                        if (entity != null)
                        {
                            entity.prefered = "disliked";
                        }
                        else
                        {
                            Preference p = new Preference();
                            p.classId = Int32.Parse(item);
                            p.studentId = studentId;
                            p.prefered = "disliked";
                            db.Preferences.Add(p);
                        }
                    }
                }

                db.SaveChanges();
            }
        }

    }

}