using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Inventory;
using SwiftERP.Application.Interfaces;

namespace SwiftERP.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/inventory")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet("products")]
    public async Task<ActionResult<ApiResponse<PagedResult<ProductDto>>>> GetProducts([FromQuery] PagedRequest request, [FromQuery] int? categoryId = null)
    {
        var result = await _inventoryService.GetProductsAsync(request, categoryId);
        return Ok(ApiResponse<PagedResult<ProductDto>>.SuccessResult(result));
    }

    [HttpGet("products/{id:int}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetProduct(int id)
    {
        var result = await _inventoryService.GetProductByIdAsync(id);
        return Ok(ApiResponse<ProductDto>.SuccessResult(result));
    }

    [HttpPost("products")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> CreateProduct([FromBody] CreateProductDto request)
    {
        var result = await _inventoryService.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetProduct), new { id = result.Id, version = "1.0" }, ApiResponse<ProductDto>.SuccessResult(result, "Product created."));
    }

    [HttpPut("products/{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> UpdateProduct(int id, [FromBody] UpdateProductDto request)
    {
        var result = await _inventoryService.UpdateProductAsync(id, request);
        return Ok(ApiResponse<ProductDto>.SuccessResult(result, "Product updated."));
    }

    [HttpDelete("products/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<string>>> DeleteProduct(int id)
    {
        await _inventoryService.DeleteProductAsync(id);
        return Ok(ApiResponse<string>.SuccessResult("Product deleted."));
    }

    [HttpPost("stock-adjust")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ApiResponse<StockLedgerDto>>> AdjustStock([FromBody] StockAdjustmentDto request)
    {
        var result = await _inventoryService.AdjustStockAsync(request);
        return Ok(ApiResponse<StockLedgerDto>.SuccessResult(result, "Stock adjusted successfully."));
    }

    [HttpGet("stock-ledger")]
    public async Task<ActionResult<ApiResponse<PagedResult<StockLedgerDto>>>> GetStockLedger([FromQuery] PagedRequest request, [FromQuery] int? productId = null)
    {
        var result = await _inventoryService.GetStockLedgerAsync(request, productId);
        return Ok(ApiResponse<PagedResult<StockLedgerDto>>.SuccessResult(result));
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<ApiResponse<List<LowStockAlertDto>>>> GetLowStockAlerts()
    {
        var result = await _inventoryService.GetLowStockAlertsAsync();
        return Ok(ApiResponse<List<LowStockAlertDto>>.SuccessResult(result));
    }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetCategories()
    {
        var result = await _inventoryService.GetCategoriesAsync();
        return Ok(ApiResponse<List<CategoryDto>>.SuccessResult(result));
    }

    [HttpPost("categories")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> CreateCategory([FromBody] CategoryDto request)
    {
        var result = await _inventoryService.CreateCategoryAsync(request);
        return Ok(ApiResponse<CategoryDto>.SuccessResult(result, "Category created."));
    }

    [HttpGet("warehouses")]
    public async Task<ActionResult<ApiResponse<List<WarehouseDto>>>> GetWarehouses()
    {
        var result = await _inventoryService.GetWarehousesAsync();
        return Ok(ApiResponse<List<WarehouseDto>>.SuccessResult(result));
    }

    [HttpPost("warehouses")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<WarehouseDto>>> CreateWarehouse([FromBody] WarehouseDto request)
    {
        var result = await _inventoryService.CreateWarehouseAsync(request);
        return Ok(ApiResponse<WarehouseDto>.SuccessResult(result, "Warehouse created."));
    }

    [HttpPost("transfers")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ApiResponse<WarehouseTransferDto>>> CreateTransfer([FromBody] CreateWarehouseTransferDto request)
    {
        var result = await _inventoryService.CreateWarehouseTransferAsync(request);
        return Ok(ApiResponse<WarehouseTransferDto>.SuccessResult(result, "Stock transfer completed."));
    }

    [HttpGet("transfers")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ApiResponse<List<WarehouseTransferDto>>>> GetTransfers()
    {
        var result = await _inventoryService.GetWarehouseTransfersAsync();
        return Ok(ApiResponse<List<WarehouseTransferDto>>.SuccessResult(result));
    }
}

