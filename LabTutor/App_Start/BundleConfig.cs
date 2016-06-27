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

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/bootstrap-select.js", //for multidropdown list
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/bootstrap-select.css", //for multidropdown list
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/fullcalendar/css").Include(
                      "~/fullcalendar-2.7.2/lib/jqueryui/jquery-ui-1.10.3.min.css",
                      "~/fullcalendar-2.7.2/fullcalendar.css"));

            bundles.Add(new ScriptBundle("~/fullcalendar/script").Include(
                      "~/fullcalendar-2.7.2/lib/jqueryui/jquery-ui-1.11.1.js",         
                      "~/fullcalendar-2.7.2/lib/moment.min.js",                     
                      "~/fullcalendar-2.7.2/lib/jquery-ui.custom.min.js",
                      "~/fullcalendar-2.7.2/fullcalendar.js"));

        }
    }
}
