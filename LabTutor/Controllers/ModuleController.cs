using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using LabTutor.Models;
using LabTutor.Filters;
using Newtonsoft.Json;

namespace LabTutor.Controllers
{
    public class ModuleController : Controller
    {
        [CoordinatorFilter]
        public ActionResult Index()
        {
            var modules = new List<ModuleModel>();

            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                modules = db.Modules.Select(x => new ModuleModel
                {
                    moduleId = x.moduleId,
                    name = x.name,
                    degree = x.degree,
                    year = x.year,
                    semester = x.semester
                }).ToList();
            }

            return View("Index", modules);
        }

        [CoordinatorFilter]
        public ActionResult Add(ModuleModel module)
        {
            try
            {
                if (this.ModelState.IsValid)
                {
                    using (xinyuedbEntities db = new xinyuedbEntities())
                    {
                        db.Modules.Add(new Module
                        {
                            name = module.name,
                            degree = module.degree,
                            year = module.year,
                            semester = module.semester
                        });

                        db.SaveChanges();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return this.RedirectToAction("Index");
        }

        [HttpGet]
        [CoordinatorFilter]
        public JsonResult Edit(int id)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var module = db.Modules.SingleOrDefault(x => x.moduleId == id);
                var viewModel = new ModuleModel
                {
                    moduleId = module.moduleId,
                    name = module.name,
                    degree = module.degree,
                    year = module.year,
                    semester = module.semester
                };

                var result = JsonConvert.SerializeObject(viewModel);

                return this.Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [CoordinatorFilter]
        public ActionResult Edit(ModuleModel updatedModule)
        {
            try
            {
                if (this.ModelState.IsValid)
                {
                    using (xinyuedbEntities db = new xinyuedbEntities())
                    {
                        var module = db.Modules.SingleOrDefault(x => x.moduleId == updatedModule.moduleId);
                        if (module != null)
                        {
                            module.name = updatedModule.name;
                            module.degree = updatedModule.degree;
                            module.year = updatedModule.year;
                            module.semester = updatedModule.semester;

                            db.SaveChanges();
                        }
                    }
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return this.RedirectToAction("Index");
        }

        [CoordinatorFilter]
        public ActionResult Delete(int id)
        {
            try
            {
                using (xinyuedbEntities db = new xinyuedbEntities())
                {
                    var module = db.Modules.SingleOrDefault(x => x.moduleId == id);
                    if (module != null)
                    {
                        var classes = db.Classes.Where(x => x.moduleId == id).ToList();
                        if (classes.Any())
                        {
                            foreach (var cla in classes)
                            {
                                var allocations = db.Allocations.Where(x => x.classId == cla.classId).ToList();
                                db.Allocations.RemoveRange(allocations);
                            }
                            db.Classes.RemoveRange(classes);
                        }

                        var teachings = db.Teachings.Where(x => x.moduleId == id).ToList();
                        db.Teachings.RemoveRange(teachings);

                        db.Modules.Remove(module);
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return this.RedirectToAction("Index");
        }
    }
}

