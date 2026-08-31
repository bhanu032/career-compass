-- Stored Procedure: sp_GetStockValuation
CREATE OR ALTER PROCEDURE sp_GetStockValuation
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.Name AS CategoryName,
        COUNT(p.Id) AS TotalProducts,
        ISNULL(SUM(p.CurrentStock), 0) AS TotalStockQuantity,
        ISNULL(SUM(p.CurrentStock * p.CostPrice), 0) AS TotalCostValue,
        ISNULL(SUM(p.CurrentStock * p.UnitPrice), 0) AS TotalRetailValue,
        ISNULL(SUM(p.CurrentStock * (p.UnitPrice - p.CostPrice)), 0) AS PotentialProfit
    FROM Categories c
    LEFT JOIN Products p ON c.Id = p.CategoryId AND p.IsDeleted = 0
    WHERE c.IsDeleted = 0
    GROUP BY c.Id, c.Name
    ORDER BY TotalRetailValue DESC;
END;
