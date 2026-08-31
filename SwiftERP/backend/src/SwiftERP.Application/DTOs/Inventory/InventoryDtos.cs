namespace SwiftERP.Application.DTOs.Inventory;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProductCount { get; set; }
}

public class WarehouseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? ContactPerson { get; set; }
}

public class ProductDto
{
    public int Id { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal CostPrice { get; set; }
    public int CurrentStock { get; set; }
    public int MinStockThreshold { get; set; }
    public string UnitOfMeasure { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public bool IsLowStock { get; set; }
}

public class CreateProductDto
{
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal CostPrice { get; set; }
    public int InitialStock { get; set; }
    public int MinStockThreshold { get; set; } = 10;
    public string UnitOfMeasure { get; set; } = "PCS";
    public int CategoryId { get; set; }
    public int WarehouseId { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal CostPrice { get; set; }
    public int MinStockThreshold { get; set; }
    public string UnitOfMeasure { get; set; } = "PCS";
    public int CategoryId { get; set; }
}

public class StockAdjustmentDto
{
    public int ProductId { get; set; }
    public int WarehouseId { get; set; }
    public int Quantity { get; set; } // positive or negative
    public string TransactionType { get; set; } = "Adjustment"; // StockIn, StockOut, Adjustment
    public string DiscrepancyReason { get; set; } = "None"; // None, Damaged, Lost, Miscount, Theft, Expiry
    public string ReferenceNumber { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class StockLedgerDto
{
    public long Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSku { get; set; } = string.Empty;
    public int WarehouseId { get; set; }
    public string WarehouseName { get; set; } = string.Empty;
    public string TransactionType { get; set; } = string.Empty;
    public string DiscrepancyReason { get; set; } = "None";
    public int QuantityChange { get; set; }
    public int BalanceAfter { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public string? CreatedBy { get; set; }
}

public class LowStockAlertDto
{
    public int ProductId { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public int MinStockThreshold { get; set; }
    public int Deficit => MinStockThreshold - CurrentStock;
    public string CategoryName { get; set; } = string.Empty;
}

public class WarehouseTransferDto
{
    public int Id { get; set; }
    public string TransferNumber { get; set; } = string.Empty;
    public int FromWarehouseId { get; set; }
    public string FromWarehouseName { get; set; } = string.Empty;
    public int ToWarehouseId { get; set; }
    public string ToWarehouseName { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSku { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Status { get; set; } = "Completed";
    public string? Notes { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateWarehouseTransferDto
{
    public int FromWarehouseId { get; set; }
    public int ToWarehouseId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public string? Notes { get; set; }
}
