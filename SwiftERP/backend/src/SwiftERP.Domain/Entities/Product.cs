using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class Product : AuditableEntity<int>
{
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal CostPrice { get; set; }
    public int CurrentStock { get; set; }
    public int MinStockThreshold { get; set; } = 10;
    public string UnitOfMeasure { get; set; } = "PCS";

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // Optimistic concurrency token
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public bool IsLowStock => CurrentStock <= MinStockThreshold;

    public ICollection<StockLedger> StockLedgers { get; set; } = new List<StockLedger>();
    public ICollection<SalesOrderItem> SalesOrderItems { get; set; } = new List<SalesOrderItem>();
    public ICollection<PurchaseOrderItem> PurchaseOrderItems { get; set; } = new List<PurchaseOrderItem>();
}
