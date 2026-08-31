using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class SalaryAuditLog : BaseEntity<int>
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public decimal OldSalary { get; set; }
    public decimal NewSalary { get; set; }
    public string ChangedBy { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
