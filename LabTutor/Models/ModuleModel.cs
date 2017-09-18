using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class ModuleModel
    {
        public int moduleId { get; set; }

        [Required]
        public string name { get; set; }
        public int year { get; set; }
        public string degree { get; set; }
        public int semester { get; set; }
    }
}