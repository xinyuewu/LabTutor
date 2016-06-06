using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


using DHTMLX.Scheduler;
using DHTMLX.Common;
using DHTMLX.Scheduler.Data;
using DHTMLX.Scheduler.Controls;

using LabTutor.Models;
namespace LabTutor.Controllers
{
    public class CalendarController : Controller
    {
        xinyuedbEntities db = new xinyuedbEntities();

        public ActionResult Index()
        {
            //Being initialized in that way, scheduler will use CalendarController.Data as a the datasource and CalendarController.Save to process changes
            var scheduler = new DHXScheduler(this);

            /*
             * It's possible to use different actions of the current controller
             *      var scheduler = new DHXScheduler(this);     
             *      scheduler.DataAction = "ActionName1";
             *      scheduler.SaveAction = "ActionName2";
             * 
             * Or to specify full paths
             *      var scheduler = new DHXScheduler();
             *      scheduler.DataAction = Url.Action("Data", "Calendar");
             *      scheduler.SaveAction = Url.Action("Save", "Calendar");
             */

            /*
             * The default codebase folder is ~/Scripts/dhtmlxScheduler. It can be overriden:
             *      scheduler.Codebase = Url.Content("~/customCodebaseFolder");
             */            

            scheduler.LoadData = true;
            scheduler.EnableDataprocessor = true;

            return View(scheduler);
        }

        public ContentResult Data()
        {
            List<Class> c = db.Classes.ToList();

            //var data = new SchedulerAjaxData
            //(
            //    new List<CalendarEvent> 
            //    { 
            //        for (int i=0; i<c.Count; i++)
            //        {
            //            if (i != c.Count-1 )
            //            {
            //                new CalendarEvent
            //                {
            //                    id = c[i].classId,
            //                    text = c[i].Module.name,
            //                    start_date = c[i].startTime,
            //                    end_date = c[i].endTime
            //                },
            //            }
            //            else
            //            {
            //                new CalendarEvent
            //                {
            //                    id = c[i].classId,
            //                    text = c[i].Module.name,
            //                    start_date = c[i].startTime,
            //                    end_date = c[i].endTime
            //                },
            //            }

            //        }
                
            //    }
            //);


            var data = new SchedulerAjaxData(
                    new List<CalendarEvent>{ 
                        new CalendarEvent{
                            id = 1, 
                            text = "Sample Event", 
                            start_date = new DateTime(2012, 09, 03, 6, 00, 00), 
                            end_date = new DateTime(2012, 09, 03, 8, 00, 00)
                        },
                        new CalendarEvent{
                            id = 2, 
                            text = "New Event", 
                            start_date = new DateTime(2012, 09, 05, 9, 00, 00), 
                            end_date = new DateTime(2012, 09, 05, 12, 00, 00)
                        },
                        new CalendarEvent{
                            id = 3, 
                            text = "Multiday Event", 
                            start_date = new DateTime(2012, 09, 03, 10, 00, 00), 
                            end_date = new DateTime(2012, 09, 10, 12, 00, 00)
                        }
                    }
                );
            return (ContentResult)data;
        }

        public ContentResult Save(int? id, FormCollection actionValues)
        {
            var action = new DataAction(actionValues);
            
            try
            {
                var changedEvent = (CalendarEvent)DHXEventsHelper.Bind(typeof(CalendarEvent), actionValues);
                var data = new xinyuedbEntities(); 
     

                switch (action.Type)
                {
                    case DataActionTypes.Insert:
                       // db.Classes.InsertOnSubmit(changedEvent);//do insert
                        //action.TargetId = changedEvent.id;//assign postoperational id
                        break;
                    case DataActionTypes.Delete:
                        //do delete
                        break;
                    default:// "update"                          
                        //do update
                        break;
                }
            }
            catch
            {
                action.Type = DataActionTypes.Error;
            }
            return (ContentResult)new AjaxSaveResponse(action);
        }
    }
}

