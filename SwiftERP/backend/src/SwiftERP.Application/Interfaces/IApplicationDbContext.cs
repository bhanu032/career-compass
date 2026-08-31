using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SwiftERP.Domain.Entities;

namespace SwiftERP.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<Category> Categories { get; }
    DbSet<Warehouse> Warehouses { get; }
    DbSet<Product> Products { get; }
    DbSet<StockLedger> StockLedgers { get; }
    DbSet<SalesOrder> SalesOrders { get; }
    DbSet<SalesOrderItem> SalesOrderItems { get; }
    DbSet<PurchaseOrder> PurchaseOrders { get; }
    DbSet<PurchaseOrderItem> PurchaseOrderItems { get; }
    DbSet<Employee> Employees { get; }
    DbSet<LeaveRequest> LeaveRequests { get; }
    DbSet<AttendanceLog> AttendanceLogs { get; }
    DbSet<DocumentAttachment> DocumentAttachments { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<ExpenseClaim> ExpenseClaims { get; }
    DbSet<SalaryAuditLog> SalaryAuditLogs { get; }
    DbSet<ApprovalDelegation> ApprovalDelegations { get; }
    DbSet<WarehouseTransfer> WarehouseTransfers { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}
