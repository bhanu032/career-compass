using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Inventory;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Application.Services;

public class InventoryService : IInventoryService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public InventoryService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<PagedResult<ProductDto>> GetProductsAsync(PagedRequest request, int? categoryId = null)
    {
        var query = _context.Products.Include(p => p.Category).AsNoTracking().Where(p => !p.IsDeleted);

        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.Trim().ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(s) || p.SKU.ToLower().Contains(s));
        }

        query = request.SortBy?.ToLower() switch
        {
            "name" => request.SortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "sku" => request.SortDescending ? query.OrderByDescending(p => p.SKU) : query.OrderBy(p => p.SKU),
            "price" => request.SortDescending ? query.OrderByDescending(p => p.UnitPrice) : query.OrderBy(p => p.UnitPrice),
            "stock" => request.SortDescending ? query.OrderByDescending(p => p.CurrentStock) : query.OrderBy(p => p.CurrentStock),
            _ => query.OrderByDescending(p => p.Id)
        };

        var totalCount = await query.CountAsync();
        var rawItems = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var items = rawItems.Select(p => MapToProductDto(p, p.Category?.Name)).ToList();

        return new PagedResult<ProductDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<ProductDto> GetProductByIdAsync(int id)
    {
        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
            ?? throw new NotFoundException("Product", id);
        return MapToProductDto(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto request)
    {
        if (await _context.Products.AnyAsync(p => p.SKU == request.SKU && !p.IsDeleted))
            throw new ValidationException(new Dictionary<string, string[]> { { "SKU", new[] { "Product SKU already exists." } } });

        var category = await _context.Categories.FindAsync(request.CategoryId)
            ?? throw new NotFoundException("Category", request.CategoryId);

        var warehouse = await _context.Warehouses.FindAsync(request.WarehouseId)
            ?? throw new NotFoundException("Warehouse", request.WarehouseId);

        var product = new Product
        {
            SKU = request.SKU,
            Name = request.Name,
            Description = request.Description,
            UnitPrice = request.UnitPrice,
            CostPrice = request.CostPrice,
            CurrentStock = request.InitialStock,
            MinStockThreshold = request.MinStockThreshold,
            UnitOfMeasure = request.UnitOfMeasure,
            CategoryId = request.CategoryId,
            CreatedBy = _currentUser.Username
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        if (request.InitialStock > 0)
        {
            var ledger = new StockLedger
            {
                ProductId = product.Id,
                WarehouseId = request.WarehouseId,
                TransactionType = StockTransactionType.StockIn,
                QuantityChange = request.InitialStock,
                BalanceAfter = request.InitialStock,
                ReferenceNumber = $"INIT-{product.SKU}",
                Notes = "Initial stock entry on product creation",
                CreatedBy = _currentUser.Username
            };
            _context.StockLedgers.Add(ledger);
            await _context.SaveChangesAsync();
        }

        return MapToProductDto(product, category.Name);
    }

    public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto request)
    {
        var product = await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted)
            ?? throw new NotFoundException("Product", id);

        product.Name = request.Name;
        product.Description = request.Description;
        product.UnitPrice = request.UnitPrice;
        product.CostPrice = request.CostPrice;
        product.MinStockThreshold = request.MinStockThreshold;
        product.UnitOfMeasure = request.UnitOfMeasure;
        product.CategoryId = request.CategoryId;
        product.UpdatedAtUtc = DateTime.UtcNow;
        product.UpdatedBy = _currentUser.Username;

        await _context.SaveChangesAsync();
        return MapToProductDto(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id)
            ?? throw new NotFoundException("Product", id);
        product.IsDeleted = true;
        await _context.SaveChangesAsync();
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .Where(c => !c.IsDeleted)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Code = c.Code,
                Description = c.Description,
                ProductCount = c.Products.Count(p => !p.IsDeleted)
            }).ToListAsync();
    }

    public async Task<CategoryDto> CreateCategoryAsync(CategoryDto request)
    {
        var category = new Category
        {
            Name = request.Name,
            Code = request.Code,
            Description = request.Description,
            CreatedBy = _currentUser.Username
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        request.Id = category.Id;
        return request;
    }

    public async Task<List<WarehouseDto>> GetWarehousesAsync()
    {
        return await _context.Warehouses
            .AsNoTracking()
            .Where(w => !w.IsDeleted)
            .Select(w => new WarehouseDto
            {
                Id = w.Id,
                Name = w.Name,
                Code = w.Code,
                Location = w.Location,
                ContactPerson = w.ContactPerson
            }).ToListAsync();
    }

    public async Task<WarehouseDto> CreateWarehouseAsync(WarehouseDto request)
    {
        var wh = new Warehouse
        {
            Name = request.Name,
            Code = request.Code,
            Location = request.Location,
            ContactPerson = request.ContactPerson,
            CreatedBy = _currentUser.Username
        };
        _context.Warehouses.Add(wh);
        await _context.SaveChangesAsync();
        request.Id = wh.Id;
        return request;
    }

    public async Task<StockLedgerDto> AdjustStockAsync(StockAdjustmentDto request)
    {
        using var tx = await _context.BeginTransactionAsync();
        try
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId && !p.IsDeleted)
                ?? throw new NotFoundException("Product", request.ProductId);

            var warehouse = await _context.Warehouses.FirstOrDefaultAsync(w => w.Id == request.WarehouseId && !w.IsDeleted)
                ?? throw new NotFoundException("Warehouse", request.WarehouseId);

            var newBalance = product.CurrentStock + request.Quantity;
            if (newBalance < 0)
            {
                throw new InsufficientStockException(product.SKU, Math.Abs(request.Quantity), product.CurrentStock);
            }

            product.CurrentStock = newBalance;
            product.UpdatedAtUtc = DateTime.UtcNow;
            product.UpdatedBy = _currentUser.Username;

            var txType = request.Quantity > 0 ? StockTransactionType.StockIn : StockTransactionType.StockOut;
            if (Enum.TryParse<StockTransactionType>(request.TransactionType, out var parsed))
                txType = parsed;

            var reason = DiscrepancyReason.None;
            if (Enum.TryParse<DiscrepancyReason>(request.DiscrepancyReason, true, out var parsedReason))
                reason = parsedReason;

            var ledger = new StockLedger
            {
                ProductId = product.Id,
                WarehouseId = warehouse.Id,
                TransactionType = txType,
                DiscrepancyReason = reason,
                QuantityChange = request.Quantity,
                BalanceAfter = newBalance,
                ReferenceNumber = string.IsNullOrWhiteSpace(request.ReferenceNumber) ? $"ADJ-{DateTime.UtcNow:yyyyMMddHHmmss}" : request.ReferenceNumber,
                Notes = request.Notes,
                CreatedBy = _currentUser.Username
            };

            _context.StockLedgers.Add(ledger);
            await _context.SaveChangesAsync();
            await tx.CommitAsync();

            return new StockLedgerDto
            {
                Id = ledger.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                ProductSku = product.SKU,
                WarehouseId = warehouse.Id,
                WarehouseName = warehouse.Name,
                TransactionType = ledger.TransactionType.ToString(),
                DiscrepancyReason = ledger.DiscrepancyReason.ToString(),
                QuantityChange = ledger.QuantityChange,
                BalanceAfter = ledger.BalanceAfter,
                ReferenceNumber = ledger.ReferenceNumber,
                Notes = ledger.Notes,
                CreatedAtUtc = ledger.CreatedAtUtc,
                CreatedBy = ledger.CreatedBy
            };
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<PagedResult<StockLedgerDto>> GetStockLedgerAsync(PagedRequest request, int? productId = null)
    {
        var query = _context.StockLedgers
            .Include(l => l.Product)
            .Include(l => l.Warehouse)
            .AsNoTracking();

        if (productId.HasValue && productId.Value > 0)
        {
            query = query.Where(l => l.ProductId == productId.Value);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(l => l.Id)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(l => new StockLedgerDto
            {
                Id = l.Id,
                ProductId = l.ProductId,
                ProductName = l.Product.Name,
                ProductSku = l.Product.SKU,
                WarehouseId = l.WarehouseId,
                WarehouseName = l.Warehouse.Name,
                TransactionType = l.TransactionType.ToString(),
                DiscrepancyReason = l.DiscrepancyReason.ToString(),
                QuantityChange = l.QuantityChange,
                BalanceAfter = l.BalanceAfter,
                ReferenceNumber = l.ReferenceNumber,
                Notes = l.Notes,
                CreatedAtUtc = l.CreatedAtUtc,
                CreatedBy = l.CreatedBy
            }).ToListAsync();

        return new PagedResult<StockLedgerDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<WarehouseTransferDto> CreateWarehouseTransferAsync(CreateWarehouseTransferDto request)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId && !p.IsDeleted)
            ?? throw new NotFoundException("Product", request.ProductId);

        var fromWh = await _context.Warehouses.FirstOrDefaultAsync(w => w.Id == request.FromWarehouseId && !w.IsDeleted)
            ?? throw new NotFoundException("FromWarehouse", request.FromWarehouseId);

        var toWh = await _context.Warehouses.FirstOrDefaultAsync(w => w.Id == request.ToWarehouseId && !w.IsDeleted)
            ?? throw new NotFoundException("ToWarehouse", request.ToWarehouseId);

        if (request.Quantity <= 0)
            throw new ValidationException(new Dictionary<string, string[]> { { "Quantity", new[] { "Transfer quantity must be greater than zero." } } });

        var transfer = new WarehouseTransfer
        {
            TransferNumber = $"TRF-{DateTime.UtcNow:yyyyMMddHHmmss}",
            FromWarehouseId = request.FromWarehouseId,
            ToWarehouseId = request.ToWarehouseId,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            Status = "Completed",
            Notes = request.Notes,
            CreatedAtUtc = DateTime.UtcNow,
            CreatedBy = _currentUser.Username
        };

        _context.WarehouseTransfers.Add(transfer);
        await _context.SaveChangesAsync();

        return new WarehouseTransferDto
        {
            Id = transfer.Id,
            TransferNumber = transfer.TransferNumber,
            FromWarehouseId = transfer.FromWarehouseId,
            FromWarehouseName = fromWh.Name,
            ToWarehouseId = transfer.ToWarehouseId,
            ToWarehouseName = toWh.Name,
            ProductId = product.Id,
            ProductName = product.Name,
            ProductSku = product.SKU,
            Quantity = transfer.Quantity,
            Status = transfer.Status,
            Notes = transfer.Notes,
            CreatedAtUtc = transfer.CreatedAtUtc
        };
    }

    public async Task<List<WarehouseTransferDto>> GetWarehouseTransfersAsync()
    {
        return await _context.WarehouseTransfers
            .Include(t => t.FromWarehouse)
            .Include(t => t.ToWarehouse)
            .Include(t => t.Product)
            .AsNoTracking()
            .OrderByDescending(t => t.CreatedAtUtc)
            .Take(50)
            .Select(t => new WarehouseTransferDto
            {
                Id = t.Id,
                TransferNumber = t.TransferNumber,
                FromWarehouseId = t.FromWarehouseId,
                FromWarehouseName = t.FromWarehouse.Name,
                ToWarehouseId = t.ToWarehouseId,
                ToWarehouseName = t.ToWarehouse.Name,
                ProductId = t.ProductId,
                ProductName = t.Product.Name,
                ProductSku = t.Product.SKU,
                Quantity = t.Quantity,
                Status = t.Status,
                Notes = t.Notes,
                CreatedAtUtc = t.CreatedAtUtc
            }).ToListAsync();
    }

    public async Task<List<LowStockAlertDto>> GetLowStockAlertsAsync()
    {
        return await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .Where(p => !p.IsDeleted && p.CurrentStock <= p.MinStockThreshold)
            .OrderBy(p => p.CurrentStock)
            .Select(p => new LowStockAlertDto
            {
                ProductId = p.Id,
                SKU = p.SKU,
                Name = p.Name,
                CurrentStock = p.CurrentStock,
                MinStockThreshold = p.MinStockThreshold,
                CategoryName = p.Category.Name
            }).ToListAsync();
    }

    private static ProductDto MapToProductDto(Product p, string? categoryName = null) => new()
    {
        Id = p.Id,
        SKU = p.SKU,
        Name = p.Name,
        Description = p.Description,
        UnitPrice = p.UnitPrice,
        CostPrice = p.CostPrice,
        CurrentStock = p.CurrentStock,
        MinStockThreshold = p.MinStockThreshold,
        UnitOfMeasure = p.UnitOfMeasure,
        CategoryId = p.CategoryId,
        CategoryName = categoryName ?? p.Category?.Name ?? string.Empty,
        IsLowStock = p.IsLowStock
    };
}
