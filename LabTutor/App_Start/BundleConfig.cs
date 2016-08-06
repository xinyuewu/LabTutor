using System.Web;
using System.Web.Optimization;

namespace LabTutor
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/bootstrap-select.js", //for multidropdown list
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                     "~/Content/bootstrap-multiselect.css",
                     "~/Content/jquery.dataTables.min.css",
                      "~/Content/jquery.qtip.min.css",
                      "~/Content/font-awesome.css",
                      "~/Content/waitMe.css",
                      "~/Content/bootstrap.css",
                      "~/Content/bootstrap-select.css", //for multidropdown list
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/fullcalendar/css").Include(
                      "~/Content/fullcalendar/jquery-ui-1.10.3.min.css",
                      "~/Content/fullcalendar/fullcalendar.css"));

            bundles.Add(new ScriptBundle("~/fullcalendar/script").Include(
                      "~/Scripts/waitMe.js",
                      "~/Scripts/bootstrap-multiselect.js",
                      "~/Scripts/bootstrapvalidator.min.js",
                      "~/Scripts/jquery.qtip.min.js",
                      "~/Scripts/jquery.dataTables.min.js",  
                      "~/Scripts/CustomJS/site.js",
                      "~/Scripts/fullcalendar/jquery-ui-1.11.1.js",
                      "~/Scripts/fullcalendar/moment.min.js",
                      "~/Scripts/fullcalendar/jquery-ui.custom.min.js",
                      "~/Scripts/fullcalendar/fullcalendar.js"));

        }
    }
}
