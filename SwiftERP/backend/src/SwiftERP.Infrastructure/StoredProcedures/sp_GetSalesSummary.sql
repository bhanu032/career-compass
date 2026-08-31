-- Stored Procedure: sp_GetSalesSummary
CREATE OR ALTER PROCEDURE sp_GetSalesSummary
    @StartDate DATETIME2,
    @EndDate DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        CAST(o.CreatedAtUtc AS DATE) AS [Date],
        COUNT(o.Id) AS TotalOrders,
        ISNULL(SUM(o.NetAmount), 0) AS TotalRevenue,
        CASE WHEN COUNT(o.Id) > 0 THEN ISNULL(SUM(o.NetAmount), 0) / COUNT(o.Id) ELSE 0 END AS AverageOrderValue
    FROM SalesOrders o
    WHERE o.IsDeleted = 0
      AND o.Status = 2 -- Approved
      AND o.CreatedAtUtc >= @StartDate 
      AND o.CreatedAtUtc <= @EndDate
    GROUP BY CAST(o.CreatedAtUtc AS DATE)
    ORDER BY [Date] ASC;
END;
