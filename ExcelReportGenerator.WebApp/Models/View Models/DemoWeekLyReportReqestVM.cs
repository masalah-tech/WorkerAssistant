namespace ExcelReportGenerator.WebApp.Models.View_Models
{
    public class DemoWeekLyReportReqestVM
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public IEnumerable<WeeklyTaskVM> TaskList { get; set; } = new List<WeeklyTaskVM>();
    }
}
