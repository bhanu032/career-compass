import React, { useState } from "react";
import {
  Building2,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  Server,
  Layers,
  Database,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  Boxes,
  Briefcase,
  DollarSign,
  Activity,
  Code2,
  Check,
  ChevronRight,
  Lock
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function SwiftERPPage(): JSX.Element {
  useDocumentTitle("SwiftERP — Enterprise ERP Suite (.NET 8 + Angular 18 + React Native)");

  const [activeTab, setActiveTab] = useState<"overview" | "hr" | "inventory" | "sales" | "reports" | "architecture">("overview");
  const [selectedRole, setSelectedRole] = useState<"Admin" | "HR_Manager" | "Inventory_Manager" | "Sales_Rep">("Admin");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 pt-10 pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Enterprise Portfolio Project
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              .NET 8 Clean Architecture • Angular 18 • React Native
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                SwiftERP <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Enterprise Cloud</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                A mission-critical Enterprise Resource Planning (ERP) platform built with <strong>.NET 8 Clean Architecture</strong>, <strong>Angular 18 standalone components</strong>, and <strong>React Native mobile self-service</strong>. Designed for high-concurrency inventory, multi-warehouse stock deduction, automated HR payroll workflows, and atomic transaction safety.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {["🏢 Multi-Warehouse Inventory", "👥 HR & Leave Approvals", "🛒 Atomic Sales Orders", "📊 Stored Proc Analytics", "🔐 RBAC + JWT Refresh Tokens"].map((badge, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick KPI Stats Card */}
            <div className="lg:col-span-5">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400" />
                    <span className="font-bold text-sm text-white">Live Enterprise Metrics</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    System Healthy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Monthly Sales Volume</div>
                    <div className="text-lg font-black text-emerald-400 mt-1">₹48,92,450</div>
                    <div className="text-[10px] text-emerald-500/80 font-mono mt-0.5">↑ +14.2% vs last mo</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Active Warehouse Stock</div>
                    <div className="text-lg font-black text-cyan-400 mt-1">12,480 Units</div>
                    <div className="text-[10px] text-cyan-500/80 font-mono mt-0.5">4 Active Hubs</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Active Headcount</div>
                    <div className="text-lg font-black text-indigo-400 mt-1">142 Employees</div>
                    <div className="text-[10px] text-indigo-500/80 font-mono mt-0.5">99.2% Attendance</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Pending Approvals</div>
                    <div className="text-lg font-black text-amber-400 mt-1">6 Requests</div>
                    <div className="text-[10px] text-amber-500/80 font-mono mt-0.5">Leave & Claims</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TABS ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
          {[
            { id: "overview", label: "Enterprise Overview", icon: Building2 },
            { id: "hr", label: "HR & Payroll Engine", icon: Users },
            { id: "inventory", label: "Inventory & Warehouses", icon: Package },
            { id: "sales", label: "Sales & Purchase Orders", icon: ShoppingCart },
            { id: "reports", label: "Executive Analytics", icon: TrendingUp },
            { id: "architecture", label: "Full Architecture & Code", icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40"
                    : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT 1: OVERVIEW ────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Server className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">.NET 8 Clean Architecture</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict layer isolation across <strong>Domain</strong>, <strong>Application</strong>, <strong>Infrastructure</strong>, and <strong>API</strong>. Features EF Core transactions, FluentValidation, Global Exception Handler middleware, and JWT Refresh Token auth.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Angular 18 Enterprise UI</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engineered with standalone components, reactive signals, HTTP interceptors with automatic JWT token refresh, dynamic modal dialogues, toast notification pipeline, and responsive Tailwind layouts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">React Native Mobile App</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Employee mobile companion featuring GPS-verified attendance check-in, real-time leave balance tracking, one-tap leave requests, and mobile expense receipt submissions with offline queue.
                </p>
              </div>
            </div>

            {/* Core Modules Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                Enterprise Module Ecosystem
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "HR & People",
                    items: ["Employee Directory", "Multi-Tier Leave Approvals", "Salary History & Audit Logs", "Delegation Rules"],
                    color: "border-indigo-500/30 text-indigo-400"
                  },
                  {
                    title: "Inventory & Hubs",
                    items: ["Atomic Stock Deductions", "Inter-Warehouse Transfers", "Discrepancy Audit Ledgers", "Low Stock Triggers"],
                    color: "border-cyan-500/30 text-cyan-400"
                  },
                  {
                    title: "Commerce & Sales",
                    items: ["Sales Order Lifecycle", "Purchase Order Workflow", "Vendor Bill Tracking", "Automatic Stock Allocation"],
                    color: "border-emerald-500/30 text-emerald-400"
                  },
                  {
                    title: "Security & RBAC",
                    items: ["Admin / HR / Inventory / Sales Roles", "Row-Level Authorization", "Audit Logs with IP & User", "HTTPS & Secret Hashing"],
                    color: "border-amber-500/30 text-amber-400"
                  }
                ].map((mod, i) => (
                  <div key={i} className={`p-4 rounded-xl bg-slate-950 border ${mod.color.split(" ")[0]} space-y-2`}>
                    <div className={`text-xs font-bold ${mod.color.split(" ")[1]}`}>{mod.title}</div>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {mod.items.map((it, j) => (
                        <li key={j} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-slate-500 shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT 2: HR & PAYROLL ────────────────────────────────────── */}
        {activeTab === "hr" && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">HR & Employee Management Workflow</h3>
                  <p className="text-xs text-slate-400">Complete lifecycle: onboarding, leave balance calculations, salary audits, and manager delegations.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  HrService.cs • 583 Lines
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Employee Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Salary</th>
                      <th className="p-3">Leave Balance</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                    {[
                      { name: "Rahul Sharma", dept: "Engineering", role: "Senior Backend Lead", salary: "₹18,50,000", leave: "14 Days", status: "Active" },
                      { name: "Pooja Verma", dept: "Operations", role: "Warehouse In-Charge", salary: "₹9,20,000", leave: "8 Days", status: "Active" },
                      { name: "Vikram Malhotra", dept: "Sales", role: "Enterprise Sales Head", salary: "₹22,00,000", leave: "21 Days", status: "On Leave" },
                      { name: "Ananya Iyer", dept: "Human Resources", role: "Talent Acquisition Lead", salary: "₹12,80,000", leave: "18 Days", status: "Active" },
                    ].map((emp, i) => (
                      <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-sans font-bold text-slate-200">{emp.name}</td>
                        <td className="p-3 text-slate-400">{emp.dept}</td>
                        <td className="p-3 text-slate-300">{emp.role}</td>
                        <td className="p-3 text-emerald-400 font-bold">{emp.salary}</td>
                        <td className="p-3 text-cyan-400">{emp.leave}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT 3: INVENTORY ───────────────────────────────────────── */}
        {activeTab === "inventory" && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Multi-Warehouse Inventory & Atomic Stock Deductions</h3>
                  <p className="text-xs text-slate-400">Features serializable SQL transactions to prevent race conditions during concurrent high-volume order checkouts.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
                  InventoryService.cs • 417 Lines
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Warehouse Distribution Hubs</div>
                  <div className="space-y-2">
                    {[
                      { name: "North Delhi Central Hub", capacity: "88%", skuCount: 420, val: "₹1,24,50,000" },
                      { name: "Mumbai West Fulfillment Center", capacity: "64%", skuCount: 310, val: "₹98,20,000" },
                      { name: "Bengaluru Tech Park Hub", capacity: "91%", skuCount: 540, val: "₹1,85,00,000" },
                    ].map((wh, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{wh.name}</div>
                          <div className="text-[10px] text-slate-400">{wh.skuCount} SKUs • Valuation: {wh.val}</div>
                        </div>
                        <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded-md border border-cyan-800/60 text-[11px]">
                          {wh.capacity} Cap
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Atomic Deduction Logic</div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                    <div className="text-slate-500">// SalesOrderAtomicDeduction.cs</div>
                    <div className="text-cyan-400">using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable);</div>
                    <div className="text-slate-300 mt-1">var product = await _context.Products.FindAsync(item.ProductId);</div>
                    <div className="text-amber-300">if (product.AvailableStock &lt; item.Quantity) throw new InsufficientStockException();</div>
                    <div className="text-emerald-400 mt-1">product.AvailableStock -= item.Quantity;</div>
                    <div className="text-slate-300">_context.StockLedgers.Add(new StockLedger &#123; ... &#125;);</div>
                    <div className="text-cyan-400 mt-1">await _context.SaveChangesAsync();</div>
                    <div className="text-cyan-400">await transaction.CommitAsync();</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT 4: SALES & PURCHASE ────────────────────────────────── */}
        {activeTab === "sales" && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Sales & Purchase Order Automation</h3>
                  <p className="text-xs text-slate-400">End-to-end procurement and fulfillment pipelines with automatic invoice generation and vendor balance tracking.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  SalesOrderService.cs • 320 Lines
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "SO-2026-894", client: "Tata Steel Logistics", items: 12, total: "₹4,85,000", status: "Fulfilled" },
                  { id: "SO-2026-895", client: "Reliance Retail Hub", items: 45, total: "₹18,40,000", status: "Processing" },
                  { id: "SO-2026-896", client: "Mahindra Auto Spares", items: 8, total: "₹2,15,000", status: "Pending Approval" },
                ].map((order, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-400">{order.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-200">{order.client}</div>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>{order.items} Items</span>
                      <span className="font-bold text-emerald-400">{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT 5: REPORTS & STORED PROCEDURES ──────────────────────── */}
        {activeTab === "reports" && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">High-Speed SQL Stored Procedures & Executive Analytics</h3>
                  <p className="text-xs text-slate-400">Direct execution of optimized SQL stored procedures for sub-millisecond report generation.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                  sp_GetSalesSummary.sql
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="text-amber-400 font-bold">sp_GetSalesSummary.sql</div>
                  <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`CREATE PROCEDURE sp_GetSalesSummary
    @StartDate DATETIME2,
    @EndDate DATETIME2
AS
BEGIN
    SELECT 
        CAST(CreatedAt AS DATE) AS SalesDate,
        COUNT(Id) AS TotalOrders,
        SUM(TotalAmount) AS TotalRevenue,
        AVG(TotalAmount) AS AverageOrderValue
    FROM SalesOrders
    WHERE CreatedAt BETWEEN @StartDate AND @EndDate
      AND Status = 'Fulfilled'
    GROUP BY CAST(CreatedAt AS DATE)
    ORDER BY SalesDate DESC;
END;`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="text-cyan-400 font-bold">sp_GetStockValuation.sql</div>
                  <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`CREATE PROCEDURE sp_GetStockValuation
    @WarehouseId INT = NULL
AS
BEGIN
    SELECT 
        w.Name AS WarehouseName,
        p.Category,
        COUNT(p.Id) AS TotalProducts,
        SUM(p.AvailableStock * p.UnitPrice) AS TotalValuation
    FROM Products p
    INNER JOIN Warehouses w ON p.WarehouseId = w.Id
    WHERE (@WarehouseId IS NULL OR w.Id = @WarehouseId)
    GROUP BY w.Name, p.Category
    ORDER BY TotalValuation DESC;
END;`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT 6: ARCHITECTURE & CODE TREE ────────────────────────── */}
        {activeTab === "architecture" && (
          <div className="mt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Full Stack Codebase Hierarchy (116 Source Files)</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                    <Server className="h-4 w-4" /> .NET 8 Backend
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>📁 SwiftERP.Domain/ (Entities, Enums)</div>
                    <div>📁 SwiftERP.Application/ (Services, DTOs)</div>
                    <div>📁 SwiftERP.Infrastructure/ (EF Core, SQL)</div>
                    <div>📁 SwiftERP.API/ (Controllers, Auth)</div>
                    <div>📁 SwiftERP.Tests/ (xUnit Workflows)</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code2 className="h-4 w-4" /> Angular 18 Frontend
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>📁 src/app/core/ (Services, Guards)</div>
                    <div>📁 src/app/features/dashboard/</div>
                    <div>📁 src/app/features/hr/ (Employees)</div>
                    <div>📁 src/app/features/inventory/</div>
                    <div>📁 src/app/features/sales/</div>
                    <div>📁 src/app/features/reports/</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4" /> React Native Mobile
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>📄 App.tsx (Mobile Hub)</div>
                    <div>📁 src/services/api.ts (JWT Client)</div>
                    <div>📁 src/navigation/ (Tab Navigator)</div>
                    <div>📁 src/screens/ (Attendance, Leaves)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
