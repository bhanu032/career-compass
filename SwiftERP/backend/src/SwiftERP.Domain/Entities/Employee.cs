using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class Employee : AuditableEntity<int>
{
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public DateTime DateOfJoining { get; set; }
    public decimal Salary { get; set; }
    public int AnnualLeaveBalance { get; set; } = 20;
    public DateTime? ProbationEndDate { get; set; }
    public string OnboardingStatus { get; set; } = "Completed"; // Pending, InProgress, Completed
    public bool IsActive { get; set; } = true;

    public int? UserId { get; set; }
    public User? User { get; set; }

    public ICollection<LeaveRequest> LeaveRequests { get; set; } = new List<LeaveRequest>();
    public ICollection<AttendanceLog> AttendanceLogs { get; set; } = new List<AttendanceLog>();
    public ICollection<DocumentAttachment> Attachments { get; set; } = new List<DocumentAttachment>();
    public ICollection<ExpenseClaim> ExpenseClaims { get; set; } = new List<ExpenseClaim>();
    public ICollection<SalaryAuditLog> SalaryAuditLogs { get; set; } = new List<SalaryAuditLog>();
}

