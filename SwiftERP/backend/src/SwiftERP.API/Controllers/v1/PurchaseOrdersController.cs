using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Purchase;
using SwiftERP.Application.Interfaces;

namespace SwiftERP.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/purchase/orders")]
[Authorize]
public class PurchaseOrdersController : ControllerBase
{
    private readonly IPurchaseOrderService _purchaseOrderService;
    private readonly IDocumentService _documentService;

    public PurchaseOrdersController(IPurchaseOrderService purchaseOrderService, IDocumentService documentService)
    {
        _purchaseOrderService = purchaseOrderService;
        _documentService = documentService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<PurchaseOrderDto>>>> GetOrders([FromQuery] PagedRequest request)
    {
        var result = await _purchaseOrderService.GetOrdersAsync(request);
        return Ok(ApiResponse<PagedResult<PurchaseOrderDto>>.SuccessResult(result));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<PurchaseOrderDto>>> GetOrder(int id)
    {
        var result = await _purchaseOrderService.GetOrderByIdAsync(id);
        return Ok(ApiResponse<PurchaseOrderDto>.SuccessResult(result));
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<PurchaseOrderDto>>> CreateOrder([FromBody] CreatePurchaseOrderDto request)
    {
        var result = await _purchaseOrderService.CreateOrderAsync(request);
        return CreatedAtAction(nameof(GetOrder), new { id = result.Id, version = "1.0" }, ApiResponse<PurchaseOrderDto>.SuccessResult(result, "Purchase order created."));
    }

    [HttpPost("{id:int}/receive")]
    [Authorize(Roles = "Admin,Manager,WarehouseStaff")]
    public async Task<ActionResult<ApiResponse<PurchaseOrderDto>>> ReceiveOrder(int id, [FromQuery] int warehouseId)
    {
        var result = await _purchaseOrderService.ReceiveOrderAsync(id, warehouseId);
        return Ok(ApiResponse<PurchaseOrderDto>.SuccessResult(result, "Goods received and stock incremented."));
    }

    [HttpPost("{id:int}/attachments")]
    public async Task<ActionResult<ApiResponse<DocumentAttachmentDto>>> UploadAttachment(int id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<DocumentAttachmentDto>.FailureResult("No file uploaded."));

        using var stream = file.OpenReadStream();
        var result = await _documentService.UploadAttachmentAsync("PurchaseOrder", id, stream, file.FileName, file.ContentType, file.Length);
        return Ok(ApiResponse<DocumentAttachmentDto>.SuccessResult(result, "Attachment uploaded."));
    }

    [HttpGet("{id:int}/attachments")]
    public async Task<ActionResult<ApiResponse<List<DocumentAttachmentDto>>>> GetAttachments(int id)
    {
        var result = await _documentService.GetAttachmentsAsync("PurchaseOrder", id);
        return Ok(ApiResponse<List<DocumentAttachmentDto>>.SuccessResult(result));
    }
}
