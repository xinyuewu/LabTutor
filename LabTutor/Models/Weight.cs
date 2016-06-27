using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LabTutor.Models
{
    public class Weight
    {

        public Weight(int classId, int studentId, int weight)
        {
            this.classId = classId;
            this.studentId = studentId;
            this.weight = weight;
        }
        public int classId { get; set; }
        public int studentId { get; set; }
        public int? weight { get; set; }
    }
}