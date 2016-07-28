using LabTutor.Filters;
using LabTutor.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LabTutor.Controllers
{
    public class LecturerController : Controller
    {
        // GET: Lecturer
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult getClassInfo(int classId)
        {
            return Json(LecturerModel.getClassInfo(classId), JsonRequestBehavior.AllowGet);
        }
    }
}