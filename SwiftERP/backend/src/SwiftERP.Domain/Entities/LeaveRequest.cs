using SwiftERP.Domain.Common;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Domain.Entities;

public class LeaveRequest : AuditableEntity<int>
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string LeaveType { get; set; } = "Casual"; // Casual, Sick, Annual, Unpaid
    public int TotalDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

    public int? ApproverId { get; set; }
    public User? Approver { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ActionAtUtc { get; set; }
}
