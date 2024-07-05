using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Diagnostics;
using WorkerAssistant.WebApp.Models.View_Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WorkerAssistant.WebApp.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }

        
    }
}
