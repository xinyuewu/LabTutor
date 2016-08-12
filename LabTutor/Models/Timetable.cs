using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LabTutor.Models
{
    public class Timetable
    {
        public int id { get; set; }
        public string title { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        public string type { get; set; }

        public static List<Object> getModules(int year, int semester)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var modules = db.Modules.Where(m => m.year == year).Where(m => m.semester == semester);
                var moduleList = new List<Object>();
                foreach (var module in modules)
                {
                    moduleList.Add(new
                    {
                        title = module.name,
                        moduleId = module.moduleId
                    });
                }
                return moduleList;
            }
        }

        public static List<Object> getClasses(int year, int semester)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var result = db.Classes.Where(c => c.Module.year == year && c.Module.semester == semester);
                var eventList = new List<Object>();
                foreach (var item in result)
                {
                    eventList.Add(new
                        {
                            id = item.classId,
                            title = item.Module.name,
                            start = item.startTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                            end = item.endTime.ToString("yyyy-MM-ddTHH:mm:ss"),
                            type = item.type,
                            tutorNumber = item.tutorNumber,
                            moduleId = item.moduleId,
                            borderColor = (item.type == "lab") ? "#86b300" : "",
                            backgroundColor = (item.type == "lab") ? "#86b300" : ""
                        });
                }
                return eventList;
            }
        }

        public static void addClass(int moduleId, string startTime, string endTime, string type, int tutorNumber)
        {
            // EventStart comes ISO 8601 format, eg:  "2000-01-10T10:00:00Z" - need to convert to DateTime
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                Class cla = new Class();

                cla.moduleId = moduleId;

                startTime = startTime.Replace("GMT+0000", "").Trim();
                startTime = startTime.Insert(3, ",");
                cla.startTime = DateTime.Parse(startTime, null, DateTimeStyles.RoundtripKind);

                endTime = endTime.Replace("GMT+0000", "").Trim();
                endTime = endTime.Insert(3, ",");
                cla.endTime = DateTime.Parse(endTime, null, DateTimeStyles.RoundtripKind);

                cla.type = type;
                cla.tutorNumber = tutorNumber;

                db.Classes.Add(cla);
                db.SaveChanges();

            }
        }

        public static void updateEventTime(int classId, string newStart, string newEnd)
        {
            // EventStart comes ISO 8601 format, eg:  "2000-01-10T10:00:00Z" - need to convert to DateTime
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var cla = db.Classes.FirstOrDefault(c => c.classId == classId);
                if (cla != null)
                {
                    newStart = newStart.Replace("GMT+0000", "").Trim();
                    newEnd = newEnd.Replace("GMT+0000", "").Trim();
                    newStart = newStart.Insert(3, ",");
                    newEnd = newEnd.Insert(3, ",");

                    cla.startTime = DateTime.Parse(newStart, null, DateTimeStyles.RoundtripKind);
                    cla.endTime = DateTime.Parse(newEnd, null, DateTimeStyles.RoundtripKind);

                    db.SaveChanges();
                }
            }
        }

        public static void updateClass(int classId, int moduleId, string type, int tutorNumber)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var cla = db.Classes.FirstOrDefault(c => c.classId == classId);
                if (cla != null)
                {
                    cla.moduleId = moduleId;
                    cla.type = type;
                    cla.tutorNumber = tutorNumber;

                    db.SaveChanges();
                }
            }
        }

        public static void deleteClass(int classId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                // remember to delete class from "preference" and "allocation" table 
                var cla = db.Classes.Where(c => c.classId == classId).FirstOrDefault();
                if (cla != null)
                {
                    db.Classes.Remove(cla);
                    db.SaveChanges();
                }
            }
        }

    }

}