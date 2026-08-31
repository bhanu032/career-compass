using SwiftERP.Domain.Common;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Domain.Entities;

public class StockLedger : AuditableEntity<long>
{
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;

    public StockTransactionType TransactionType { get; set; }
    public int QuantityChange { get; set; } // +ve for incoming, -ve for outgoing
    public int BalanceAfter { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DiscrepancyReason DiscrepancyReason { get; set; } = DiscrepancyReason.None;

    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}

