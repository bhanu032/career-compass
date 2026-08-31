using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Auth;
using SwiftERP.Application.Interfaces;

namespace SwiftERP.API.Controllers.v1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ICurrentUserService _currentUser;

    public AuthController(IAuthService authService, ICurrentUserService currentUser)
    {
        _authService = authService;
        _currentUser = currentUser;
    }

    [HttpPost("login")]
    [EnableRateLimiting("AuthRateLimit")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginRequestDto request)
    {
        var ip = _currentUser.IpAddress ?? "127.0.0.1";
        var result = await _authService.LoginAsync(request, ip);

        SetRefreshTokenCookie(result.RefreshToken);
        return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Login successful."));
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterRequestDto request)
    {
        var result = await _authService.RegisterAsync(request);
        SetRefreshTokenCookie(result.RefreshToken);
        return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Registration successful."));
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> RefreshToken([FromBody] RefreshTokenRequestDto? request)
    {
        var token = request?.RefreshToken ?? Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(token))
            return BadRequest(ApiResponse<AuthResponseDto>.FailureResult("Refresh token is required."));

        var ip = _currentUser.IpAddress ?? "127.0.0.1";
        var result = await _authService.RefreshTokenAsync(token, ip);

        SetRefreshTokenCookie(result.RefreshToken);
        return Ok(ApiResponse<AuthResponseDto>.SuccessResult(result, "Token refreshed."));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<string>>> Logout([FromBody] RefreshTokenRequestDto? request)
    {
        var token = request?.RefreshToken ?? Request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(token))
        {
            var ip = _currentUser.IpAddress ?? "127.0.0.1";
            await _authService.RevokeTokenAsync(token, ip);
        }

        Response.Cookies.Delete("refreshToken");
        return Ok(ApiResponse<string>.SuccessResult("Logged out successfully."));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetMe()
    {
        if (!_currentUser.UserId.HasValue)
            return Unauthorized(ApiResponse<UserDto>.FailureResult("User not authenticated."));

        var user = await _authService.GetCurrentUserAsync(_currentUser.UserId.Value);
        return Ok(ApiResponse<UserDto>.SuccessResult(user));
    }

    private void SetRefreshTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7),
            SameSite = SameSiteMode.Strict,
            Secure = true
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }
}
