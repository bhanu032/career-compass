using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.DTOs.Reports;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Application.Services;

public class ReportService : IReportService
{
    private readonly IApplicationDbContext _context;

    public ReportService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardMetricsDto> GetDashboardMetricsAsync()
    {
        var totalSales = await _context.SalesOrders
            .Where(o => o.Status == OrderStatus.Approved && !o.IsDeleted)
            .SumAsync(o => (decimal?)o.NetAmount) ?? 0;

        var totalOrders = await _context.SalesOrders
            .CountAsync(o => !o.IsDeleted);

        var pendingOrders = await _context.SalesOrders
            .CountAsync(o => o.Status == OrderStatus.Draft && !o.IsDeleted);

        var lowStockCount = await _context.Products
            .CountAsync(p => p.CurrentStock <= p.MinStockThreshold && !p.IsDeleted);

        var totalEmployees = await _context.Employees
            .CountAsync(e => !e.IsDeleted);

        var pendingLeaves = await _context.LeaveRequests
            .CountAsync(l => l.Status == LeaveStatus.Pending && !l.IsDeleted);

        var totalInventoryVal = await _context.Products
            .Where(p => !p.IsDeleted)
            .SumAsync(p => (decimal?)p.CurrentStock * p.CostPrice) ?? 0;

        var categoryValuations = await GetStockValuationReportAsync();
        var recentSales = await GetSalesSummaryReportAsync(DateTime.UtcNow.AddDays(-30), DateTime.UtcNow);

        return new DashboardMetricsDto
        {
            TotalSalesRevenue = totalSales,
            TotalSalesOrders = totalOrders,
            PendingOrders = pendingOrders,
            LowStockItemsCount = lowStockCount,
            TotalEmployees = totalEmployees,
            PendingLeaveRequests = pendingLeaves,
            TotalInventoryValuation = totalInventoryVal,
            CategoryValuations = categoryValuations,
            RecentSalesTrends = recentSales
        };
    }

    public async Task<List<StockValuationReportDto>> GetStockValuationReportAsync()
    {
        return await _context.Categories
            .Where(c => !c.IsDeleted)
            .Select(c => new StockValuationReportDto
            {
                CategoryName = c.Name,
                TotalProducts = c.Products.Count(p => !p.IsDeleted),
                TotalStockQuantity = c.Products.Where(p => !p.IsDeleted).Sum(p => p.CurrentStock),
                TotalCostValue = c.Products.Where(p => !p.IsDeleted).Sum(p => p.CurrentStock * p.CostPrice),
                TotalRetailValue = c.Products.Where(p => !p.IsDeleted).Sum(p => p.CurrentStock * p.UnitPrice)
            }).ToListAsync();
    }

    public async Task<List<SalesSummaryReportDto>> GetSalesSummaryReportAsync(DateTime startDate, DateTime endDate)
    {
        var orders = await _context.SalesOrders
            .Where(o => o.Status == OrderStatus.Approved && !o.IsDeleted && o.CreatedAtUtc >= startDate && o.CreatedAtUtc <= endDate)
            .ToListAsync();

        return orders
            .GroupBy(o => o.CreatedAtUtc.Date)
            .OrderBy(g => g.Key)
            .Select(g => new SalesSummaryReportDto
            {
                Date = g.Key,
                TotalOrders = g.Count(),
                TotalRevenue = g.Sum(o => o.NetAmount)
            }).ToList();
    }
}
