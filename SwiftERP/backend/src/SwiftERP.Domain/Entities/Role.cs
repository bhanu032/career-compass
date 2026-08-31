using SwiftERP.Domain.Common;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Domain.Entities;

public class Role : BaseEntity<int>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public UserRoleType RoleType { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
