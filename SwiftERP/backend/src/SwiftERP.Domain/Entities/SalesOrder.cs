using SwiftERP.Domain.Common;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Domain.Entities;

public class SalesOrder : AuditableEntity<int>
{
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Draft;
    public decimal TotalAmount { get; set; }
    public decimal Discount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal NetAmount { get; set; }
    public string? Notes { get; set; }

    public int? ApprovedById { get; set; }
    public User? ApprovedBy { get; set; }
    public DateTime? ApprovedAtUtc { get; set; }
    public string? RejectionReason { get; set; }

    public DateTime? PackedAtUtc { get; set; }
    public DateTime? ShippedAtUtc { get; set; }

    public ICollection<SalesOrderItem> Items { get; set; } = new List<SalesOrderItem>();
    public ICollection<DocumentAttachment> Attachments { get; set; } = new List<DocumentAttachment>();
}

