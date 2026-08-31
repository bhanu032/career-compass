namespace SwiftERP.Domain.Common;

public abstract class BaseEntity<TId>
{
    public TId Id { get; set; } = default!;
    public bool IsDeleted { get; set; } = false;
}
