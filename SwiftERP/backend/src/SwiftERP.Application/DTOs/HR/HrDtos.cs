namespace SwiftERP.Application.DTOs.HR;

public class EmployeeDto
{
    public int Id { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public DateTime DateOfJoining { get; set; }
    public decimal Salary { get; set; }
    public int AnnualLeaveBalance { get; set; }
    public DateTime? ProbationEndDate { get; set; }
    public bool IsOnProbation => ProbationEndDate.HasValue && ProbationEndDate.Value > DateTime.UtcNow;
    public string OnboardingStatus { get; set; } = "Completed";
    public bool IsActive { get; set; } = true;
    public int? UserId { get; set; }
}

public class CreateEmployeeDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public DateTime DateOfJoining { get; set; } = DateTime.UtcNow;
    public decimal Salary { get; set; }
    public int AnnualLeaveBalance { get; set; } = 20;
    public DateTime? ProbationEndDate { get; set; }
    public string OnboardingStatus { get; set; } = "Completed";
    public bool CreateUserAccount { get; set; } = false;
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string Role { get; set; } = "Employee";
}

public class LeaveRequestDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string LeaveType { get; set; } = string.Empty;
    public int TotalDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public string? ApproverName { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime? ActionAtUtc { get; set; }
}

public class CreateLeaveRequestDto
{
    public int EmployeeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string LeaveType { get; set; } = "Annual";
    public string Reason { get; set; } = string.Empty;
}

public class LeaveActionDto
{
    public bool Approved { get; set; }
    public string? RejectionReason { get; set; }
}

public class AttendanceLogDto
{
    public long Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TimeSpan CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string Status { get; set; } = "Present";
    public string? Notes { get; set; }
    public bool IsManualCorrection { get; set; }
    public string? CorrectionReason { get; set; }
}

public class AttendanceCheckInDto
{
    public int EmployeeId { get; set; }
    public string? Notes { get; set; }
}

public class AttendanceCorrectionDto
{
    public int EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string Status { get; set; } = "Present";
    public string CorrectionReason { get; set; } = string.Empty;
}

public class ExpenseClaimDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? ReceiptUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ManagerComment { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? ProcessedAtUtc { get; set; }
}

public class CreateExpenseClaimDto
{
    public int EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public decimal Amount { get; set; }
    public string? ReceiptUrl { get; set; }
}

public class ExpenseActionDto
{
    public string Status { get; set; } = "Approved"; // Approved, Rejected, Paid
    public string? Comment { get; set; }
}

public class SalaryAuditLogDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public decimal OldSalary { get; set; }
    public decimal NewSalary { get; set; }
    public string ChangedBy { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class UpdateSalaryDto
{
    public decimal NewSalary { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class PayslipDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal HouseRentAllowance { get; set; }
    public decimal SpecialAllowance { get; set; }
    public decimal GrossEarnings => BasicSalary + HouseRentAllowance + SpecialAllowance;
    public decimal TaxDeduction { get; set; }
    public decimal ProvidentFund { get; set; }
    public decimal TotalDeductions => TaxDeduction + ProvidentFund;
    public decimal NetPayable => GrossEarnings - TotalDeductions;
    public DateTime GeneratedAtUtc { get; set; } = DateTime.UtcNow;
}
