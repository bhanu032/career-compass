using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Purchase;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Application.Services;

public class PurchaseOrderService : IPurchaseOrderService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public PurchaseOrderService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<PagedResult<PurchaseOrderDto>> GetOrdersAsync(PagedRequest request)
    {
        var query = _context.PurchaseOrders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .AsNoTracking()
            .Where(o => !o.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.Trim().ToLower();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(s) || o.SupplierName.ToLower().Contains(s));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(o => o.Id)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(o => new PurchaseOrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                SupplierName = o.SupplierName,
                SupplierEmail = o.SupplierEmail,
                SupplierPhone = o.SupplierPhone,
                Status = o.Status.ToString(),
                TotalAmount = o.TotalAmount,
                Notes = o.Notes,
                CreatedAtUtc = o.CreatedAtUtc,
                Items = o.Items.Select(i => new PurchaseOrderItemDto
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.TotalPrice
                }).ToList()
            }).ToListAsync();

        return new PagedResult<PurchaseOrderDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<PurchaseOrderDto> GetOrderByIdAsync(int id)
    {
        var order = await _context.PurchaseOrders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted)
            ?? throw new NotFoundException("PurchaseOrder", id);

        return new PurchaseOrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            SupplierName = order.SupplierName,
            SupplierEmail = order.SupplierEmail,
            SupplierPhone = order.SupplierPhone,
            Status = order.Status.ToString(),
            TotalAmount = order.TotalAmount,
            Notes = order.Notes,
            CreatedAtUtc = order.CreatedAtUtc,
            Items = order.Items.Select(i => new PurchaseOrderItemDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.Product.Name,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice
            }).ToList()
        };
    }

    public async Task<PurchaseOrderDto> CreateOrderAsync(CreatePurchaseOrderDto request)
    {
        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products.Where(p => productIds.Contains(p.Id) && !p.IsDeleted).ToDictionaryAsync(p => p.Id);

        decimal subtotal = 0;
        var orderItems = new List<PurchaseOrderItem>();

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
                throw new NotFoundException("Product", item.ProductId);

            var lineTotal = item.Quantity * item.UnitPrice;
            subtotal += lineTotal;

            orderItems.Add(new PurchaseOrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = lineTotal
            });
        }

        var order = new PurchaseOrder
        {
            OrderNumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
            SupplierName = request.SupplierName,
            SupplierEmail = request.SupplierEmail,
            SupplierPhone = request.SupplierPhone,
            Status = OrderStatus.Draft,
            TotalAmount = subtotal,
            Notes = request.Notes,
            Items = orderItems,
            CreatedBy = _currentUser.Username
        };

        _context.PurchaseOrders.Add(order);
        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id);
    }

    public async Task<PurchaseOrderDto> ReceiveOrderAsync(int id, int warehouseId)
    {
        using var tx = await _context.BeginTransactionAsync();
        try
        {
            var order = await _context.PurchaseOrders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted)
                ?? throw new NotFoundException("PurchaseOrder", id);

            if (order.Status == OrderStatus.Fulfilled)
                return await GetOrderByIdAsync(id);

            var warehouse = await _context.Warehouses.FirstOrDefaultAsync(w => w.Id == warehouseId && !w.IsDeleted)
                ?? throw new NotFoundException("Warehouse", warehouseId);

            foreach (var item in order.Items)
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId && !p.IsDeleted)
                    ?? throw new NotFoundException("Product", item.ProductId);

                product.CurrentStock += item.Quantity;
                product.UpdatedAtUtc = DateTime.UtcNow;
                product.UpdatedBy = _currentUser.Username;

                var ledger = new StockLedger
                {
                    ProductId = product.Id,
                    WarehouseId = warehouse.Id,
                    TransactionType = StockTransactionType.PurchaseReceipt,
                    QuantityChange = item.Quantity,
                    BalanceAfter = product.CurrentStock,
                    ReferenceNumber = order.OrderNumber,
                    Notes = $"Stock received from PO {order.OrderNumber}",
                    CreatedBy = _currentUser.Username
                };
                _context.StockLedgers.Add(ledger);
            }

            order.Status = OrderStatus.Fulfilled;
            order.ApprovedById = _currentUser.UserId;
            order.ApprovedAtUtc = DateTime.UtcNow;
            order.UpdatedAtUtc = DateTime.UtcNow;
            order.UpdatedBy = _currentUser.Username;

            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            return await GetOrderByIdAsync(id);
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }
}
