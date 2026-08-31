using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class AttendanceLog : BaseEntity<long>
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public DateTime Date { get; set; }
    public TimeSpan CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string Status { get; set; } = "Present"; // Present, Absent, HalfDay, Late
    public string? Notes { get; set; }
    public bool IsManualCorrection { get; set; } = false;
    public string? CorrectionReason { get; set; }
}

