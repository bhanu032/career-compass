using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.HR;
using SwiftERP.Application.Interfaces;

namespace SwiftERP.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/hr")]
[Authorize]
public class HrController : ControllerBase
{
    private readonly IHrService _hrService;

    public HrController(IHrService hrService)
    {
        _hrService = hrService;
    }

    [HttpGet("employees")]
    public async Task<ActionResult<ApiResponse<PagedResult<EmployeeDto>>>> GetEmployees([FromQuery] PagedRequest request, [FromQuery] string? department = null)
    {
        var result = await _hrService.GetEmployeesAsync(request, department);
        return Ok(ApiResponse<PagedResult<EmployeeDto>>.SuccessResult(result));
    }

    [HttpGet("employees/{id:int}")]
    public async Task<ActionResult<ApiResponse<EmployeeDto>>> GetEmployee(int id)
    {
        var result = await _hrService.GetEmployeeByIdAsync(id);
        return Ok(ApiResponse<EmployeeDto>.SuccessResult(result));
    }

    [HttpPost("employees")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<EmployeeDto>>> CreateEmployee([FromBody] CreateEmployeeDto request)
    {
        var result = await _hrService.CreateEmployeeAsync(request);
        return Ok(ApiResponse<EmployeeDto>.SuccessResult(result, "Employee created."));
    }

    [HttpGet("leaves")]
    public async Task<ActionResult<ApiResponse<PagedResult<LeaveRequestDto>>>> GetLeaves([FromQuery] PagedRequest request, [FromQuery] int? employeeId = null, [FromQuery] string? status = null)
    {
        var result = await _hrService.GetLeaveRequestsAsync(request, employeeId, status);
        return Ok(ApiResponse<PagedResult<LeaveRequestDto>>.SuccessResult(result));
    }

    [HttpPost("leaves")]
    public async Task<ActionResult<ApiResponse<LeaveRequestDto>>> ApplyLeave([FromBody] CreateLeaveRequestDto request)
    {
        var result = await _hrService.ApplyLeaveAsync(request);
        return Ok(ApiResponse<LeaveRequestDto>.SuccessResult(result, "Leave request submitted."));
    }

    [HttpPost("leaves/{id:int}/action")]
    [Authorize(Roles = "Admin,Manager,HR")]
    public async Task<ActionResult<ApiResponse<LeaveRequestDto>>> ProcessLeave(int id, [FromBody] LeaveActionDto request)
    {
        var result = await _hrService.ProcessLeaveAsync(id, request);
        return Ok(ApiResponse<LeaveRequestDto>.SuccessResult(result, request.Approved ? "Leave approved." : "Leave rejected."));
    }

    // ── ATTENDANCE ─────────────────────────────────────────────────────────────
    [HttpPost("attendance/check-in")]
    public async Task<ActionResult<ApiResponse<AttendanceLogDto>>> CheckIn([FromBody] AttendanceCheckInDto request)
    {
        var result = await _hrService.CheckInAsync(request);
        return Ok(ApiResponse<AttendanceLogDto>.SuccessResult(result, "Check-in recorded."));
    }

    [HttpPost("attendance/check-out")]
    public async Task<ActionResult<ApiResponse<AttendanceLogDto>>> CheckOut([FromBody] AttendanceCheckInDto request)
    {
        var result = await _hrService.CheckOutAsync(request);
        return Ok(ApiResponse<AttendanceLogDto>.SuccessResult(result, "Check-out recorded."));
    }

    [HttpGet("attendance")]
    public async Task<ActionResult<ApiResponse<PagedResult<AttendanceLogDto>>>> GetAttendance(
        [FromQuery] PagedRequest request, [FromQuery] int? employeeId = null, [FromQuery] DateTime? date = null)
    {
        var result = await _hrService.GetAttendanceLogsAsync(request, employeeId, date);
        return Ok(ApiResponse<PagedResult<AttendanceLogDto>>.SuccessResult(result));
    }

    [HttpPost("attendance/correct")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<ApiResponse<AttendanceLogDto>>> CorrectAttendance([FromBody] AttendanceCorrectionDto request)
    {
        var result = await _hrService.CorrectAttendanceAsync(request);
        return Ok(ApiResponse<AttendanceLogDto>.SuccessResult(result, "Attendance corrected."));
    }

    // ── EXPENSES ───────────────────────────────────────────────────────────────
    [HttpGet("expenses")]
    public async Task<ActionResult<ApiResponse<PagedResult<ExpenseClaimDto>>>> GetExpenses(
        [FromQuery] PagedRequest request, [FromQuery] int? employeeId = null, [FromQuery] string? status = null)
    {
        var result = await _hrService.GetExpenseClaimsAsync(request, employeeId, status);
        return Ok(ApiResponse<PagedResult<ExpenseClaimDto>>.SuccessResult(result));
    }

    [HttpPost("expenses")]
    public async Task<ActionResult<ApiResponse<ExpenseClaimDto>>> CreateExpense([FromBody] CreateExpenseClaimDto request)
    {
        var result = await _hrService.CreateExpenseClaimAsync(request);
        return Ok(ApiResponse<ExpenseClaimDto>.SuccessResult(result, "Expense claim submitted."));
    }

    [HttpPost("expenses/{id:int}/action")]
    [Authorize(Roles = "Admin,HR,Manager")]
    public async Task<ActionResult<ApiResponse<ExpenseClaimDto>>> ProcessExpense(int id, [FromBody] ExpenseActionDto request)
    {
        var result = await _hrService.ProcessExpenseClaimAsync(id, request);
        return Ok(ApiResponse<ExpenseClaimDto>.SuccessResult(result, $"Expense marked as {request.Status}."));
    }

    // ── PAYROLL & AUDIT ────────────────────────────────────────────────────────
    [HttpPut("employees/{id:int}/salary")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<ApiResponse<SalaryAuditLogDto>>> UpdateSalary(int id, [FromBody] UpdateSalaryDto request)
    {
        var result = await _hrService.UpdateSalaryAsync(id, request);
        return Ok(ApiResponse<SalaryAuditLogDto>.SuccessResult(result, "Salary updated and audit log recorded."));
    }

    [HttpGet("employees/{id:int}/payslip")]
    public async Task<ActionResult<ApiResponse<PayslipDto>>> GeneratePayslip(int id, [FromQuery] int month, [FromQuery] int year)
    {
        var result = await _hrService.GeneratePayslipAsync(id, month, year);
        return Ok(ApiResponse<PayslipDto>.SuccessResult(result));
    }

    [HttpGet("salary-audit-logs")]
    [Authorize(Roles = "Admin,HR")]
    public async Task<ActionResult<ApiResponse<List<SalaryAuditLogDto>>>> GetSalaryAuditLogs([FromQuery] int? employeeId = null)
    {
        var result = await _hrService.GetSalaryAuditLogsAsync(employeeId);
        return Ok(ApiResponse<List<SalaryAuditLogDto>>.SuccessResult(result));
    }
}
