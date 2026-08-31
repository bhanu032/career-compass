# ⚡ SwiftERP — Enterprise Resource Planning Suite

SwiftERP is an enterprise-grade ERP system built with a layered **.NET Core 8 Web API** backend (Clean Architecture: Domain, Application, Infrastructure, API), an **Angular 18+** standalone component web frontend with reactive forms & dynamic dashboards, an **MSSQL** database schema with EF Core migrations & reporting stored procedures, and a **React Native** companion mobile app.

---

## 🏛 Solution Architecture

```
SwiftERP/
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI for .NET test/build + Angular build
├── backend/                          # .NET 8 Clean Architecture Solution
│   ├── SwiftERP.sln
│   ├── src/
│   │   ├── SwiftERP.Domain/          # Entities (RowVersion concurrency), Enums, BaseEntity
│   │   ├── SwiftERP.Application/     # FluentValidation, DTOs, Services, Atomic Stock logic
│   │   ├── SwiftERP.Infrastructure/  # EF Core, Stored Procedures, JWT Token Generator, Seed
│   │   └── SwiftERP.API/             # Controllers (v1), Rate Limiting, Versioning, Serilog
│   └── tests/
│       └── SwiftERP.Tests/           # Unit & Integration tests (Atomic stock deduction & Leave balance)
├── frontend/                         # Angular 18+ Standalone Workspace
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                 # Auth & Role guards, Token & Error interceptors, Signals
│   │   │   ├── shared/               # Modals, StatCards, StatusBadges, Toast system
│   │   │   ├── layout/               # Sidebar navigation, Header, Role badge
│   │   │   └── features/
│   │   │       ├── auth/             # Login with 1-click Quick Demo Credentials switcher
│   │   │       ├── dashboard/        # Real-time KPIs, Category valuation, Low-stock alerts
│   │   │       ├── inventory/        # Product catalog, Stock In/Out adjustment modal
│   │   │       ├── sales/            # Order creation with item builder, 1-click Atomic Approval
│   │   │       ├── hr/               # Employee directory, Leave balance & Manager actions
│   │   │       └── reports/          # Stored Procedure valuation & sales trends
│   │   └── environments/             # Environment configs (dev & prod)
└── mobile/                           # React Native Companion App
    ├── App.tsx                       # Warehouse Scanning & Employee Leave Portal
    └── src/services/api.ts           # Axios client with Keychain secure storage
```

---

## 🔐 Core Production Standards

1. **API Versioning**: URL-based `/api/v1/...` strategy with `Asp.Versioning.Mvc`.
2. **Input Validation**: **FluentValidation** integrated into the ASP.NET Core pipeline with automatic validation.
3. **Paging & Filtering Contract**: Unified `PagedRequest` and generic `PagedResult<T>` wrapper.
4. **Standard Response Envelope**: Uniform `ApiResponse<T>` envelope and RFC 7807 `ProblemDetails` error handling.
5. **Optimistic Concurrency & Transactions**: `byte[] RowVersion` (`[Timestamp]`) on inventory tables + explicit DB transactions with rollback handling for stock operations.
6. **Structured Observability**: **Serilog** configured with structured JSON console and rolling file logging.
7. **Secure Refresh Tokens**: DB-persisted `RefreshToken` entity with rotation and `httpOnly` secure cookies.
8. **Rate Limiting**: Built-in ASP.NET Core Rate Limiter on login routes.
9. **Role-Based Security**: 4 Pre-configured roles (`Admin`, `Manager`, `Employee`, `WarehouseStaff`) guarded both backend and frontend.

---

## 🚀 Quick Start Guide

### Pre-configured Demo Accounts

| Role | Username | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin` | `Admin@123` | Full access across all modules, products, users, reports |
| **Manager** | `manager` | `Manager@123` | Approve sales orders, approve leaves, view executive reports |
| **Employee** | `employee` | `Employee@123` | View directory, submit leave requests, view profile |
| **Warehouse** | `warehouse` | `Warehouse@123` | Adjust physical stock (Stock In/Out), scan items |

---

### Running the Backend (.NET 8 Web API)

```bash
cd backend/src/SwiftERP.API
dotnet run
```
- API Base URL: `http://localhost:5001`
- Swagger UI Documentation: `http://localhost:5001/swagger`

---

### Running the Frontend (Angular 18+)

```bash
cd frontend
npm install
npm start
```
- Web Application: `http://localhost:4200`

---

### Running the Companion Mobile App (React Native)

```bash
cd mobile
npm install
npm start
```

---

## 🧪 Running Automated Tests

```bash
cd backend
dotnet test
```
- Verifies atomic stock deduction in DB transactions.
- Verifies insufficient stock rollback behavior.
- Verifies leave approval balance calculation.
