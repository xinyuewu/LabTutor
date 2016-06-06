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

        public SortedDictionary<int, string> moduleList { get; set; }
        public List<object> likedClass { get; set; }
        public List<object> dislikedClass { get; set; }
        
        public List<int> selectedLike { get; set; }
        public List<int> selectedDislike { get; set; }

        public Application()
        {
            student = new Student();
            classInfo = new List<ClassInfo>();
            likedClass = new List<object>();
            dislikedClass = new List<object>();
            moduleList = new SortedDictionary<int, string>();
        }


        public void getAllClasses(int userId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Find(userId);

                student = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault();

                var grades = db.Grades.Where(g => g.studentId == student.studentId);
              
                foreach (var item in grades)
                {
                    if(item.Module.year < student.year)
                    {
                        moduleList.Add(item.Module.moduleId,item.Module.name.ToString());

                        var result = db.Classes.Where(c => c.moduleId == item.Module.moduleId);

                        foreach (var i in result)
                        {                           
                            ClassInfo cla = new ClassInfo();
                            cla.title = item.Module.name;
                            cla.classId = i.classId;
                            cla.startTime = i.startTime.ToString("yyyy-MM-ddTHH:mm:ss");
                            cla.endTime = i.endTime.ToString("yyyy-MM-ddTHH:mm:ss");
                            classInfo.Add(cla);
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
                                    if (p.prefered) { cla.prefered = "liked"; }
                                    else { cla.prefered = "disliked"; }
                                }
                            }
                            classInfo.Add(cla);
                        }
                    }

                }

                
                //foreach (var item in result)
                //{
                //    if (item.prefered == true)
                //    {
                //        likedClass.Add(item);
                //    }
                //    else
                //    {
                //        dislikedClass.Add(item);
                //    }                    
                //} 
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