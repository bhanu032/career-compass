using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class Warehouse : AuditableEntity<int>
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? ContactPerson { get; set; }

    public ICollection<StockLedger> StockLedgers { get; set; } = new List<StockLedger>();
}
