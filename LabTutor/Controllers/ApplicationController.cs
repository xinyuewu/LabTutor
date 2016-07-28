using LabTutor.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LabTutor.Filters;
using Newtonsoft.Json;
using System.Web.Script.Serialization;

namespace LabTutor.Controllers
{
    public class ApplicationController : Controller
    {
        xinyuedbEntities db = new xinyuedbEntities();

        // GET: Application
        [StudentFilter]
        public ActionResult Index()
        {
            int x = Int32.Parse(Session["userId"].ToString());
            Application app = new Application();

            try
            {
                app.student = db.Students.First(s => s.userId == x);
                app.readApplication(x);
            }
            catch (InvalidOperationException dbEx)
            {
                Debug.WriteLine(dbEx.ToString());
            }

            return View(app);
        }

        [StudentFilter]
        public ActionResult Edit()
        {
            int x = Int32.Parse(Session["userId"].ToString());
            Application app = new Application();
            app.readApplication(x);
            return View(app);
        }      

        [StudentFilter]
        public JsonResult getPreference(int semester, int studentId)
        {
            return Json(Application.getPreference(semester, studentId), JsonRequestBehavior.AllowGet);
        }

        [StudentFilter]
        public JsonResult getNImaxHour(int studentId)
        {
            System.Diagnostics.Debug.WriteLine(Application.getNImaxHour(studentId).ToString());
            return Json(Application.getNImaxHour(studentId), JsonRequestBehavior.AllowGet);
        }

        [StudentFilter]
        public void Update(IEnumerable<string> neutralList, IEnumerable<string> likedList, IEnumerable<string> dislikedList, string studentId, string ni, string maxHour)
        {
            Application.updatePreference(Int32.Parse(maxHour), Int32.Parse(studentId), ni, neutralList, likedList, dislikedList);
        }

        [StudentFilter]
        public ActionResult Delete()
        {
            int x = Int32.Parse(Session["userId"].ToString());
            Application app = new Application();
            app.deleteApplication(x);
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("Index", "Home");
        }

    }
}