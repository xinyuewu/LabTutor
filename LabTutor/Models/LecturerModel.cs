using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class LecturerModel
    {
        public int lecturerId { get; set; }
        public string fName { get; set; }
        public string lName { get; set; }
        public string email { get; set; }
        public List<Module> moduleList { get; set; }

        public LecturerModel()
        {
            moduleList = new List<Module>();
        }

    }
}