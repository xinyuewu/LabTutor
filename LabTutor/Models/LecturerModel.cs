using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class LecturerModel
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
    }
}