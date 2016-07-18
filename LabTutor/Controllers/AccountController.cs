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

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Register(Register r)
        {
            if (ModelState.IsValid)
            {
                using (xinyuedbEntities db = new xinyuedbEntities())
                {
                    r.user.accountType = "student";
                    db.Users.Add(r.user);
                    db.SaveChanges();

                    var usr = db.Users.Where(u => u.email == r.user.email).FirstOrDefault();
                    r.student.userId = usr.userId;
                    db.Students.Add(r.student);
                    db.SaveChanges();

                }
            }
            Session["account"] = r.user.accountType.ToString();
            Session["userId"] = r.user.userId.ToString();
            Session["email"] = r.user.email.ToString();
            System.Diagnostics.Debug.WriteLine(System.Web.HttpContext.Current.Session["userId"].ToString());
            return RedirectToAction("LoggedIn");
        }
        public ActionResult Login()
        {
            if (Session["account"] != null)
            {
                System.Diagnostics.Debug.WriteLine(System.Web.HttpContext.Current.Session["account"].ToString());
                if (Session["account"].Equals("student"))
                {
                    return RedirectToAction("Index", "Application");
                }
            }
            return View();
        }

        //[HttpPost]
        //public ActionResult Login(User user)
        //{
        //    using (xinyuedbEntities db = new xinyuedbEntities())
        //    {
        //        var usr = db.Users.Where(u => u.email == user.email && u.password == user.password).FirstOrDefault();
        //        if (usr != null)
        //        {
        //            Session["userId"] = usr.userId.ToString();
        //            Session["name"] = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault().lName;
        //            Session["account"] = usr.accountType.ToString();
        //            return RedirectToAction("LoggedIn");
        //        }
        //        else
        //        {
        //            ModelState.AddModelError("", "Email or Password is wrong.");
        //        }
        //        return View();
        //    }
        //}

        [HttpPost]
        public JsonResult Login(string email, string password)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Where(u => u.email == email && u.password == password).FirstOrDefault();
                if (usr != null)
                {
                    Session["userId"] = usr.userId.ToString();
                    Session["name"] = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault().lName;
                    Session["account"] = usr.accountType.ToString();
                    return Json(new { success = true, account = usr.accountType.ToString()}, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
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
            }
            return RedirectToAction("Login");
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