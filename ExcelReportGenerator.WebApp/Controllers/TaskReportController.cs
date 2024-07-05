using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using WorkerAssistant.WebApp.Models.View_Models;

namespace WorkerAssistant.WebApp.Controllers
{
    public class TaskReportController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public TaskReportController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Weekly()
        {
            return View();
        }

        #region API CALLS

        [HttpPost]
        public async Task<JsonResult> GenerateDemoReport([FromBody] WeekLyReportReqestVM requestModel)
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

                    sheet.Cells[1, 1].Value = $"Mazen Salah - Task Report ({requestModel.WeekStartDate.ToString("dd-MM-yyyy")} to {requestModel.WeekEndDate.ToString("dd-MM-yyyy")})";

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
