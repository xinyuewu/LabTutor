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
        public ActionResult Crud()
        {
            LecturerViewModel lec = new LecturerViewModel();
            List<LecturerModel> lecturerList = new List<LecturerModel>();
            lecturerList = lec.getLecturers();
            return View(lecturerList);
        }

        [CoordinatorFilter]
        public JsonResult getModules()
        {
            return Json(LecturerViewModel.getModules(), JsonRequestBehavior.AllowGet);
        }

        [CoordinatorFilter]
        public void Add(IEnumerable<string> selected_modules, string fname, string lname, string email, string password)
        {
            LecturerViewModel.addLecturer(selected_modules, fname, lname, email, password);
        }

        [CoordinatorFilter]
        public void Edit(string lecturerId, IEnumerable<string> selected_modules, string fname, string lname, string email)
        {
            LecturerViewModel.editLecturer(Int32.Parse(lecturerId), selected_modules, fname, lname, email);
        }

        [CoordinatorFilter]
        public ActionResult Delete(int lecturerId)
        {
            LecturerViewModel lec = new LecturerViewModel();
            lec.deleteLecturer(lecturerId);
            return RedirectToAction("Crud", "Lecturer");
        }

        [CoordinatorFilter]
        public JsonResult getLecturer(int lecturerId)
        {
            return Json(LecturerViewModel.getLecturer(lecturerId), JsonRequestBehavior.AllowGet);
        }

        [LecturerFilter]
        public JsonResult checkOldPassword(string old_password)
        {
            int lecturerId = Convert.ToInt32(Session["userId"]);
            return Json(LecturerViewModel.checkOldPassword(lecturerId, old_password), JsonRequestBehavior.AllowGet);
        }

        [LecturerFilter]
        public void resetPassword(string new_password)
        {
            int lecturerId = Convert.ToInt32(Session["userId"]);
            LecturerViewModel.resetPassword(lecturerId, new_password);
        }

    }
}