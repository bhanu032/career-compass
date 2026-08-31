using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using SwiftERP.Application.DTOs.HR;
using SwiftERP.Application.Interfaces;
using SwiftERP.Application.Services;
using SwiftERP.Domain.Entities;
using SwiftERP.Domain.Enums;
using SwiftERP.Infrastructure.Data;
using Xunit;

namespace SwiftERP.Tests;

public class LeaveWorkflowTests
{
    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task ProcessLeave_WhenApproved_ShouldDeductAnnualLeaveBalance()
    {
        // Arrange
        var context = CreateInMemoryDbContext();
        var mockUser = new Mock<ICurrentUserService>();
        mockUser.Setup(u => u.UserId).Returns(10);
        mockUser.Setup(u => u.Username).Returns("manager");

        var mockHasher = new Mock<IPasswordHasher>();

        var employee = new Employee
        {
            EmployeeCode = "EMP-001",
            FirstName = "Alice",
            LastName = "Smith",
            Email = "alice@test.com",
            AnnualLeaveBalance = 20
        };
        context.Employees.Add(employee);
        await context.SaveChangesAsync();

        var leave = new LeaveRequest
        {
            EmployeeId = employee.Id,
            StartDate = DateTime.UtcNow.AddDays(1),
            EndDate = DateTime.UtcNow.AddDays(3),
            LeaveType = "Annual",
            TotalDays = 3,
            Reason = "Personal vacation",
            Status = LeaveStatus.Pending
        };
        context.LeaveRequests.Add(leave);
        await context.SaveChangesAsync();

        var service = new HrService(context, mockUser.Object, mockHasher.Object);

        // Act
        var result = await service.ProcessLeaveAsync(leave.Id, new LeaveActionDto { Approved = true });

        // Assert
        result.Status.Should().Be("Approved");
        var updatedEmp = await context.Employees.FindAsync(employee.Id);
        updatedEmp!.AnnualLeaveBalance.Should().Be(17); // 20 - 3
    }
}
