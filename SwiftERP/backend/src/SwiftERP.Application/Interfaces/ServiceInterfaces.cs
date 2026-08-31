using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Auth;
using SwiftERP.Application.DTOs.Inventory;
using SwiftERP.Application.DTOs.Sales;
using SwiftERP.Application.DTOs.Purchase;
using SwiftERP.Application.DTOs.HR;
using SwiftERP.Application.DTOs.Reports;

namespace SwiftERP.Application.Interfaces;

public interface ICurrentUserService
{
    int? UserId { get; }
    string? Username { get; }
    string? Role { get; }
    string? IpAddress { get; }
}

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string ipAddress);
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> RefreshTokenAsync(string token, string ipAddress);
    Task RevokeTokenAsync(string token, string ipAddress);
    Task<UserDto> GetCurrentUserAsync(int userId);
}

public interface IInventoryService
{
    Task<PagedResult<ProductDto>> GetProductsAsync(PagedRequest request, int? categoryId = null);
    Task<ProductDto> GetProductByIdAsync(int id);
    Task<ProductDto> CreateProductAsync(CreateProductDto request);
    Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto request);
    Task DeleteProductAsync(int id);
    Task<List<CategoryDto>> GetCategoriesAsync();
    Task<CategoryDto> CreateCategoryAsync(CategoryDto request);
    Task<List<WarehouseDto>> GetWarehousesAsync();
    Task<WarehouseDto> CreateWarehouseAsync(WarehouseDto request);
    Task<StockLedgerDto> AdjustStockAsync(StockAdjustmentDto request);
    Task<PagedResult<StockLedgerDto>> GetStockLedgerAsync(PagedRequest request, int? productId = null);
    Task<List<LowStockAlertDto>> GetLowStockAlertsAsync();
    Task<WarehouseTransferDto> CreateWarehouseTransferAsync(CreateWarehouseTransferDto request);
    Task<List<WarehouseTransferDto>> GetWarehouseTransfersAsync();
}

public interface ISalesOrderService
{
    Task<PagedResult<SalesOrderDto>> GetOrdersAsync(PagedRequest request, string? status = null);
    Task<SalesOrderDto> GetOrderByIdAsync(int id);
    Task<SalesOrderDto> CreateOrderAsync(CreateSalesOrderDto request);
    Task<SalesOrderDto> ApproveOrderAsync(int id);
    Task<SalesOrderDto> RejectOrderAsync(int id, RejectSalesOrderDto request);
    Task<SalesOrderDto> FulfillOrderAsync(int id, FulfillSalesOrderDto request);
    Task<SalesOrderDto> CancelOrderAsync(int id);
}

public interface IPurchaseOrderService
{
    Task<PagedResult<PurchaseOrderDto>> GetOrdersAsync(PagedRequest request);
    Task<PurchaseOrderDto> GetOrderByIdAsync(int id);
    Task<PurchaseOrderDto> CreateOrderAsync(CreatePurchaseOrderDto request);
    Task<PurchaseOrderDto> ReceiveOrderAsync(int id, int warehouseId);
}

public interface IHrService
{
    Task<PagedResult<EmployeeDto>> GetEmployeesAsync(PagedRequest request, string? department = null);
    Task<EmployeeDto> GetEmployeeByIdAsync(int id);
    Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto request);
    Task<PagedResult<LeaveRequestDto>> GetLeaveRequestsAsync(PagedRequest request, int? employeeId = null, string? status = null);
    Task<LeaveRequestDto> ApplyLeaveAsync(CreateLeaveRequestDto request);
    Task<LeaveRequestDto> ProcessLeaveAsync(int leaveId, LeaveActionDto request);

    // Attendance
    Task<AttendanceLogDto> CheckInAsync(AttendanceCheckInDto request);
    Task<AttendanceLogDto> CheckOutAsync(AttendanceCheckInDto request);
    Task<PagedResult<AttendanceLogDto>> GetAttendanceLogsAsync(PagedRequest request, int? employeeId = null, DateTime? date = null);
    Task<AttendanceLogDto> CorrectAttendanceAsync(AttendanceCorrectionDto request);

    // Expenses
    Task<PagedResult<ExpenseClaimDto>> GetExpenseClaimsAsync(PagedRequest request, int? employeeId = null, string? status = null);
    Task<ExpenseClaimDto> CreateExpenseClaimAsync(CreateExpenseClaimDto request);
    Task<ExpenseClaimDto> ProcessExpenseClaimAsync(int claimId, ExpenseActionDto request);

    // Payroll & Audit
    Task<SalaryAuditLogDto> UpdateSalaryAsync(int employeeId, UpdateSalaryDto request);
    Task<PayslipDto> GeneratePayslipAsync(int employeeId, int month, int year);
    Task<List<SalaryAuditLogDto>> GetSalaryAuditLogsAsync(int? employeeId = null);
}

public interface IManagerService
{
    Task<ApprovalDelegationDto> CreateDelegationAsync(CreateApprovalDelegationDto request);
    Task<List<ApprovalDelegationDto>> GetDelegationsAsync(int? delegatorId = null);
}

public interface IReportService
{
    Task<DashboardMetricsDto> GetDashboardMetricsAsync();
    Task<List<StockValuationReportDto>> GetStockValuationReportAsync();
    Task<List<SalesSummaryReportDto>> GetSalesSummaryReportAsync(DateTime startDate, DateTime endDate);
}

public interface IDocumentService
{
    Task<DocumentAttachmentDto> UploadAttachmentAsync(string entityType, int entityId, Stream fileStream, string fileName, string contentType, long size);
    Task<(Stream stream, string contentType, string fileName)> DownloadAttachmentAsync(int attachmentId);
    Task<List<DocumentAttachmentDto>> GetAttachmentsAsync(string entityType, int entityId);
}

public class DocumentAttachmentDto
{
    public int Id { get; set; }
    public string EntityType { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
