using Microsoft.AspNetCore.Mvc;

namespace ExcelReportGenerator.WebApp.Controllers
{
    public class TaskReportController : Controller
    {
        public IActionResult Weekly()
        {
            return View();
        }
    }
}
