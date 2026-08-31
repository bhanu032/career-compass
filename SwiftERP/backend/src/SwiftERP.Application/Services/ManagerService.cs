using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.DTOs.Sales;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Entities;

namespace SwiftERP.Application.Services;

public class ManagerService : IManagerService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public ManagerService(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<ApprovalDelegationDto> CreateDelegationAsync(CreateApprovalDelegationDto request)
    {
        var delegatorId = _currentUser.UserId ?? 2; // Default to manager if missing
        var delegatee = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.DelegateeUserId && !u.IsDeleted)
            ?? throw new NotFoundException("User", request.DelegateeUserId);

        var delegator = await _context.Users.FirstOrDefaultAsync(u => u.Id == delegatorId && !u.IsDeleted)
            ?? throw new NotFoundException("User", delegatorId);

        var delegation = new ApprovalDelegation
        {
            DelegatorUserId = delegatorId,
            DelegateeUserId = request.DelegateeUserId,
            StartDateUtc = request.StartDateUtc,
            EndDateUtc = request.EndDateUtc,
            IsActive = true,
            Reason = request.Reason,
            CreatedAtUtc = DateTime.UtcNow,
            CreatedBy = _currentUser.Username
        };

        _context.ApprovalDelegations.Add(delegation);
        await _context.SaveChangesAsync();

        return new ApprovalDelegationDto
        {
            Id = delegation.Id,
            DelegatorUserId = delegator.Id,
            DelegatorName = $"{delegator.FirstName} {delegator.LastName}".Trim(),
            DelegateeUserId = delegatee.Id,
            DelegateeName = $"{delegatee.FirstName} {delegatee.LastName}".Trim(),
            StartDateUtc = delegation.StartDateUtc,
            EndDateUtc = delegation.EndDateUtc,
            IsActive = delegation.IsActive,
            Reason = delegation.Reason,
            CreatedAtUtc = delegation.CreatedAtUtc
        };
    }

    public async Task<List<ApprovalDelegationDto>> GetDelegationsAsync(int? delegatorId = null)
    {
        var query = _context.ApprovalDelegations
            .Include(d => d.DelegatorUser)
            .Include(d => d.DelegateeUser)
            .AsNoTracking()
            .Where(d => !d.IsDeleted);

        if (delegatorId.HasValue) query = query.Where(d => d.DelegatorUserId == delegatorId.Value);

        var items = await query.OrderByDescending(d => d.CreatedAtUtc).Take(50).ToListAsync();

        return items.Select(d => new ApprovalDelegationDto
        {
            Id = d.Id,
            DelegatorUserId = d.DelegatorUserId,
            DelegatorName = $"{d.DelegatorUser?.FirstName} {d.DelegatorUser?.LastName}".Trim(),
            DelegateeUserId = d.DelegateeUserId,
            DelegateeName = $"{d.DelegateeUser?.FirstName} {d.DelegateeUser?.LastName}".Trim(),
            StartDateUtc = d.StartDateUtc,
            EndDateUtc = d.EndDateUtc,
            IsActive = d.IsActive,
            Reason = d.Reason,
            CreatedAtUtc = d.CreatedAtUtc
        }).ToList();
    }
}
