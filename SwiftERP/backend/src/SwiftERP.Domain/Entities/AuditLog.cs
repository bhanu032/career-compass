using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class AuditLog : BaseEntity<long>
{
    public string EntityName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? PerformedBy { get; set; }
    public DateTime PerformedAtUtc { get; set; } = DateTime.UtcNow;
    public string? IpAddress { get; set; }
}
