using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Reports;
using SwiftERP.Application.Interfaces;

namespace SwiftERP.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<DashboardMetricsDto>>> GetDashboard()
    {
        var result = await _reportService.GetDashboardMetricsAsync();
        return Ok(ApiResponse<DashboardMetricsDto>.SuccessResult(result));
    }

    [HttpGet("stock-valuation")]
    public async Task<ActionResult<ApiResponse<List<StockValuationReportDto>>>> GetStockValuation()
    {
        var result = await _reportService.GetStockValuationReportAsync();
        return Ok(ApiResponse<List<StockValuationReportDto>>.SuccessResult(result));
    }

    [HttpGet("sales-summary")]
    public async Task<ActionResult<ApiResponse<List<SalesSummaryReportDto>>>> GetSalesSummary([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        var start = startDate ?? DateTime.UtcNow.AddDays(-30);
        var end = endDate ?? DateTime.UtcNow;
        var result = await _reportService.GetSalesSummaryReportAsync(start, end);
        return Ok(ApiResponse<List<SalesSummaryReportDto>>.SuccessResult(result));
    }
}
