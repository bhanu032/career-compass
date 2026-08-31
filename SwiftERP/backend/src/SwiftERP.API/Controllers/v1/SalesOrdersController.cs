using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Sales;
using SwiftERP.Application.Interfaces;

namespace SwiftERP.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/sales/orders")]
[Authorize]
public class SalesOrdersController : ControllerBase
{
    private readonly ISalesOrderService _salesOrderService;

    public SalesOrdersController(ISalesOrderService salesOrderService)
    {
        _salesOrderService = salesOrderService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<SalesOrderDto>>>> GetOrders([FromQuery] PagedRequest request, [FromQuery] string? status = null)
    {
        var result = await _salesOrderService.GetOrdersAsync(request, status);
        return Ok(ApiResponse<PagedResult<SalesOrderDto>>.SuccessResult(result));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<SalesOrderDto>>> GetOrder(int id)
    {
        var result = await _salesOrderService.GetOrderByIdAsync(id);
        return Ok(ApiResponse<SalesOrderDto>.SuccessResult(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<SalesOrderDto>>> CreateOrder([FromBody] CreateSalesOrderDto request)
    {
        var result = await _salesOrderService.CreateOrderAsync(request);
        return CreatedAtAction(nameof(GetOrder), new { id = result.Id, version = "1.0" }, ApiResponse<SalesOrderDto>.SuccessResult(result, "Sales order created in Draft status."));
    }

    [HttpPost("{id:int}/approve")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<SalesOrderDto>>> ApproveOrder(int id)
    {
        var result = await _salesOrderService.ApproveOrderAsync(id);
        return Ok(ApiResponse<SalesOrderDto>.SuccessResult(result, "Sales order approved and inventory stock deducted atomically."));
    }

    [HttpPost("{id:int}/reject")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<SalesOrderDto>>> RejectOrder(int id, [FromBody] RejectSalesOrderDto request)
    {
        var result = await _salesOrderService.RejectOrderAsync(id, request);
        return Ok(ApiResponse<SalesOrderDto>.SuccessResult(result, "Sales order rejected with reason."));
    }

    [HttpPost("{id:int}/fulfill")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ApiResponse<SalesOrderDto>>> FulfillOrder(int id, [FromBody] FulfillSalesOrderDto request)
    {
        var result = await _salesOrderService.FulfillOrderAsync(id, request);
        return Ok(ApiResponse<SalesOrderDto>.SuccessResult(result, $"Sales order marked as {request.Stage}."));
    }

    [HttpPost("{id:int}/cancel")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<SalesOrderDto>>> CancelOrder(int id)
    {
        var result = await _salesOrderService.CancelOrderAsync(id);
        return Ok(ApiResponse<SalesOrderDto>.SuccessResult(result, "Sales order cancelled."));
    }
}

