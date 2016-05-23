using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LabTutor.Controllers
{
    public class ApplicationController : Controller
    {
        xinyuedbEntities db = new xinyuedbEntities();

        // GET: Application
        public ActionResult Index()
        {

            int x = 0;
            Int32.TryParse(Session["userId"].ToString(), out x);

            Student student = new Student();
            try
            {
                student = db.Students.First(s => s.userId == x);
            }
            catch (InvalidOperationException dbEx)
            {
                Debug.WriteLine(dbEx.ToString());
            }

            return View(student);
        }


        [HttpGet]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(Student student)
        {
            if (ModelState.IsValid)
            {
                db.Students.Add(student);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            else
            {
                return View(student);
            }
        }
    }
}