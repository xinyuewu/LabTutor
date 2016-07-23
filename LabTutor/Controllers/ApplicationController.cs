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

        public JsonResult getPreference(int semester, int studentId)
        {
            return Json(Application.getPreference(semester, studentId), JsonRequestBehavior.AllowGet);
        }

        public JsonResult getNImaxHour(int studentId)
        {
            System.Diagnostics.Debug.WriteLine(Application.getNImaxHour(studentId).ToString());
            return Json(Application.getNImaxHour(studentId), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [StudentFilter]
        public ActionResult Create()
        {
            Application app = new Application();
            int x = Int32.Parse(Session["userId"].ToString());
            app.getAllClasses(x);
            return View(app);
        }
        [HttpPost]
        [StudentFilter]
        public ActionResult Create(Application app)
        {
            if (ModelState.IsValid)
            {
                int x = Int32.Parse(Session["userId"].ToString());
                app.addApplication(x); //add "NI" and "maxhour", "applied" = true

                app.getAllClasses(x);
                List<ClassInfo> timeClashClass = app.timeClashClass;
                foreach (var item in timeClashClass)
                {
                    Preference p = new Preference();
                    p.prefered = "timeClash";
                    p.classId = item.classId;
                    p.studentId = db.Students.Where(s => s.userId == x).FirstOrDefault().studentId;
                    db.Preferences.Add(p);
                    db.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            else
            {
                return View(app);
            }
        }
        [HttpPost]
        public void Create1(IEnumerable<string> likedList)
        {
            if (likedList != null)
            {
                foreach (var a in likedList)
                {
                    System.Diagnostics.Debug.WriteLine("liked: " + a);
                    Preference p = new Preference();
                    p.prefered = "like";
                    p.classId = Int32.Parse(a);

                    var userId = Int32.Parse(Session["userId"].ToString());
                    var studentId = db.Students.Where(s => s.userId == userId).FirstOrDefault().studentId;
                    p.studentId = studentId;

                    db.Preferences.Add(p);
                    db.SaveChanges();
                }
            }

        }
        [HttpPost]
        public void Create2(IEnumerable<string> dislikedList)
        {
            if (dislikedList != null)
            {
                foreach (var a in dislikedList)
                {
                    System.Diagnostics.Debug.WriteLine("disliked: " + a);

                    Preference p = new Preference();
                    p.prefered = "dislike";
                    p.classId = Int32.Parse(a);

                    var userId = Int32.Parse(Session["userId"].ToString());
                    var studentId = db.Students.Where(s => s.userId == userId).FirstOrDefault().studentId;
                    p.studentId = studentId;

                    db.Preferences.Add(p);
                    db.SaveChanges();
                }
            }
        }
        [HttpPost]
        public void Create3(IEnumerable<string> neutralList)
        {
            if (neutralList != null)
            {
                foreach (var a in neutralList)
                {
                    System.Diagnostics.Debug.WriteLine("neutral: " + a);

                    Preference p = new Preference();
                    p.prefered = "neutral";
                    p.classId = Int32.Parse(a);

                    var userId = Int32.Parse(Session["userId"].ToString());
                    var studentId = db.Students.Where(s => s.userId == userId).FirstOrDefault().studentId;
                    p.studentId = studentId;

                    db.Preferences.Add(p);
                    db.SaveChanges();
                }
            }
        }


        public void Update(IEnumerable<string> neutralList, IEnumerable<string> likedList, IEnumerable<string> dislikedList, string studentId, string ni, string maxHour)
        {
            Application.updatePreference(Int32.Parse(maxHour), Int32.Parse(studentId), ni, neutralList, likedList, dislikedList);
        }

        [HttpGet]
        [StudentFilter]
        public ActionResult Edit()
        {
            int x = Int32.Parse(Session["userId"].ToString());
            Application app = new Application();
            app.readApplication(x);
            return View(app);
        }
        [HttpPost]
        [StudentFilter]
        public ActionResult Edit(Application app)
        {
            if (ModelState.IsValid)
            {
                int x = Int32.Parse(Session["userId"].ToString());
                app.updateApplication(x);
                return RedirectToAction("Index", "Application");
            }
            else
            {
                return View(app);
            }
        }
        [HttpPost]
        public void Edit1(IEnumerable<string> likedList)
        {
            var userId = Int32.Parse(Session["userId"].ToString());
            var studentId = db.Students.Where(s => s.userId == userId).FirstOrDefault().studentId;
            var pref = db.Preferences.Where(p => p.studentId == studentId).Where(p => p.prefered.Equals("liked"));
            db.Preferences.RemoveRange(pref);

            if (likedList != null)
            {
                foreach (var a in likedList)
                {
                    System.Diagnostics.Debug.WriteLine("liked: " + a);

                    Preference p = new Preference();
                    p.prefered = "liked";
                    p.classId = Int32.Parse(a);
                    p.studentId = studentId;

                    db.Preferences.Add(p);
                }
            }
            
            db.SaveChanges();
        }
        [HttpPost]
        public void Edit2(IEnumerable<string> dislikedList)
        {
            var userId = Int32.Parse(Session["userId"].ToString());
            var studentId = db.Students.Where(s => s.userId == userId).FirstOrDefault().studentId;
            var pref = db.Preferences.Where(p => p.studentId == studentId).Where(p => p.prefered.Equals("disliked"));
            db.Preferences.RemoveRange(pref);

            if (dislikedList != null)
            {
                foreach (var a in dislikedList)
                {
                    System.Diagnostics.Debug.WriteLine("disliked: " + a);

                    Preference p = new Preference();
                    p.prefered = "disliked";
                    p.classId = Int32.Parse(a);
                    p.studentId = studentId;

                    db.Preferences.Add(p);
                }
            }
            System.Diagnostics.Debug.WriteLine("-----------------");
            db.SaveChanges();
        }


        [HttpGet]
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