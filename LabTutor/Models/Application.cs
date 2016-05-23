using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class Application
    {
        [Key]
        public Student student { get; set; }
        public Preference pref { get; set; }
        public Grade grade { get; set; }
        public List<String> moduleList { get; set; }
        public Class classes { get; set; }

        public void getAllModules(int userId)
        {
            using (xinyuedbEntities db = new xinyuedbEntities())
            {
                var usr = db.Users.Find(userId);

                int year = 0;
                year = db.Students.Where(s => s.userId == usr.userId).FirstOrDefault().year;

                
                var module = db.Modules.Where(m => m.year < year).Select(m=>new {m.name}).AsEnumerable();
                

            }
        }



    }

}