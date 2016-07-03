using LabTutor.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LabTutor.Controllers
{
    public class AllocateController : Controller
    {
        // GET: Allocation
        public ActionResult Index()
        {
            Allocate allo = new Allocate();
            List<Student> stuList = new List<Student>();
            stuList = allo.getStudents();
            return View(stuList); 
        }

        public JsonResult getAllocation(int semester)
        {
            return Json(Allocate.getAllocation(semester), JsonRequestBehavior.AllowGet);
        }

        public ActionResult Create()
        {
            Allocate allo = new Allocate();
            allo.deleteAllocation();
            allo.createAllocation();
            return RedirectToAction("Index");
        }

        public ActionResult Delete()
        {
            Allocate allo = new Allocate();
            allo.deleteAllocation();
            return RedirectToAction("Index");
        }

        public ActionResult populateDatabase()
        {
            Allocate allo = new Allocate();
            allo.clearStudentData();
            allo.populateDatabase();
            return RedirectToAction("Index");
        }
    }
}