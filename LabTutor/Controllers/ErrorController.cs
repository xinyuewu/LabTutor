using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LabTutor.Filters;

namespace LabTutor.Controllers
{
    public class ErrorController : Controller
    {
        [LoginFilter]
        public ActionResult RestrictedPage()
        {
            return View();
        }
        [LoginFilter]
        public ActionResult PageDoesntExist()
        {
            return View();
        }
    }
}