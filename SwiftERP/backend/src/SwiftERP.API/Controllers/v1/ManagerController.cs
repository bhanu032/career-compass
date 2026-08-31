using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Sales;
using SwiftERP.Application.Interfaces;

namespace SwiftERP.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/manager")]
[Authorize(Roles = "Admin,Manager")]
public class ManagerController : ControllerBase
{
    private readonly IManagerService _managerService;

    public ManagerController(IManagerService managerService)
    {
        _managerService = managerService;
    }

    [HttpGet("delegations")]
    public async Task<ActionResult<ApiResponse<List<ApprovalDelegationDto>>>> GetDelegations([FromQuery] int? delegatorId = null)
    {
        var result = await _managerService.GetDelegationsAsync(delegatorId);
        return Ok(ApiResponse<List<ApprovalDelegationDto>>.SuccessResult(result));
    }

    [HttpPost("delegations")]
    public async Task<ActionResult<ApiResponse<ApprovalDelegationDto>>> CreateDelegation([FromBody] CreateApprovalDelegationDto request)
    {
        var result = await _managerService.CreateDelegationAsync(request);
        return Ok(ApiResponse<ApprovalDelegationDto>.SuccessResult(result, "Approval delegation registered."));
    }
}
