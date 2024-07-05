namespace WorkerAssistant.WebApp.Models.View_Models
{
    public class WeekLyReportReqestVM
    {
        public string EmployeeName { get; set; }
        public DateTime WeekStartDate { get; set; }
        public DateTime WeekEndDate { get; set; }
        public IEnumerable<WeeklyTaskVM> TaskList { get; set; } = new List<WeeklyTaskVM>();
    }
}
