using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Sales;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Application.Services;

public class SalesOrderService : ISalesOrderService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SalesOrderService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<PagedResult<SalesOrderDto>> GetOrdersAsync(PagedRequest request, string? status = null)
    {
        var query = _context.SalesOrders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.ApprovedBy)
            .AsNoTracking()
            .Where(o => !o.IsDeleted);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, out var parsedStatus))
        {
            query = query.Where(o => o.Status == parsedStatus);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.Trim().ToLower();
            query = query.Where(o => o.OrderNumber.ToLower().Contains(s) || o.CustomerName.ToLower().Contains(s));
        }

        var totalCount = await query.CountAsync();
        var rawItems = await query
            .OrderByDescending(o => o.Id)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var items = rawItems.Select(o => MapToSalesOrderDto(o)).ToList();

        return new PagedResult<SalesOrderDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<SalesOrderDto> GetOrderByIdAsync(int id)
    {
        var order = await _context.SalesOrders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.ApprovedBy)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted)
            ?? throw new NotFoundException("SalesOrder", id);

        return MapToSalesOrderDto(order);
    }

    public async Task<SalesOrderDto> CreateOrderAsync(CreateSalesOrderDto request)
    {
        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id) && !p.IsDeleted)
            .ToDictionaryAsync(p => p.Id);

        decimal subtotal = 0;
        var orderItems = new List<SalesOrderItem>();

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
                throw new NotFoundException("Product", item.ProductId);

            var lineTotal = item.Quantity * item.UnitPrice;
            subtotal += lineTotal;

            orderItems.Add(new SalesOrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = lineTotal
            });
        }

        var netAmount = subtotal - request.Discount + request.TaxAmount;
        var orderNumber = $"SO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

        var order = new SalesOrder
        {
            OrderNumber = orderNumber,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            Status = OrderStatus.Draft,
            TotalAmount = subtotal,
            Discount = request.Discount,
            TaxAmount = request.TaxAmount,
            NetAmount = netAmount,
            Notes = request.Notes,
            Items = orderItems,
            CreatedBy = _currentUser.Username
        };

        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id);
    }

    /// <summary>
    /// Critical centerpiece: Atomically approves the sales order and deducts inventory stock 
    /// within an explicit database transaction with concurrency safeguards.
    /// </summary>
    public async Task<SalesOrderDto> ApproveOrderAsync(int id)
    {
        using var tx = await _context.BeginTransactionAsync();
        try
        {
            var order = await _context.SalesOrders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted)
                ?? throw new NotFoundException("SalesOrder", id);

            if (order.Status == OrderStatus.Approved)
            {
                return await GetOrderByIdAsync(id); // Idempotent
            }

            if (order.Status != OrderStatus.Draft)
            {
                throw new ValidationException(new Dictionary<string, string[]>
                {
                    { "Status", new[] { $"Cannot approve order with status '{order.Status}'." } }
                });
            }

            var defaultWarehouse = await _context.Warehouses.FirstOrDefaultAsync(w => !w.IsDeleted)
                ?? throw new NotFoundException("Warehouse", "Default warehouse not found.");

            // 1. Lock and validate stock for all items
            foreach (var item in order.Items)
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId && !p.IsDeleted)
                    ?? throw new NotFoundException("Product", item.ProductId);

                if (product.CurrentStock < item.Quantity)
                {
                    throw new InsufficientStockException(product.SKU, item.Quantity, product.CurrentStock);
                }

                // 2. Deduct stock atomically
                product.CurrentStock -= item.Quantity;
                product.UpdatedAtUtc = DateTime.UtcNow;
                product.UpdatedBy = _currentUser.Username;

                // 3. Record stock transaction in ledger
                var ledger = new StockLedger
                {
                    ProductId = product.Id,
                    WarehouseId = defaultWarehouse.Id,
                    TransactionType = StockTransactionType.SalesDeduction,
                    QuantityChange = -item.Quantity,
                    BalanceAfter = product.CurrentStock,
                    ReferenceNumber = order.OrderNumber,
                    Notes = $"Stock deduction for confirmed Sales Order {order.OrderNumber}",
                    CreatedBy = _currentUser.Username
                };
                _context.StockLedgers.Add(ledger);
            }

            // 4. Update order status to Approved
            order.Status = OrderStatus.Approved;
            order.ApprovedById = _currentUser.UserId;
            order.ApprovedAtUtc = DateTime.UtcNow;
            order.UpdatedAtUtc = DateTime.UtcNow;
            order.UpdatedBy = _currentUser.Username;

            // 5. Add Audit Log
            _context.AuditLogs.Add(new AuditLog
            {
                EntityName = nameof(SalesOrder),
                EntityId = order.Id.ToString(),
                Action = "Approve",
                NewValues = $"Status: Approved, NetAmount: {order.NetAmount}",
                PerformedBy = _currentUser.Username,
                PerformedAtUtc = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            return await GetOrderByIdAsync(order.Id);
        }
        catch (DbUpdateConcurrencyException)
        {
            await tx.RollbackAsync();
            throw new ConcurrencyConflictException("A concurrency conflict occurred while adjusting inventory stock. Please retry the operation.");
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<SalesOrderDto> RejectOrderAsync(int id, RejectSalesOrderDto request)
    {
        var order = await _context.SalesOrders.FindAsync(id)
            ?? throw new NotFoundException("SalesOrder", id);

        if (order.Status != OrderStatus.Draft)
            throw new ValidationException(new Dictionary<string, string[]> { { "Status", new[] { "Only Draft orders can be rejected." } } });

        if (string.IsNullOrWhiteSpace(request.RejectionReason))
            throw new ValidationException(new Dictionary<string, string[]> { { "RejectionReason", new[] { "A mandatory rejection reason is required." } } });

        order.Status = OrderStatus.Rejected;
        order.RejectionReason = request.RejectionReason;
        order.UpdatedAtUtc = DateTime.UtcNow;
        order.UpdatedBy = _currentUser.Username;

        _context.AuditLogs.Add(new AuditLog
        {
            EntityName = nameof(SalesOrder),
            EntityId = order.Id.ToString(),
            Action = "Reject",
            NewValues = $"Status: Rejected, Reason: {request.RejectionReason}",
            PerformedBy = _currentUser.Username,
            PerformedAtUtc = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
        return await GetOrderByIdAsync(id);
    }

    public async Task<SalesOrderDto> FulfillOrderAsync(int id, FulfillSalesOrderDto request)
    {
        var order = await _context.SalesOrders.FindAsync(id)
            ?? throw new NotFoundException("SalesOrder", id);

        if (order.Status != OrderStatus.Approved && order.Status != OrderStatus.Packed)
            throw new ValidationException(new Dictionary<string, string[]> { { "Status", new[] { "Only approved or packed orders can be fulfilled." } } });

        if (request.Stage.Equals("Packed", StringComparison.OrdinalIgnoreCase))
        {
            order.Status = OrderStatus.Packed;
            order.PackedAtUtc = DateTime.UtcNow;
        }
        else if (request.Stage.Equals("Shipped", StringComparison.OrdinalIgnoreCase))
        {
            order.Status = OrderStatus.Shipped;
            order.ShippedAtUtc = DateTime.UtcNow;
        }

        order.UpdatedAtUtc = DateTime.UtcNow;
        order.UpdatedBy = _currentUser.Username;

        await _context.SaveChangesAsync();
        return await GetOrderByIdAsync(id);
    }

    public async Task<SalesOrderDto> CancelOrderAsync(int id)
    {
        var order = await _context.SalesOrders.FindAsync(id)
            ?? throw new NotFoundException("SalesOrder", id);

        if (order.Status == OrderStatus.Approved)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                { "Status", new[] { "Approved orders cannot be cancelled directly without a stock return adjustment." } }
            });
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAtUtc = DateTime.UtcNow;
        order.UpdatedBy = _currentUser.Username;
        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(id);
    }

    private static SalesOrderDto MapToSalesOrderDto(SalesOrder o) => new()
    {
        Id = o.Id,
        OrderNumber = o.OrderNumber,
        CustomerName = o.CustomerName,
        CustomerEmail = o.CustomerEmail,
        CustomerPhone = o.CustomerPhone,
        Status = o.Status.ToString(),
        TotalAmount = o.TotalAmount,
        Discount = o.Discount,
        TaxAmount = o.TaxAmount,
        NetAmount = o.NetAmount,
        Notes = o.Notes,
        RejectionReason = o.RejectionReason,
        CreatedAtUtc = o.CreatedAtUtc,
        ApprovedBy = o.ApprovedBy != null ? $"{o.ApprovedBy.FirstName} {o.ApprovedBy.LastName}".Trim() : null,
        ApprovedAtUtc = o.ApprovedAtUtc,
        PackedAtUtc = o.PackedAtUtc,
        ShippedAtUtc = o.ShippedAtUtc,
        Items = o.Items.Select(i => new SalesOrderItemDto
        {
            Id = i.Id,
            ProductId = i.ProductId,
            ProductName = i.Product?.Name ?? string.Empty,
            ProductSku = i.Product?.SKU ?? string.Empty,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            TotalPrice = i.TotalPrice
        }).ToList()
    };
}

