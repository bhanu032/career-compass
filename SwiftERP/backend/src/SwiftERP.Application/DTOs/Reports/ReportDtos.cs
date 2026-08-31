namespace SwiftERP.Application.DTOs.Reports;

public class StockValuationReportDto
{
    public string CategoryName { get; set; } = string.Empty;
    public int TotalProducts { get; set; }
    public int TotalStockQuantity { get; set; }
    public decimal TotalCostValue { get; set; }
    public decimal TotalRetailValue { get; set; }
    public decimal PotentialProfit => TotalRetailValue - TotalCostValue;
}

public class SalesSummaryReportDto
{
    public DateTime Date { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue => TotalOrders > 0 ? TotalRevenue / TotalOrders : 0;
}

public class DashboardMetricsDto
{
    public decimal TotalSalesRevenue { get; set; }
    public int TotalSalesOrders { get; set; }
    public int PendingOrders { get; set; }
    public int LowStockItemsCount { get; set; }
    public int TotalEmployees { get; set; }
    public int PendingLeaveRequests { get; set; }
    public decimal TotalInventoryValuation { get; set; }
    public List<SalesSummaryReportDto> RecentSalesTrends { get; set; } = new();
    public List<StockValuationReportDto> CategoryValuations { get; set; } = new();
}
