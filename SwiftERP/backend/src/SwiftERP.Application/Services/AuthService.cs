using Microsoft.EntityFrameworkCore;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.Common.Models;
using SwiftERP.Application.DTOs.Auth;
using SwiftERP.Application.Interfaces;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;
using System.Security.Cryptography;

namespace SwiftERP.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(
        IApplicationDbContext context,
        IJwtTokenGenerator jwtTokenGenerator,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string ipAddress)
    {
        var target = (request.UsernameOrEmail ?? string.Empty).Trim().ToLower();
        var user = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == target || u.Email.ToLower() == target);

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                { "Auth", new[] { "Invalid username/email or password." } }
            });
        }

        if (!user.IsActive)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                { "Auth", new[] { "This account is deactivated." } }
            });
        }

        var roles = user.UserRoles.Select(r => r.Role.Name).ToList();
        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user, roles);
        var refreshToken = GenerateRefreshToken(ipAddress);

        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = MapUserDto(user, roles)
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            throw new ValidationException(new Dictionary<string, string[]> { { "Username", new[] { "Username already exists." } } });

        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            throw new ValidationException(new Dictionary<string, string[]> { { "Email", new[] { "Email already exists." } } });

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
        {
            user.UserRoles.Add(new UserRole { User = user, Role = role });
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return await LoginAsync(new LoginRequestDto { UsernameOrEmail = user.Username, Password = request.Password }, "127.0.0.1");
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string token, string ipAddress)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

        if (user == null)
            throw new ValidationException(new Dictionary<string, string[]> { { "Token", new[] { "Invalid refresh token." } } });

        var existingToken = user.RefreshTokens.Single(x => x.Token == token);
        if (!existingToken.IsActive)
            throw new ValidationException(new Dictionary<string, string[]> { { "Token", new[] { "Refresh token is expired or revoked." } } });

        // Revoke current token and issue new one
        existingToken.RevokedAtUtc = DateTime.UtcNow;
        existingToken.RevokedByIp = ipAddress;

        var newRefreshToken = GenerateRefreshToken(ipAddress);
        existingToken.ReplacedByToken = newRefreshToken.Token;
        user.RefreshTokens.Add(newRefreshToken);

        await _context.SaveChangesAsync();

        var roles = user.UserRoles.Select(r => r.Role.Name).ToList();
        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user, roles);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshToken.Token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = MapUserDto(user, roles)
        };
    }

    public async Task RevokeTokenAsync(string token, string ipAddress)
    {
        var user = await _context.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

        if (user == null) return;
        var rToken = user.RefreshTokens.FirstOrDefault(t => t.Token == token);
        if (rToken != null && rToken.IsActive)
        {
            rToken.RevokedAtUtc = DateTime.UtcNow;
            rToken.RevokedByIp = ipAddress;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<UserDto> GetCurrentUserAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new NotFoundException("User", userId);

        return MapUserDto(user, user.UserRoles.Select(r => r.Role.Name).ToList());
    }

    private static RefreshToken GenerateRefreshToken(string ipAddress)
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);

        return new RefreshToken
        {
            Token = Convert.ToBase64String(randomBytes),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7),
            CreatedAtUtc = DateTime.UtcNow,
            CreatedByIp = ipAddress
        };
    }

    private static UserDto MapUserDto(User user, List<string> roles) => new()
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Roles = roles
    };
}

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user, IEnumerable<string> roles);
}

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}
