using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class LecturerViewModel
    {

        public static Object getClassInfo(int classId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var classInfo = new Object();
                var lab = db.Classes.Where(c => c.classId == classId).FirstOrDefault();

                var tutors = new List<Object>();
                var allocations = db.Allocations.Where(a => a.classId == classId);
                if (allocations != null)
                {
                    foreach (var allo in allocations)
                    {
                        tutors.Add(new
                        {
                            name = allo.Student.fName + " " + allo.Student.lName,
                            matricNumber = allo.Student.matricNumber,
                            degree = allo.Student.degree,
                            year = allo.Student.year,
                            email = allo.Student.User.email
                        });
                    }
                }
                else
                {
                    tutors = null;
                }


                classInfo = (new
                {
                    year = lab.Module.year,
                    degree = lab.Module.degree,
                    module = lab.Module.name,
                    semester = lab.Module.semester,
                    time = lab.startTime.ToString("dddd HH:mm") + " ~ " + lab.endTime.ToString("HH:mm"),
                    tutors = tutors
                });

                return classInfo;
            }
        }

        public List<LecturerModel> getLecturers()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                List<LecturerModel> lecturerList = new List<LecturerModel>();
                var lecturers = db.Lecturers;
                foreach (var lecturer in lecturers)
                {
                    LecturerModel lec = new LecturerModel();
                    lec.lecturerId = lecturer.lecturerId;
                    lec.fName = lecturer.fName;
                    lec.lName = lecturer.lName;
                    lec.email = lecturer.User.email;

                    var teachings = db.Teachings.Where(t => t.lecturerId == lecturer.lecturerId);
                    foreach (var teaching in teachings)
                    {
                        lec.moduleList.Add(teaching.Module);
                    }

                    lecturerList.Add(lec);
                }
                return lecturerList;
            }
        }

        public void deleteLecturer(int lecturerId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                db.Teachings.RemoveRange(db.Teachings.Where(t => t.lecturerId == lecturerId));
                db.Users.Remove(db.Lecturers.Where(l => l.lecturerId == lecturerId).FirstOrDefault().User);
                db.Lecturers.Remove(db.Lecturers.Where(l => l.lecturerId == lecturerId).FirstOrDefault());

                db.SaveChanges();
            }
        }

        public static List<Object> getModules()
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var moduleList = new List<Object>();
                var modules = db.Modules;

                foreach (var module in modules)
                {
                    moduleList.Add(new
                    {
                        value = module.moduleId,
                        label = module.name,
                        title = "Year: " + module.year + "\n" +
                                "Degree: " + module.degree + "\n" +
                                "Semester: " + module.semester
                    });
                }

                return moduleList;
            }
        }

        public static void addLecturer(IEnumerable<string> selected_modules, string fname, string lname, string email, string password)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                User user = new User
                {
                    email = email,
                    accountType = "lecturer",
                    password = PasswordHash.HashPassword(password)
                };
                db.Users.Add(user);

                Lecturer lecturer = new Lecturer
                {
                    fName = fname,
                    lName = lname,
                    userId = user.userId,
                };
                db.Lecturers.Add(lecturer);

                foreach (var module in selected_modules)
                {
                    Teaching teaching = new Teaching
                    {
                        lecturerId = lecturer.lecturerId,
                        moduleId = Int32.Parse(module)
                    };
                    db.Teachings.Add(teaching);
                }

                db.SaveChanges();
            }
        }

        public static Object getLecturer(int lecturerId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var lecturerInfo = new Object();
                var moduleList = new List<Object>();

                var lecturer = db.Lecturers.Where(l => l.lecturerId == lecturerId).FirstOrDefault();
                var teachings = db.Teachings.Where(t => t.lecturerId == lecturerId);
                var modules = db.Modules;
                foreach (var module in modules)
                {
                    bool selected = false;
                    if (teachings.Where(t => t.moduleId == module.moduleId).Any())
                    {
                        selected = true;
                    }

                    moduleList.Add(new
                        {
                            value = module.moduleId,
                            label = module.name,
                            title = "Year: " + module.year + "\n"
                                    + "Degree: " + module.degree + "\n"
                                    + "Semester: " + module.semester,
                            selected = selected
                        });

                }

                lecturerInfo = (new
                {
                    email = lecturer.User.email,
                    fname = lecturer.fName,
                    lname = lecturer.lName,
                    modules = moduleList.ToArray()
                });
                return lecturerInfo;
            }
        }

        public static void editLecturer(int lecturerId, IEnumerable<string> selected_modules, string fname, string lname, string email)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var lecturer = db.Lecturers.Where(l => l.lecturerId == lecturerId).FirstOrDefault();
                lecturer.User.email = email;
                lecturer.fName = fname;
                lecturer.lName = lname;

                var modules = db.Teachings.Where(t => t.lecturerId == lecturerId);
                db.Teachings.RemoveRange(modules);

                foreach (var module in selected_modules)
                {
                    Teaching teaching = new Teaching
                    {
                        lecturerId = lecturer.lecturerId,
                        moduleId = Int32.Parse(module)
                    };
                    db.Teachings.Add(teaching);
                }

                db.SaveChanges();
            }
        }

        public static Object checkOldPassword(int lecturerId, string password)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var result = new Object();              
                var lecturer = db.Lecturers.Where(l => l.lecturerId == lecturerId).FirstOrDefault();
                result = (new
                {
                    valid = PasswordHash.ValidatePassword(password, lecturer.User.password)                  
                });
                return result;
            }
        }

        public static void resetPassword(int lecturerId, string password)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var lecturer = db.Lecturers.Where(l => l.lecturerId == lecturerId).FirstOrDefault();
                lecturer.User.password = PasswordHash.HashPassword(password);
                db.SaveChanges();
            }
        }
        
    }
}