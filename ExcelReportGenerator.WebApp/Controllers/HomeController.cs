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
        private readonly IWebHostEnvironment _webHostEnvironment;
        public HomeController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region API CALLS

        [HttpPost]
        public async Task<JsonResult> GenerateDemoReport([FromBody] DemoWeekLyReportReqestVM requestModel)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            string originalFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "templates/weekly report template.xlsx");
            string copiedFilePath = Path.Combine(_webHostEnvironment.WebRootPath, "weekly/demo1.xlsx");

            try
            {
                FileInfo originalFile = new FileInfo(originalFilePath);
                originalFile.CopyTo(copiedFilePath, true);

                FileInfo copiedFile = new FileInfo(copiedFilePath);

                using (ExcelPackage excelPackage = new ExcelPackage(copiedFile))
                {
                    ExcelWorkbook excelWorkBook = excelPackage.Workbook;
                    ExcelWorksheet sheet = excelWorkBook.Worksheets[0];

                    sheet.Cells[1, 1].Value = $"Mazen Salah - Task Report ({requestModel.StartDate.ToString("dd-MM-yyyy")} to {requestModel.EndDate.ToString("dd-MM-yyyy")})";

                    excelPackage.Save();
                }
            }
            catch (Exception)
            {

                throw;
            }


            return new JsonResult(new { success = true, fileName = "demo1.xlsx" });
        }

        #endregion
    }
}
