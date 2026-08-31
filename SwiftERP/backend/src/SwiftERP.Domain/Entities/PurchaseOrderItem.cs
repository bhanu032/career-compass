using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class PurchaseOrderItem : BaseEntity<int>
{
    public int PurchaseOrderId { get; set; }
    public PurchaseOrder PurchaseOrder { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}
