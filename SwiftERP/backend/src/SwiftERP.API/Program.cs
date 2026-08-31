using Asp.Versioning;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using SwiftERP.API.Extensions;
using SwiftERP.API.Middleware;
using SwiftERP.Application.Interfaces;
using SwiftERP.Application.Services;
using SwiftERP.Application.Validators;
using SwiftERP.Infrastructure.Data;
using SwiftERP.Infrastructure.Identity;
using SwiftERP.Infrastructure.Storage;
using System.Text;
using System.Threading.RateLimiting;

// 1. Initialize Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/swifterp-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    Log.Information("Starting SwiftERP Web API...");

    var builder = WebApplication.CreateBuilder(args);
    builder.Host.UseSerilog();

    // 2. Database Configuration (MSSQL with InMemory fallback for zero-friction local run)
    var useInMemory = builder.Configuration.GetValue<bool>("ConnectionStrings:UseInMemoryDatabase", false);
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
    {
        if (useInMemory || string.IsNullOrEmpty(connectionString))
        {
            options.UseInMemoryDatabase("SwiftERP_InMemoryDb")
                   .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning));
        }
        else
        {
            options.UseSqlServer(connectionString, b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName));
        }
    });

    builder.Services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

    // 3. Application Services & Identity
    builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
    builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IInventoryService, InventoryService>();
    builder.Services.AddScoped<ISalesOrderService, SalesOrderService>();
    builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();
    builder.Services.AddScoped<IHrService, HrService>();
    builder.Services.AddScoped<IManagerService, ManagerService>();
    builder.Services.AddScoped<IReportService, ReportService>();
    builder.Services.AddScoped<IDocumentService, LocalDocumentService>();

    // 4. FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

    // 5. API Versioning
    builder.Services.AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(1, 0);
        options.AssumeDefaultVersionWhenUnspecified = true;
        options.ReportApiVersions = true;
    }).AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });

    // 6. Rate Limiter (Prevent brute-force & API DDoS)
    builder.Services.AddRateLimiter(options =>
    {
        options.AddPolicy("AuthRateLimit", context =>
            RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
                factory: partition => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 100,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                }));
    });

    // 7. JWT Authentication & Authorization
    var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "SwiftERP_SuperSecret_Jwt_SigningKey_2026_Enterprise_Production_Grade!";
    var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "SwiftERP";
    var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "SwiftERP.Clients";

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
        options.AddPolicy("ManagerOrAdmin", policy => policy.RequireRole("Admin", "Manager"));
        options.AddPolicy("HrAccess", policy => policy.RequireRole("Admin", "HR", "Manager"));
        options.AddPolicy("WarehouseAccess", policy => policy.RequireRole("Admin", "Manager", "WarehouseStaff"));
    });

    // 8. CORS Configuration for Angular & React Native
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins("http://localhost:4200", "http://localhost:8081")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();

    // 9. Swagger / OpenAPI Setup with JWT Bearer Definition
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "SwiftERP Web API",
            Version = "v1",
            Description = "Full-Stack Enterprise ERP RESTful API (.NET 8 Clean Architecture)"
        });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "Enter 'Bearer' [space] and then your valid JWT token.\nExample: Bearer eyJhbGciOi...",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

    var app = builder.Build();

    // 10. Seed Database
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        await db.Database.EnsureCreatedAsync();
        await DbInitializer.SeedAsync(db, hasher);
        Log.Information("Database verified and seeded successfully.");
    }

    // 11. Middleware Pipeline
    app.UseMiddleware<GlobalExceptionMiddleware>();
    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment() || true)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "SwiftERP API v1");
            c.RoutePrefix = "swagger";
        });
    }

    app.UseCors("AllowFrontend");
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}
