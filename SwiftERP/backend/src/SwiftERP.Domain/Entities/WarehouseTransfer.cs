using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class WarehouseTransfer : AuditableEntity<int>
{
    public string TransferNumber { get; set; } = string.Empty;
    public int FromWarehouseId { get; set; }
    public Warehouse FromWarehouse { get; set; } = null!;

    public int ToWarehouseId { get; set; }
    public Warehouse ToWarehouse { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }
    public string Status { get; set; } = "Completed"; // Pending, Completed, Cancelled
    public string? Notes { get; set; }
}
