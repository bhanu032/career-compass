using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class ExpenseClaim : AuditableEntity<int>
{
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = "General"; // Travel, Meals, Equipment, Office
    public decimal Amount { get; set; }
    public string? ReceiptUrl { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Paid
    public string? ManagerComment { get; set; }
    public DateTime? ProcessedAtUtc { get; set; }
}
