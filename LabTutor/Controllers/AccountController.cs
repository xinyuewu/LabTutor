using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LabTutor.Models;

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
                ModelState.Clear();

            }

            Session["userId"] = r.user.userId.ToString();
            Session["email"] = r.user.email.ToString();
            return RedirectToAction("LoggedIn");
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(User user)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Where(u => u.email == user.email && u.password == user.password).FirstOrDefault();
                if (usr != null)
                {
                    Session["userId"] = usr.userId.ToString();
                    Session["email"] = usr.email.ToString();
                    return RedirectToAction("LoggedIn");
                }
                else
                {
                    ModelState.AddModelError("", "Email or Password is wrong.");
                }
                return View();
            }
        }

        public ActionResult LoggedIn()
        {
            if (Session["userId"] != null)
            {
                return RedirectToAction("Index", "Application");
            }
            else
            {
                return RedirectToAction("Login");
            }
        }

        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff()
        {
            Session.Abandon();
            return RedirectToAction("LoggedIn");
        }

    }
}