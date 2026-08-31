using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Common;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;
using System.Reflection;

namespace SwiftERP.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ICurrentUserService? _currentUser;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, ICurrentUserService? currentUser = null)
        : base(options)
    {
        _currentUser = currentUser;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockLedger> StockLedgers => Set<StockLedger>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<SalesOrderItem> SalesOrderItems => Set<SalesOrderItem>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<PurchaseOrderItem> PurchaseOrderItems => Set<PurchaseOrderItem>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<AttendanceLog> AttendanceLogs => Set<AttendanceLog>();
    public DbSet<DocumentAttachment> DocumentAttachments => Set<DocumentAttachment>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<ExpenseClaim> ExpenseClaims => Set<ExpenseClaim>();
    public DbSet<SalaryAuditLog> SalaryAuditLogs => Set<SalaryAuditLog>();
    public DbSet<ApprovalDelegation> ApprovalDelegations => Set<ApprovalDelegation>();
    public DbSet<WarehouseTransfer> WarehouseTransfers => Set<WarehouseTransfer>();

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        return Database.BeginTransactionAsync(cancellationToken);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AuditableEntity<int>>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAtUtc = DateTime.UtcNow;
                if (string.IsNullOrEmpty(entry.Entity.CreatedBy))
                    entry.Entity.CreatedBy = _currentUser?.Username ?? "System";
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = DateTime.UtcNow;
                entry.Entity.UpdatedBy = _currentUser?.Username ?? "System";
            }
        }

        foreach (var entry in ChangeTracker.Entries<AuditableEntity<long>>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAtUtc = DateTime.UtcNow;
                if (string.IsNullOrEmpty(entry.Entity.CreatedBy))
                    entry.Entity.CreatedBy = _currentUser?.Username ?? "System";
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = DateTime.UtcNow;
                entry.Entity.UpdatedBy = _currentUser?.Username ?? "System";
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User & Role Many-to-Many
        modelBuilder.Entity<UserRole>(b =>
        {
            b.HasKey(ur => new { ur.UserId, ur.RoleId });
            b.HasOne(ur => ur.User).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.UserId);
            b.HasOne(ur => ur.Role).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.RoleId);
        });

        // User
        modelBuilder.Entity<User>(b =>
        {
            b.HasIndex(u => u.Username).IsUnique();
            b.HasIndex(u => u.Email).IsUnique();
            b.Property(u => u.Username).HasMaxLength(50).IsRequired();
            b.Property(u => u.Email).HasMaxLength(100).IsRequired();
        });

        // Product with RowVersion for Optimistic Concurrency
        modelBuilder.Entity<Product>(b =>
        {
            b.HasIndex(p => p.SKU).IsUnique();
            b.Property(p => p.SKU).HasMaxLength(30).IsRequired();
            b.Property(p => p.Name).HasMaxLength(150).IsRequired();
            b.Property(p => p.UnitPrice).HasPrecision(18, 2);
            b.Property(p => p.CostPrice).HasPrecision(18, 2);
            b.Property(p => p.RowVersion).IsRowVersion();
            b.HasOne(p => p.Category).WithMany(c => c.Products).HasForeignKey(p => p.CategoryId);
        });

        // StockLedger with RowVersion
        modelBuilder.Entity<StockLedger>(b =>
        {
            b.Property(l => l.RowVersion).IsRowVersion();
            b.HasOne(l => l.Product).WithMany(p => p.StockLedgers).HasForeignKey(l => l.ProductId);
            b.HasOne(l => l.Warehouse).WithMany(w => w.StockLedgers).HasForeignKey(l => l.WarehouseId);
        });

        // SalesOrder
        modelBuilder.Entity<SalesOrder>(b =>
        {
            b.HasIndex(o => o.OrderNumber).IsUnique();
            b.Property(o => o.TotalAmount).HasPrecision(18, 2);
            b.Property(o => o.Discount).HasPrecision(18, 2);
            b.Property(o => o.TaxAmount).HasPrecision(18, 2);
            b.Property(o => o.NetAmount).HasPrecision(18, 2);
            b.HasMany(o => o.Items).WithOne(i => i.SalesOrder).HasForeignKey(i => i.SalesOrderId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SalesOrderItem>(b =>
        {
            b.Property(i => i.UnitPrice).HasPrecision(18, 2);
            b.Property(i => i.TotalPrice).HasPrecision(18, 2);
        });

        // PurchaseOrder
        modelBuilder.Entity<PurchaseOrder>(b =>
        {
            b.HasIndex(o => o.OrderNumber).IsUnique();
            b.Property(o => o.TotalAmount).HasPrecision(18, 2);
            b.HasMany(o => o.Items).WithOne(i => i.PurchaseOrder).HasForeignKey(i => i.PurchaseOrderId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<PurchaseOrderItem>(b =>
        {
            b.Property(i => i.UnitPrice).HasPrecision(18, 2);
            b.Property(i => i.TotalPrice).HasPrecision(18, 2);
        });

        // Employee
        modelBuilder.Entity<Employee>(b =>
        {
            b.HasIndex(e => e.EmployeeCode).IsUnique();
            b.HasIndex(e => e.Email).IsUnique();
            b.Property(e => e.Salary).HasPrecision(18, 2);
            b.HasOne(e => e.User).WithOne().HasForeignKey<Employee>(e => e.UserId).IsRequired(false);
        });
    }
}
