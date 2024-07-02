using Microsoft.AspNetCore.Mvc;

namespace WorkerAssistant.WebApp.Controllers
{
    public class TaskReportController : Controller
    {
        public IActionResult Weekly()
        {
            return View();
        }
    }
}
