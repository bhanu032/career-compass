using SwiftERP.Domain.Common;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Domain.Entities;

public class PurchaseOrder : AuditableEntity<int>
{
    public string OrderNumber { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
    public string SupplierEmail { get; set; } = string.Empty;
    public string SupplierPhone { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Draft;
    public decimal TotalAmount { get; set; }
    public string? Notes { get; set; }

    public int? ApprovedById { get; set; }
    public User? ApprovedBy { get; set; }
    public DateTime? ApprovedAtUtc { get; set; }

    public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
    public ICollection<DocumentAttachment> Attachments { get; set; } = new List<DocumentAttachment>();
}
