using LabTutor.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LabTutor.Controllers
{
    public class AllocationController : Controller
    {
        // GET: Allocation
        public ActionResult Index()
        {
            Allocate allo = new Allocate();
            allo.deleteAllocation();
            allo.createAllocation();
            return View(allo); 
        }

    }
}