using LabTutor.Filters;
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
        [CoordinatorFilter]
        public ActionResult Index()
        {
            Allocate allo = new Allocate();
            List<Student> stuList = new List<Student>();
            stuList = allo.getStudents();
            return View(stuList);
        }

        [CoordinatorFilter]
        public ActionResult Edit()
        {
            return View();
        }

        [CoordinatorFilter]
        public void saveWeight(string prefWeight, string yearWeight, string stuWeight)
        {
            Allocate.saveWeight(Int32.Parse(prefWeight), Int32.Parse(yearWeight), Int32.Parse(stuWeight));
        }

        [CoordinatorFilter]
        public JsonResult getStudentsForMultiselectList(int classId)
        {
            return Json(Allocate.getStudentsForMultiselectList(classId), JsonRequestBehavior.AllowGet);
        }


        [CoordinatorFilter]
        public void saveStudentsForMultiselectList(IEnumerable<string> selected_students, string classId)
        {
            Allocate.saveStudentsForMultiselectList(selected_students, Int32.Parse(classId));
        }


        public JsonResult getAllocation(int semester, int studentId)
        {
            int lecturerId = -1;
            if (Session["account"] != null)
            {
                if (Session["account"].Equals("lecturer"))
                {
                    lecturerId = Convert.ToInt32(Session["userId"]);
                }
            }
            return Json(Allocate.getAllocation(semester, studentId, lecturerId), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public JsonResult getStudentInfo(int studentId)
        {
            return Json(Allocate.getStudentInfo(studentId), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public JsonResult getWeight()
        {
            return Json(Allocate.getWeight(), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public ActionResult Create()
        {
            Allocate allo = new Allocate();
            allo.deleteAllocation();
            allo.createAllocation();
            return RedirectToAction("Index");
        }

        [CoordinatorFilter]
        public ActionResult Delete()
        {
            Allocate allo = new Allocate();
            allo.deleteAllocation();
            return RedirectToAction("Index");
        }


        public JsonResult getPublishState()
        {
            return Json(Allocate.getPublishState(), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public ActionResult changePublishState()
        {
            Allocate allo = new Allocate();
            allo.changePublishState();
            return RedirectToAction("Index");
        }

        [CoordinatorFilter]
        public ActionResult populateDatabase()
        {
            Allocate allo = new Allocate();
            allo.clearStudentData();
            allo.populateDatabase();
            return RedirectToAction("Index");
        }

    }
}