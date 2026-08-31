using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SwiftERP.Application.Common.Exceptions;
using SwiftERP.Application.Common.Models;
using System.Net;
using System.Text.Json;

namespace SwiftERP.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = exception switch
        {
            NotFoundException => HttpStatusCode.NotFound,
            ValidationException => HttpStatusCode.BadRequest,
            InsufficientStockException => HttpStatusCode.Conflict,
            ConcurrencyConflictException => HttpStatusCode.Conflict,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            _ => HttpStatusCode.InternalServerError
        };

        context.Response.StatusCode = (int)statusCode;

        ApiResponse<object> response;
        if (exception is ValidationException valEx)
        {
            var errors = valEx.Errors.SelectMany(kv => kv.Value).ToList();
            response = ApiResponse<object>.FailureResult("Validation failed.", errors);
        }
        else
        {
            response = ApiResponse<object>.FailureResult(exception.Message);
        }

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        await context.Response.WriteAsync(json);
    }
}
