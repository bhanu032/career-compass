using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Interfaces;
using SwiftERP.Application.Services;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;
using SwiftERP.Infrastructure.Data;

namespace SwiftERP.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        if (context.Roles.Any())
        {
            // Ensure HR role and HR user exist if seeded before
            var existingHrRole = context.Roles.FirstOrDefault(r => r.Name == "HR");
            if (existingHrRole == null)
            {
                existingHrRole = new Role { Name = "HR", Description = "Human Resources & Payroll Specialist", RoleType = UserRoleType.HR };
                context.Roles.Add(existingHrRole);
                await context.SaveChangesAsync();
            }

            var existingHrUser = context.Users.Include(u => u.UserRoles).FirstOrDefault(u => u.Username == "hr");
            if (existingHrUser == null)
            {
                existingHrUser = new User
                {
                    Username = "hr",
                    Email = "hr@swifterp.com",
                    FirstName = "Sarah",
                    LastName = "Jenkins",
                    PasswordHash = passwordHasher.HashPassword("Hr@123"),
                    IsActive = true
                };
                existingHrUser.UserRoles.Add(new UserRole { User = existingHrUser, Role = existingHrRole });
                context.Users.Add(existingHrUser);
                await context.SaveChangesAsync();
            }
            else
            {
                existingHrUser.PasswordHash = passwordHasher.HashPassword("Hr@123");
                existingHrUser.IsActive = true;
                if (!existingHrUser.UserRoles.Any(ur => ur.RoleId == existingHrRole.Id))
                {
                    existingHrUser.UserRoles.Add(new UserRole { User = existingHrUser, Role = existingHrRole });
                }
                await context.SaveChangesAsync();
            }
            return;
        }

        // 1. Seed Roles
        var adminRole = new Role { Name = "Admin", Description = "System Administrator", RoleType = UserRoleType.Admin };
        var managerRole = new Role { Name = "Manager", Description = "General Manager / Approver", RoleType = UserRoleType.Manager };
        var hrRole = new Role { Name = "HR", Description = "Human Resources & Payroll Specialist", RoleType = UserRoleType.HR };
        var employeeRole = new Role { Name = "Employee", Description = "Standard Employee", RoleType = UserRoleType.Employee };
        var warehouseRole = new Role { Name = "WarehouseStaff", Description = "Warehouse Staff", RoleType = UserRoleType.WarehouseStaff };

        context.Roles.AddRange(adminRole, managerRole, hrRole, employeeRole, warehouseRole);
        await context.SaveChangesAsync();

        // 2. Seed Users
        var adminUser = new User
        {
            Username = "admin",
            Email = "admin@swifterp.com",
            FirstName = "Super",
            LastName = "Admin",
            PasswordHash = passwordHasher.HashPassword("Admin@123"),
            IsActive = true
        };
        adminUser.UserRoles.Add(new UserRole { User = adminUser, Role = adminRole });

        var managerUser = new User
        {
            Username = "manager",
            Email = "manager@swifterp.com",
            FirstName = "Operations",
            LastName = "Manager",
            PasswordHash = passwordHasher.HashPassword("Manager@123"),
            IsActive = true
        };
        managerUser.UserRoles.Add(new UserRole { User = managerUser, Role = managerRole });

        var hrUser = new User
        {
            Username = "hr",
            Email = "hr@swifterp.com",
            FirstName = "Sarah",
            LastName = "Jenkins",
            PasswordHash = passwordHasher.HashPassword("Hr@123"),
            IsActive = true
        };
        hrUser.UserRoles.Add(new UserRole { User = hrUser, Role = hrRole });

        var employeeUser = new User
        {
            Username = "employee",
            Email = "employee@swifterp.com",
            FirstName = "John",
            LastName = "Doe",
            PasswordHash = passwordHasher.HashPassword("Employee@123"),
            IsActive = true
        };
        employeeUser.UserRoles.Add(new UserRole { User = employeeUser, Role = employeeRole });

        var warehouseUser = new User
        {
            Username = "warehouse",
            Email = "warehouse@swifterp.com",
            FirstName = "Alex",
            LastName = "Storekeeper",
            PasswordHash = passwordHasher.HashPassword("Warehouse@123"),
            IsActive = true
        };
        warehouseUser.UserRoles.Add(new UserRole { User = warehouseUser, Role = warehouseRole });

        context.Users.AddRange(adminUser, managerUser, hrUser, employeeUser, warehouseUser);
        await context.SaveChangesAsync();

        // 3. Seed Warehouses
        var mainWarehouse = new Warehouse
        {
            Name = "Central Distribution Hub",
            Code = "WH-MAIN",
            Location = "Building 4, Logistics Park, New Delhi",
            ContactPerson = "Alex Storekeeper"
        };
        var secondaryWarehouse = new Warehouse
        {
            Name = "West Regional Depot",
            Code = "WH-WEST",
            Location = "Sector 18, Industrial Area, Mumbai",
            ContactPerson = "Rajesh Kumar"
        };
        context.Warehouses.AddRange(mainWarehouse, secondaryWarehouse);
        await context.SaveChangesAsync();

        // 4. Seed Categories
        var electronics = new Category { Name = "Electronics & Gadgets", Code = "CAT-ELEC", Description = "Laptops, monitors, smartphones" };
        var stationery = new Category { Name = "Office Stationery", Code = "CAT-STAT", Description = "Paper, pens, desk accessories" };
        var furniture = new Category { Name = "Office Furniture", Code = "CAT-FURN", Description = "Ergonomic chairs, standing desks" };
        context.Categories.AddRange(electronics, stationery, furniture);
        await context.SaveChangesAsync();

        // 5. Seed Products
        var p1 = new Product
        {
            SKU = "PRD-LAP-001",
            Name = "Dell Latitude 5540 15.6\" i7",
            Description = "13th Gen Intel Core i7, 16GB RAM, 512GB SSD",
            UnitPrice = 1200.00m,
            CostPrice = 900.00m,
            CurrentStock = 25,
            MinStockThreshold = 10,
            UnitOfMeasure = "PCS",
            CategoryId = electronics.Id
        };
        var p2 = new Product
        {
            SKU = "PRD-MON-002",
            Name = "Dell UltraSharp 27\" 4K Monitor",
            Description = "U2723QE 4K UHD IPS USB-C Hub Monitor",
            UnitPrice = 550.00m,
            CostPrice = 380.00m,
            CurrentStock = 18,
            MinStockThreshold = 8,
            UnitOfMeasure = "PCS",
            CategoryId = electronics.Id
        };
        var p3 = new Product
        {
            SKU = "PRD-MOU-003",
            Name = "Logitech MX Master 3S Wireless Mouse",
            Description = "Quiet clicks, 8K DPI sensor",
            UnitPrice = 99.00m,
            CostPrice = 65.00m,
            CurrentStock = 4, // Low stock demo!
            MinStockThreshold = 10,
            UnitOfMeasure = "PCS",
            CategoryId = electronics.Id
        };
        var p4 = new Product
        {
            SKU = "PRD-CHR-004",
            Name = "Herman Miller Aeron Ergonomic Chair",
            Description = "Fully adjustable mesh posturefit chair",
            UnitPrice = 1150.00m,
            CostPrice = 780.00m,
            CurrentStock = 12,
            MinStockThreshold = 5,
            UnitOfMeasure = "PCS",
            CategoryId = furniture.Id
        };
        var p5 = new Product
        {
            SKU = "PRD-DSK-005",
            Name = "Dual Motor Electric Standing Desk 60x30",
            Description = "Memory presets, anti-collision sensor",
            UnitPrice = 450.00m,
            CostPrice = 290.00m,
            CurrentStock = 3, // Low stock demo!
            MinStockThreshold = 8,
            UnitOfMeasure = "PCS",
            CategoryId = furniture.Id
        };

        context.Products.AddRange(p1, p2, p3, p4, p5);
        await context.SaveChangesAsync();

        // 6. Seed Initial Stock Ledgers
        foreach (var prod in new[] { p1, p2, p3, p4, p5 })
        {
            context.StockLedgers.Add(new StockLedger
            {
                ProductId = prod.Id,
                WarehouseId = mainWarehouse.Id,
                TransactionType = StockTransactionType.StockIn,
                QuantityChange = prod.CurrentStock,
                BalanceAfter = prod.CurrentStock,
                ReferenceNumber = $"INIT-{prod.SKU}",
                Notes = "Opening inventory balance",
                CreatedBy = "admin"
            });
        }
        await context.SaveChangesAsync();

        // 7. Seed Employees
        var emp1 = new Employee
        {
            EmployeeCode = "EMP-0001",
            FirstName = "John",
            LastName = "Doe",
            Email = "employee@swifterp.com",
            Phone = "+91 98765 43210",
            Department = "Engineering",
            Designation = "Senior Software Engineer",
            DateOfJoining = DateTime.UtcNow.AddYears(-2),
            Salary = 95000.00m,
            AnnualLeaveBalance = 16,
            UserId = employeeUser.Id
        };
        var emp2 = new Employee
        {
            EmployeeCode = "EMP-0002",
            FirstName = "Priya",
            LastName = "Sharma",
            Email = "priya.sharma@swifterp.com",
            Phone = "+91 98123 45678",
            Department = "Finance",
            Designation = "Financial Analyst",
            DateOfJoining = DateTime.UtcNow.AddYears(-1),
            Salary = 75000.00m,
            AnnualLeaveBalance = 19
        };
        context.Employees.AddRange(emp1, emp2);
        await context.SaveChangesAsync();

        // 8. Seed Leave Request
        context.LeaveRequests.Add(new LeaveRequest
        {
            EmployeeId = emp1.Id,
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(9),
            LeaveType = "Annual",
            TotalDays = 3,
            Reason = "Family vacation and travel",
            Status = LeaveStatus.Pending,
            CreatedBy = "employee"
        });

        // 9. Seed Sample Sales Order
        var order1 = new SalesOrder
        {
            OrderNumber = $"SO-{DateTime.UtcNow:yyyyMMdd}-00101",
            CustomerName = "Acme Global Solutions",
            CustomerEmail = "procurement@acmeglobal.com",
            CustomerPhone = "+1 800 555 0199",
            Status = OrderStatus.Approved,
            TotalAmount = 2400.00m,
            Discount = 100.00m,
            TaxAmount = 230.00m,
            NetAmount = 2530.00m,
            ApprovedById = managerUser.Id,
            ApprovedAtUtc = DateTime.UtcNow.AddDays(-2),
            Notes = "Urgent delivery for new engineering hires",
            CreatedBy = "admin"
        };
        order1.Items.Add(new SalesOrderItem
        {
            ProductId = p1.Id,
            Quantity = 2,
            UnitPrice = 1200.00m,
            TotalPrice = 2400.00m
        });
        context.SalesOrders.Add(order1);
        await context.SaveChangesAsync();
    }
}
