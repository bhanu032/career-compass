using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class DocumentAttachment : AuditableEntity<int>
{
    public string EntityType { get; set; } = string.Empty; // SalesOrder, PurchaseOrder, Employee
    public int EntityId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
}
