using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.DTOs.Sales;
using SwiftERP.Application.Interfaces;
using SwiftERP.Application.Services;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;
using SwiftERP.Infrastructure.Data;
using Xunit;

namespace SwiftERP.Tests;

public class SalesOrderAtomicDeductionTests
{
    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;

        var context = new ApplicationDbContext(options);
        return context;
    }

    [Fact]
    public async Task ApproveOrder_WhenStockIsSufficient_ShouldAtomicallyDeductStockAndRecordLedger()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(1);
        mockUser.Setup(u => u.Username).Returns("manager");

        var warehouse = new Warehouse { Name = "Main Warehouse", Code = "WH-01", Location = "HQ" };
        context.Warehouses.Add(warehouse);

        var category = new Category { Name = "Hardware", Code = "HW" };
        context.Categories.Add(category);

        var product = new Product
        {
            SKU = "LAPTOP-01",
            Name = "Pro Laptop",
            UnitPrice = 1000m,
            CostPrice = 700m,
            CurrentStock = 10,
            MinStockThreshold = 2,
            CategoryId = category.Id
        };
        context.Products.Add(product);
        await context.SaveChangesAsync();

        var salesOrder = new SalesOrder
        {
            OrderNumber = "SO-TEST-001",
            CustomerName = "Acme Corp",
            CustomerEmail = "acme@test.com",
            Status = OrderStatus.Draft,
            TotalAmount = 3000m,
            NetAmount = 3000m
        };
        salesOrder.Items.Add(new SalesOrderItem
        {
            ProductId = product.Id,
            Quantity = 3,
            UnitPrice = 1000m,
            TotalPrice = 3000m
        });
        context.SalesOrders.Add(salesOrder);
        await context.SaveChangesAsync();

        var service = new SalesOrderService(context, mockUser.Object);

        // Act
        var result = await service.ApproveOrderAsync(salesOrder.Id);

        // Assert
        result.Status.Should().Be("Approved");

        var updatedProduct = await context.Products.FindAsync(product.Id);
        updatedProduct!.CurrentStock.Should().Be(7); // 10 - 3

        var ledgerEntry = await context.StockLedgers.FirstOrDefaultAsync(l => l.ProductId == product.Id && l.ReferenceNumber == salesOrder.OrderNumber);
        ledgerEntry.Should().NotBeNull();
        ledgerEntry!.QuantityChange.Should().Be(-3);
        ledgerEntry.BalanceAfter.Should().Be(7);
        ledgerEntry.TransactionType.Should().Be(StockTransactionType.SalesDeduction);
    }

    [Fact]
    public async Task ApproveOrder_WhenStockIsInsufficient_ShouldThrowInsufficientStockExceptionAndNotDeductStock()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(1);
        mockUser.Setup(u => u.Username).Returns("manager");

        var warehouse = new Warehouse { Name = "Main Warehouse", Code = "WH-01", Location = "HQ" };
        context.Warehouses.Add(warehouse);

        var product = new Product
        {
            SKU = "LAPTOP-LOW",
            Name = "Pro Laptop Low Stock",
            UnitPrice = 1000m,
            CostPrice = 700m,
            CurrentStock = 2,
            MinStockThreshold = 5
        };
        context.Products.Add(product);

        var salesOrder = new SalesOrder
        {
            OrderNumber = "SO-TEST-002",
            CustomerName = "Acme Corp",
            Status = OrderStatus.Draft
        };
        salesOrder.Items.Add(new SalesOrderItem
        {
            ProductId = product.Id,
            Quantity = 5, // Requires 5, only 2 available
            UnitPrice = 1000m,
            TotalPrice = 5000m
        });
        context.SalesOrders.Add(salesOrder);
        await context.SaveChangesAsync();

        var service = new SalesOrderService(context, mockUser.Object);

        // Act
        var act = async () => await service.ApproveOrderAsync(salesOrder.Id);

        // Assert
        await act.Should().ThrowAsync<InsufficientStockException>()
            .WithMessage("*Insufficient stock for product 'LAPTOP-LOW'*");

        var updatedProduct = await context.Products.FindAsync(product.Id);
        updatedProduct!.CurrentStock.Should().Be(2); // Stock remains untouched
    }
}
