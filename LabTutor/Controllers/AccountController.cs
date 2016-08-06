using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LabTutor.Models;
using LabTutor.Filters;

namespace LabTutor.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Login(string email, string password)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Where(u => u.email == email).FirstOrDefault();
                bool validPassword = PasswordHash.ValidatePassword(password, usr.password);
                if (validPassword)
                {
                    Session["userId"] = usr.userId.ToString();
                    if (usr.accountType.Equals("coordinator"))
                    {
                        Session["name"] = "Coordinator";
                    }
                    else if (usr.accountType.Equals("student"))
                    {
                        Session["name"] = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault().lName;
                    }
                    else
                    {
                        var lecturer = db.Lecturers.Where(l => l.userId == usr.userId).FirstOrDefault();
                        Session["name"] = lecturer.lName;
                        Session["userId"] = lecturer.lecturerId.ToString();
                    }

                    Session["account"] = usr.accountType.ToString();
                    return Json(new { success = true, account = usr.accountType.ToString() }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        [HttpPost]
        public JsonResult Register(string email, string password, string first_name, string last_name, int matric_number, string degree, int level)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var existing_user = db.Users.Where(u => u.email == email);
                var existing_student = db.Students.Where(s => s.matricNumber == matric_number);

                if (existing_student.Any() || existing_user.Any())
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    User user = new User();
                    user.email = email;
                    user.password = PasswordHash.HashPassword(password);
                    user.accountType = "student";
                    db.Users.Add(user);

                    Student student = new Student();
                    student.userId = user.userId;
                    student.fName = first_name;
                    student.lName = last_name;
                    student.matricNumber = matric_number;
                    student.degree = degree;
                    student.year = level;
                    student.maxHour = 4;
                    student.applied = true;
                    db.Students.Add(student);

                    db.SaveChanges();

                    Session["account"] = "student";
                    Session["userId"] = user.userId.ToString();
                    Session["email"] = email.ToString();
                    return Json(new { success = true }, JsonRequestBehavior.AllowGet);
                }

            }
        }

        public ActionResult LoggedIn()
        {
            if (Session["userId"] != null)
            {
                if (Session["account"].Equals("student"))
                {
                    return RedirectToAction("Index", "Application");
                }
                else if (Session["account"].Equals("coordinator"))
                {
                    return RedirectToAction("Index", "Allocate");
                }
                else
                {
                    return RedirectToAction("Index", "Lecturer");
                }
            }
            return RedirectToAction("Index", "Home");
        }

        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            Session.Clear();
            Session.Abandon();
            return RedirectToAction("Index", "Home");
        }

    }
}