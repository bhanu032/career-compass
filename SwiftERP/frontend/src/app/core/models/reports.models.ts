export interface DashboardMetrics {
  totalSalesRevenue: number;
  totalSalesOrders: number;
  pendingOrders: number;
  lowStockItemsCount: number;
  totalEmployees: number;
  pendingLeaveRequests: number;
  totalInventoryValuation: number;
  recentSalesTrends: SalesSummary[];
  categoryValuations: StockValuation[];
}

export interface StockValuation {
  categoryName: string;
  totalProducts: number;
  totalStockQuantity: number;
  totalCostValue: number;
  totalRetailValue: number;
  potentialProfit: number;
}

export interface SalesSummary {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
