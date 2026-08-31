using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class ApprovalDelegation : AuditableEntity<int>
{
    public int DelegatorUserId { get; set; }
    public User DelegatorUser { get; set; } = null!;

    public int DelegateeUserId { get; set; }
    public User DelegateeUser { get; set; } = null!;

    public DateTime StartDateUtc { get; set; }
    public DateTime EndDateUtc { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Reason { get; set; }
}
