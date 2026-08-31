using SwiftERP.Domain.Common;

namespace SwiftERP.Domain.Entities;

public class Category : AuditableEntity<int>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Code { get; set; } = string.Empty;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
