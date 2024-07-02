namespace ExcelReportGenerator.WebApp.Models.View_Models
{
    public class WeeklyTaskVM
    {
        public int Id { get; set; }
        public string TasksDetails { get; set; }
        public string Module { get; set; }
        public string Category { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Status { get; set; }
        public string Comment { get; set; }
    }
}
