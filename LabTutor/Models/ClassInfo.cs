using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class ClassInfo
    {
        public int classId { get; set; }
        public int moduleId { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }

        public string title { get; set; }
        public string prefered { get; set; }
    }


}