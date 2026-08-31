using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.HR;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;

namespace SwiftERP.Application.Services;

public class HrService : IHrService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPasswordHasher _passwordHasher;

    public HrService(IApplicationDbContext context, ICurrentUserService currentUser, IPasswordHasher passwordHasher)
    {
        _context = context;
        _currentUser = currentUser;
        _passwordHasher = passwordHasher;
    }

    public async Task<PagedResult<EmployeeDto>> GetEmployeesAsync(PagedRequest request, string? department = null)
    {
        var query = _context.Employees.Include(e => e.User).AsNoTracking().Where(e => !e.IsDeleted);

        if (!string.IsNullOrWhiteSpace(department))
        {
            query = query.Where(e => e.Department == department);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var s = request.Search.Trim().ToLower();
            query = query.Where(e => e.FirstName.ToLower().Contains(s) || e.LastName.ToLower().Contains(s) || e.EmployeeCode.ToLower().Contains(s) || e.Email.ToLower().Contains(s));
        }

        var totalCount = await query.CountAsync();
        var rawItems = await query
            .OrderBy(e => e.FirstName)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var items = rawItems.Select(e => MapEmployeeDto(e)).ToList();

        return new PagedResult<EmployeeDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<EmployeeDto> GetEmployeeByIdAsync(int id)
    {
        var emp = await _context.Employees.Include(e => e.User).FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", id);
        return MapEmployeeDto(emp);
    }

    public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto request)
    {
        if (await _context.Employees.AnyAsync(e => e.Email == request.Email && !e.IsDeleted))
            throw new ValidationException(new Dictionary<string, string[]> { { "Email", new[] { "Employee email already exists." } } });

        int? createdUserId = null;
        if (request.CreateUserAccount && !string.IsNullOrWhiteSpace(request.Username) && !string.IsNullOrWhiteSpace(request.Password))
        {
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = _passwordHasher.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                IsActive = true
            };

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == request.Role)
                       ?? await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Employee");

            if (role != null)
                user.UserRoles.Add(new UserRole { User = user, Role = role });

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            createdUserId = user.Id;
        }

        var employeeCount = await _context.Employees.CountAsync();
        var code = $"EMP-{(employeeCount + 1):D4}";

        var employee = new Employee
        {
            EmployeeCode = code,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Department = request.Department,
            Designation = request.Designation,
            DateOfJoining = request.DateOfJoining,
            Salary = request.Salary,
            AnnualLeaveBalance = request.AnnualLeaveBalance,
            UserId = createdUserId,
            CreatedBy = _currentUser.Username
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return MapEmployeeDto(employee);
    }

    public async Task<PagedResult<LeaveRequestDto>> GetLeaveRequestsAsync(PagedRequest request, int? employeeId = null, string? status = null)
    {
        var query = _context.LeaveRequests
            .Include(l => l.Employee)
            .Include(l => l.Approver)
            .AsNoTracking()
            .Where(l => !l.IsDeleted);

        if (employeeId.HasValue && employeeId.Value > 0)
        {
            query = query.Where(l => l.EmployeeId == employeeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<LeaveStatus>(status, out var parsed))
        {
            query = query.Where(l => l.Status == parsed);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(l => l.Id)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(l => new LeaveRequestDto
            {
                Id = l.Id,
                EmployeeId = l.EmployeeId,
                EmployeeName = $"{l.Employee.FirstName} {l.Employee.LastName}".Trim(),
                EmployeeCode = l.Employee.EmployeeCode,
                Department = l.Employee.Department,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                LeaveType = l.LeaveType,
                TotalDays = l.TotalDays,
                Reason = l.Reason,
                Status = l.Status.ToString(),
                CreatedAtUtc = l.CreatedAtUtc,
                ApproverName = l.Approver != null ? $"{l.Approver.FirstName} {l.Approver.LastName}".Trim() : null,
                RejectionReason = l.RejectionReason,
                ActionAtUtc = l.ActionAtUtc
            }).ToListAsync();

        return new PagedResult<LeaveRequestDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<LeaveRequestDto> ApplyLeaveAsync(CreateLeaveRequestDto request)
    {
        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == request.EmployeeId && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        var totalDays = (int)(request.EndDate.Date - request.StartDate.Date).TotalDays + 1;
        if (totalDays <= 0)
            throw new ValidationException(new Dictionary<string, string[]> { { "Dates", new[] { "Invalid date range." } } });

        if (request.LeaveType == "Annual" && employee.AnnualLeaveBalance < totalDays)
            throw new ValidationException(new Dictionary<string, string[]> { { "Balance", new[] { $"Insufficient leave balance. Available: {employee.AnnualLeaveBalance}, Requested: {totalDays}." } } });

        var leave = new LeaveRequest
        {
            EmployeeId = employee.Id,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            LeaveType = request.LeaveType,
            TotalDays = totalDays,
            Reason = request.Reason,
            Status = LeaveStatus.Pending,
            CreatedBy = _currentUser.Username
        };

        _context.LeaveRequests.Add(leave);
        await _context.SaveChangesAsync();

        return new LeaveRequestDto
        {
            Id = leave.Id,
            EmployeeId = employee.Id,
            EmployeeName = $"{employee.FirstName} {employee.LastName}".Trim(),
            EmployeeCode = employee.EmployeeCode,
            Department = employee.Department,
            StartDate = leave.StartDate,
            EndDate = leave.EndDate,
            LeaveType = leave.LeaveType,
            TotalDays = leave.TotalDays,
            Reason = leave.Reason,
            Status = leave.Status.ToString(),
            CreatedAtUtc = leave.CreatedAtUtc
        };
    }

    public async Task<LeaveRequestDto> ProcessLeaveAsync(int leaveId, LeaveActionDto request)
    {
        var leave = await _context.LeaveRequests
            .Include(l => l.Employee)
            .FirstOrDefaultAsync(l => l.Id == leaveId && !l.IsDeleted)
            ?? throw new NotFoundException("LeaveRequest", leaveId);

        if (leave.Status != LeaveStatus.Pending)
            throw new ValidationException(new Dictionary<string, string[]> { { "Status", new[] { "Only pending leave requests can be processed." } } });

        if (request.Approved)
        {
            leave.Status = LeaveStatus.Approved;
            if (leave.LeaveType == "Annual")
            {
                leave.Employee.AnnualLeaveBalance = Math.Max(0, leave.Employee.AnnualLeaveBalance - leave.TotalDays);
            }
        }
        else
        {
            leave.Status = LeaveStatus.Rejected;
            leave.RejectionReason = request.RejectionReason;
        }

        leave.ApproverId = _currentUser.UserId;
        leave.ActionAtUtc = DateTime.UtcNow;
        leave.UpdatedAtUtc = DateTime.UtcNow;
        leave.UpdatedBy = _currentUser.Username;

        await _context.SaveChangesAsync();

        return new LeaveRequestDto
        {
            Id = leave.Id,
            EmployeeId = leave.EmployeeId,
            EmployeeName = $"{leave.Employee.FirstName} {leave.Employee.LastName}".Trim(),
            EmployeeCode = leave.Employee.EmployeeCode,
            Department = leave.Employee.Department,
            StartDate = leave.StartDate,
            EndDate = leave.EndDate,
            LeaveType = leave.LeaveType,
            TotalDays = leave.TotalDays,
            Reason = leave.Reason,
            Status = leave.Status.ToString(),
            CreatedAtUtc = leave.CreatedAtUtc,
            ApproverName = _currentUser.Username,
            RejectionReason = leave.RejectionReason,
            ActionAtUtc = leave.ActionAtUtc
        };
    }

    // ── ATTENDANCE ─────────────────────────────────────────────────────────────
    public async Task<AttendanceLogDto> CheckInAsync(AttendanceCheckInDto request)
    {
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == request.EmployeeId && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        var today = DateTime.UtcNow.Date;
        var existing = await _context.AttendanceLogs.FirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId && a.Date.Date == today);
        if (existing != null)
        {
            existing.Notes = request.Notes ?? existing.Notes;
            await _context.SaveChangesAsync();
            return MapAttendanceDto(existing, emp);
        }

        var checkIn = DateTime.UtcNow.TimeOfDay;
        var status = checkIn.Hours >= 9 && checkIn.Minutes > 30 ? "Late" : "Present";

        var log = new AttendanceLog
        {
            EmployeeId = request.EmployeeId,
            Date = today,
            CheckInTime = checkIn,
            Status = status,
            Notes = request.Notes
        };

        _context.AttendanceLogs.Add(log);
        await _context.SaveChangesAsync();
        return MapAttendanceDto(log, emp);
    }

    public async Task<AttendanceLogDto> CheckOutAsync(AttendanceCheckInDto request)
    {
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == request.EmployeeId && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        var today = DateTime.UtcNow.Date;
        var log = await _context.AttendanceLogs.FirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId && a.Date.Date == today);
        if (log == null)
        {
            log = new AttendanceLog
            {
                EmployeeId = request.EmployeeId,
                Date = today,
                CheckInTime = new TimeSpan(9, 0, 0),
                CheckOutTime = DateTime.UtcNow.TimeOfDay,
                Status = "Present",
                Notes = request.Notes
            };
            _context.AttendanceLogs.Add(log);
        }
        else
        {
            log.CheckOutTime = DateTime.UtcNow.TimeOfDay;
            if (!string.IsNullOrEmpty(request.Notes)) log.Notes = request.Notes;
        }

        await _context.SaveChangesAsync();
        return MapAttendanceDto(log, emp);
    }

    public async Task<PagedResult<AttendanceLogDto>> GetAttendanceLogsAsync(PagedRequest request, int? employeeId = null, DateTime? date = null)
    {
        var query = _context.AttendanceLogs.Include(a => a.Employee).AsNoTracking();

        if (employeeId.HasValue) query = query.Where(a => a.EmployeeId == employeeId.Value);
        if (date.HasValue) query = query.Where(a => a.Date.Date == date.Value.Date);

        var totalCount = await query.CountAsync();
        var rawItems = await query
            .OrderByDescending(a => a.Date)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var items = rawItems.Select(a => MapAttendanceDto(a, a.Employee)).ToList();
        return new PagedResult<AttendanceLogDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<AttendanceLogDto> CorrectAttendanceAsync(AttendanceCorrectionDto request)
    {
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == request.EmployeeId && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        var log = await _context.AttendanceLogs.FirstOrDefaultAsync(a => a.EmployeeId == request.EmployeeId && a.Date.Date == request.Date.Date);
        if (log == null)
        {
            log = new AttendanceLog
            {
                EmployeeId = request.EmployeeId,
                Date = request.Date.Date,
                CheckInTime = request.CheckInTime,
                CheckOutTime = request.CheckOutTime,
                Status = request.Status,
                IsManualCorrection = true,
                CorrectionReason = request.CorrectionReason
            };
            _context.AttendanceLogs.Add(log);
        }
        else
        {
            log.CheckInTime = request.CheckInTime;
            log.CheckOutTime = request.CheckOutTime;
            log.Status = request.Status;
            log.IsManualCorrection = true;
            log.CorrectionReason = request.CorrectionReason;
        }

        await _context.SaveChangesAsync();
        return MapAttendanceDto(log, emp);
    }

    // ── EXPENSES ───────────────────────────────────────────────────────────────
    public async Task<PagedResult<ExpenseClaimDto>> GetExpenseClaimsAsync(PagedRequest request, int? employeeId = null, string? status = null)
    {
        var query = _context.ExpenseClaims.Include(e => e.Employee).AsNoTracking().Where(e => !e.IsDeleted);

        if (employeeId.HasValue) query = query.Where(e => e.EmployeeId == employeeId.Value);
        if (!string.IsNullOrEmpty(status)) query = query.Where(e => e.Status == status);

        var totalCount = await query.CountAsync();
        var rawItems = await query
            .OrderByDescending(e => e.CreatedAtUtc)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var items = rawItems.Select(e => new ExpenseClaimDto
        {
            Id = e.Id,
            EmployeeId = e.EmployeeId,
            EmployeeName = $"{e.Employee.FirstName} {e.Employee.LastName}".Trim(),
            Department = e.Employee.Department,
            Title = e.Title,
            Category = e.Category,
            Amount = e.Amount,
            ReceiptUrl = e.ReceiptUrl,
            Status = e.Status,
            ManagerComment = e.ManagerComment,
            CreatedAtUtc = e.CreatedAtUtc,
            ProcessedAtUtc = e.ProcessedAtUtc
        }).ToList();

        return new PagedResult<ExpenseClaimDto>(items, totalCount, request.Page, request.PageSize);
    }

    public async Task<ExpenseClaimDto> CreateExpenseClaimAsync(CreateExpenseClaimDto request)
    {
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == request.EmployeeId && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", request.EmployeeId);

        var claim = new ExpenseClaim
        {
            EmployeeId = request.EmployeeId,
            Title = request.Title,
            Category = request.Category,
            Amount = request.Amount,
            ReceiptUrl = request.ReceiptUrl,
            Status = "Pending",
            CreatedAtUtc = DateTime.UtcNow,
            CreatedBy = _currentUser.Username
        };

        _context.ExpenseClaims.Add(claim);
        await _context.SaveChangesAsync();

        return new ExpenseClaimDto
        {
            Id = claim.Id,
            EmployeeId = claim.EmployeeId,
            EmployeeName = $"{emp.FirstName} {emp.LastName}".Trim(),
            Department = emp.Department,
            Title = claim.Title,
            Category = claim.Category,
            Amount = claim.Amount,
            ReceiptUrl = claim.ReceiptUrl,
            Status = claim.Status,
            CreatedAtUtc = claim.CreatedAtUtc
        };
    }

    public async Task<ExpenseClaimDto> ProcessExpenseClaimAsync(int claimId, ExpenseActionDto request)
    {
        var claim = await _context.ExpenseClaims.Include(e => e.Employee).FirstOrDefaultAsync(e => e.Id == claimId && !e.IsDeleted)
            ?? throw new NotFoundException("ExpenseClaim", claimId);

        claim.Status = request.Status;
        claim.ManagerComment = request.Comment;
        claim.ProcessedAtUtc = DateTime.UtcNow;
        claim.UpdatedAtUtc = DateTime.UtcNow;
        claim.UpdatedBy = _currentUser.Username;

        await _context.SaveChangesAsync();

        return new ExpenseClaimDto
        {
            Id = claim.Id,
            EmployeeId = claim.EmployeeId,
            EmployeeName = $"{claim.Employee.FirstName} {claim.Employee.LastName}".Trim(),
            Department = claim.Employee.Department,
            Title = claim.Title,
            Category = claim.Category,
            Amount = claim.Amount,
            ReceiptUrl = claim.ReceiptUrl,
            Status = claim.Status,
            ManagerComment = claim.ManagerComment,
            CreatedAtUtc = claim.CreatedAtUtc,
            ProcessedAtUtc = claim.ProcessedAtUtc
        };
    }

    // ── PAYROLL & AUDIT ────────────────────────────────────────────────────────
    public async Task<SalaryAuditLogDto> UpdateSalaryAsync(int employeeId, UpdateSalaryDto request)
    {
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", employeeId);

        var oldSalary = emp.Salary;
        emp.Salary = request.NewSalary;
        emp.UpdatedAtUtc = DateTime.UtcNow;
        emp.UpdatedBy = _currentUser.Username;

        var audit = new SalaryAuditLog
        {
            EmployeeId = employeeId,
            OldSalary = oldSalary,
            NewSalary = request.NewSalary,
            ChangedBy = _currentUser.Username ?? "HR Specialist",
            Reason = request.Reason,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.SalaryAuditLogs.Add(audit);
        await _context.SaveChangesAsync();

        return new SalaryAuditLogDto
        {
            Id = audit.Id,
            EmployeeId = employeeId,
            EmployeeName = $"{emp.FirstName} {emp.LastName}".Trim(),
            OldSalary = oldSalary,
            NewSalary = request.NewSalary,
            ChangedBy = audit.ChangedBy,
            Reason = audit.Reason,
            CreatedAtUtc = audit.CreatedAtUtc
        };
    }

    public async Task<PayslipDto> GeneratePayslipAsync(int employeeId, int month, int year)
    {
        var emp = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId && !e.IsDeleted)
            ?? throw new NotFoundException("Employee", employeeId);

        var monthlySalary = emp.Salary / 12m;
        var basic = monthlySalary * 0.50m;
        var hra = monthlySalary * 0.30m;
        var special = monthlySalary * 0.20m;
        var tax = (basic + hra + special) * 0.10m;
        var pf = basic * 0.12m;

        return new PayslipDto
        {
            EmployeeId = emp.Id,
            EmployeeName = $"{emp.FirstName} {emp.LastName}".Trim(),
            EmployeeCode = emp.EmployeeCode,
            Department = emp.Department,
            Designation = emp.Designation,
            Month = month,
            Year = year,
            BasicSalary = Math.Round(basic, 2),
            HouseRentAllowance = Math.Round(hra, 2),
            SpecialAllowance = Math.Round(special, 2),
            TaxDeduction = Math.Round(tax, 2),
            ProvidentFund = Math.Round(pf, 2)
        };
    }

    public async Task<List<SalaryAuditLogDto>> GetSalaryAuditLogsAsync(int? employeeId = null)
    {
        var query = _context.SalaryAuditLogs.Include(s => s.Employee).AsNoTracking();
        if (employeeId.HasValue) query = query.Where(s => s.EmployeeId == employeeId.Value);

        var logs = await query.OrderByDescending(s => s.CreatedAtUtc).Take(50).ToListAsync();
        return logs.Select(s => new SalaryAuditLogDto
        {
            Id = s.Id,
            EmployeeId = s.EmployeeId,
            EmployeeName = $"{s.Employee?.FirstName} {s.Employee?.LastName}".Trim(),
            OldSalary = s.OldSalary,
            NewSalary = s.NewSalary,
            ChangedBy = s.ChangedBy,
            Reason = s.Reason,
            CreatedAtUtc = s.CreatedAtUtc
        }).ToList();
    }

    private static EmployeeDto MapEmployeeDto(Employee e) => new()
    {
        Id = e.Id,
        EmployeeCode = e.EmployeeCode,
        FirstName = e.FirstName,
        LastName = e.LastName,
        Email = e.Email,
        Phone = e.Phone,
        Department = e.Department,
        Designation = e.Designation,
        DateOfJoining = e.DateOfJoining,
        Salary = e.Salary,
        AnnualLeaveBalance = e.AnnualLeaveBalance,
        ProbationEndDate = e.ProbationEndDate,
        OnboardingStatus = e.OnboardingStatus,
        IsActive = e.IsActive,
        UserId = e.UserId
    };

    private static AttendanceLogDto MapAttendanceDto(AttendanceLog a, Employee? emp) => new()
    {
        Id = a.Id,
        EmployeeId = a.EmployeeId,
        EmployeeName = emp != null ? $"{emp.FirstName} {emp.LastName}".Trim() : string.Empty,
        Department = emp?.Department ?? string.Empty,
        Date = a.Date,
        CheckInTime = a.CheckInTime,
        CheckOutTime = a.CheckOutTime,
        Status = a.Status,
        Notes = a.Notes,
        IsManualCorrection = a.IsManualCorrection,
        CorrectionReason = a.CorrectionReason
    };
}

