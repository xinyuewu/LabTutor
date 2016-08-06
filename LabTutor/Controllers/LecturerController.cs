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
        [LecturerFilter]
        public ActionResult Index()
        {
            return View();
        }

        [LecturerFilter]
        public JsonResult getClassInfo(int classId)
        {
            return Json(LecturerViewModel.getClassInfo(classId), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public JsonResult Create(int classId)
        {
            return Json(LecturerViewModel.getClassInfo(classId), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public ActionResult Read()
        {
            LecturerViewModel lec = new LecturerViewModel();
            List<LecturerModel> lecturerList = new List<LecturerModel>();
            lecturerList = lec.getLecturers();
            return View(lecturerList); 
        }

        [CoordinatorFilter]
        public JsonResult Update (int classId)
        {
            return Json(LecturerViewModel.getClassInfo(classId), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public ActionResult Delete(int lecturerId)
        {
            LecturerViewModel lec = new LecturerViewModel();
            lec.deleteLecturer(lecturerId);
            return RedirectToAction("Read", "Lecturer");
        }

    }
}