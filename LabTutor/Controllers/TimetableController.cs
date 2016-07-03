using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using LabTutor.Models;
namespace LabTutor.Controllers
{
    public class TimetableController : Controller
    {

        public ActionResult Edit()
        {
            Timetable t = new Timetable();
            return View(t);
        }

        public JsonResult getModules(int year, int semester)
        {
            return Json(Timetable.getModules(year, semester), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getClasses(int year, int semester)
        {
            return Json(Timetable.getClasses(year, semester), JsonRequestBehavior.AllowGet);
        }

        public void Add(string moduleId, string startTime, string endTime, string type, string tutorNumber)
        {
            Timetable.addClass(Int32.Parse(moduleId), startTime, endTime, type, Int32.Parse(tutorNumber));
        }

        public void updateEventTime(string classId, string newStart, string newEnd)
        {
            Timetable.updateEventTime(Int32.Parse(classId), newStart, newEnd);
        }

        public void Update(string eventId, string moduleId, string type, string tutorNumber)
        {
            Timetable.updateClass(Int32.Parse(eventId), Int32.Parse(moduleId), type, Int32.Parse(tutorNumber));
        }

        public void Delete(string eventId)
        {
            Timetable.deleteClass(Int32.Parse(eventId));
        } 
    }
}

