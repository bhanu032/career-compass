import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { DashboardMetrics } from '../../core/models/reports.models';
import { LowStockAlert, Product, Warehouse, StockAdjustment } from '../../core/models/inventory.models';
import { SalesOrder } from '../../core/models/sales.models';
import { LeaveRequest, Employee, AttendanceLog, ExpenseClaim } from '../../core/models/hr.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="page-shell">

      <!-- TOP HEADER (Dynamic for Role) -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="breadcrumb">
            <span>SwiftERP</span>
            <span class="bc-sep">/</span>
            <span class="bc-current">{{ roleDashboardTitle }}</span>
          </div>
          <h1 class="page-title">{{ greetingMessage }}, {{ userName }}</h1>
          <p class="page-subtitle">{{ roleDashboardSubtitle }}</p>
        </div>
        <div class="page-header-right">
          <div class="role-identity-pill" [ngClass]="'role-' + primaryRole.toLowerCase()">
            <span class="role-icon-dot"></span>
            <strong>{{ primaryRole }} Workspace</strong>
          </div>
        </div>
      </div>

      <!-- 1. ADMIN DASHBOARD -->
      <ng-container *ngIf="isAdmin">
        <div class="kpi-grid">
          <div class="kpi-card accent-blue">
            <div class="kpi-icon" style="background:#dbeafe;color:#2563eb">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Total Revenue</div>
              <div class="kpi-value">\${{ metrics ? (metrics.totalSalesRevenue | number:'1.0-0') : '0' }}</div>
              <div class="kpi-sub">Approved sales volume</div>
            </div>
          </div>

          <div class="kpi-card accent-green">
            <div class="kpi-icon" style="background:#d1fae5;color:#059669">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Inventory Valuation</div>
              <div class="kpi-value">\${{ metrics ? (metrics.totalInventoryValuation | number:'1.0-0') : '0' }}</div>
              <div class="kpi-sub">Total stock asset value</div>
            </div>
          </div>

          <div class="kpi-card accent-amber">
            <div class="kpi-icon" style="background:#fef3c7;color:#d97706">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Pending Approvals</div>
              <div class="kpi-value">{{ (metrics?.pendingOrders || 0) + (metrics?.pendingLeaveRequests || 0) }}</div>
              <div class="kpi-sub">{{ metrics?.pendingOrders || 0 }} orders, {{ metrics?.pendingLeaveRequests || 0 }} leaves</div>
            </div>
          </div>

          <div class="kpi-card accent-red">
            <div class="kpi-icon" style="background:#fee2e2;color:#dc2626">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Low Stock Alerts</div>
              <div class="kpi-value">{{ metrics?.lowStockItemsCount || 0 }}</div>
              <div class="kpi-sub">Items below safety margin</div>
            </div>
          </div>
        </div>

        <div class="dash-grid">
          <div class="card card-flush">
            <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
              <div>
                <div class="card-title">Inventory Valuation by Category</div>
                <div class="card-subtitle">Real-time valuation across all product categories</div>
              </div>
              <a routerLink="/reports" class="btn btn-secondary btn-sm">Full Report</a>
            </div>
            <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>SKUs</th>
                    <th>Qty On Hand</th>
                    <th>Cost Value</th>
                    <th>Retail Value</th>
                    <th>Projected Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let cat of metrics?.categoryValuations">
                    <td><strong style="color:var(--slate-900)">{{ cat.categoryName }}</strong></td>
                    <td><span class="badge badge-slate">{{ cat.totalProducts }}</span></td>
                    <td>{{ cat.totalStockQuantity | number }} pcs</td>
                    <td style="font-family:var(--font-mono);font-size:0.8rem">\${{ cat.totalCostValue | number:'1.2-2' }}</td>
                    <td style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--slate-900)">\${{ cat.totalRetailValue | number:'1.2-2' }}</td>
                    <td><span class="badge badge-success">+\${{ cat.potentialProfit | number:'1.2-2' }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title"><span style="color:var(--danger);margin-right:4px">⚠</span> Low Stock Warnings</div>
                <div class="card-subtitle">Items requiring replenishment</div>
              </div>
              <a routerLink="/inventory" class="btn btn-danger btn-sm">Reorder</a>
            </div>
            <div class="alert-list">
              <div *ngFor="let item of lowStockAlerts" class="alert-item">
                <div class="alert-item-left">
                  <span class="sku-chip">{{ item.sku }}</span>
                  <div class="alert-item-info">
                    <div class="alert-item-name">{{ item.name }}</div>
                    <div class="text-muted">{{ item.categoryName }}</div>
                  </div>
                </div>
                <div class="alert-item-right">
                  <div class="stock-count danger">{{ item.currentStock }} in stock</div>
                  <div class="text-muted">Min: {{ item.minStockThreshold }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- 2. HR SPECIALIST DASHBOARD -->
      <ng-container *ngIf="isHr">
        <div class="kpi-grid">
          <div class="kpi-card accent-blue">
            <div class="kpi-icon" style="background:#e0e7ff;color:#4338ca">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Active Headcount</div>
              <div class="kpi-value">{{ allEmployees.length }}</div>
              <div class="kpi-sub">Across 4 departments</div>
            </div>
          </div>

          <div class="kpi-card accent-green">
            <div class="kpi-icon" style="background:#d1fae5;color:#059669">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Today's Attendance</div>
              <div class="kpi-value">{{ todayAttendance.length }} / {{ allEmployees.length }}</div>
              <div class="kpi-sub">Checked-in on schedule</div>
            </div>
          </div>

          <div class="kpi-card accent-amber">
            <div class="kpi-icon" style="background:#fef3c7;color:#d97706">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Pending Expenses</div>
              <div class="kpi-value">{{ pendingExpenses.length }}</div>
              <div class="kpi-sub">Reimbursements awaiting review</div>
            </div>
          </div>

          <div class="kpi-card accent-red">
            <div class="kpi-icon" style="background:#fee2e2;color:#dc2626">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Pending Leaves</div>
              <div class="kpi-value">{{ pendingLeaves.length }}</div>
              <div class="kpi-sub">Org-wide requests</div>
            </div>
          </div>
        </div>

        <div class="dash-grid">
          <!-- Pending Expense Claims Review -->
          <div class="card card-flush">
            <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
              <div>
                <div class="card-title">Pending Expense Reimbursements</div>
                <div class="card-subtitle">Review employee travel, equipment, and meal expense claims</div>
              </div>
              <a routerLink="/hr" class="btn btn-secondary btn-sm">All HR Data</a>
            </div>
            <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Category & Title</th>
                    <th>Amount</th>
                    <th style="text-align:right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let exp of pendingExpenses">
                    <td>
                      <div style="font-weight:600;color:var(--slate-900)">{{ exp.employeeName }}</div>
                      <div class="text-muted">{{ exp.department }}</div>
                    </td>
                    <td>
                      <span class="badge badge-brand">{{ exp.category }}</span>
                      <div style="font-size:0.75rem;color:var(--slate-700);margin-top:2px">{{ exp.title }}</div>
                    </td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:var(--slate-900)">\${{ exp.amount | number:'1.2-2' }}</td>
                    <td>
                      <div class="actions-cell" style="justify-content:flex-end">
                        <button (click)="actionExpense(exp.id, 'Approved')" class="btn btn-success btn-sm">Approve</button>
                        <button (click)="actionExpense(exp.id, 'Rejected')" class="btn btn-danger btn-sm">Reject</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="!pendingExpenses.length">
                    <td colspan="4" style="text-align:center;padding:2rem;color:var(--slate-400)">
                      ✓ No pending expense claims awaiting review.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Probation Tracking Box -->
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">🕒 Probation Tracking Alerts</div>
                <div class="card-subtitle">Employees in 90-day evaluation period</div>
              </div>
            </div>
            <div class="alert-list">
              <div *ngFor="let emp of probationEmployees" class="alert-item">
                <div class="alert-item-left">
                  <div class="emp-avatar" style="width:28px;height:28px;font-size:0.7rem">{{ emp.firstName.charAt(0) }}</div>
                  <div class="alert-item-info">
                    <div class="alert-item-name">{{ emp.fullName }}</div>
                    <div class="text-muted">{{ emp.designation }} • {{ emp.department }}</div>
                  </div>
                </div>
                <div class="alert-item-right">
                  <span class="badge badge-warning">Probation Active</span>
                  <div class="text-muted" style="font-size:0.7rem">Ends {{ (emp.probationEndDate | date:'mediumDate') || '30 days' }}</div>
                </div>
              </div>
              <div *ngIf="!probationEmployees.length" class="all-good">
                <span>All current staff have completed their probation.</span>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- 3. MANAGER DASHBOARD -->
      <ng-container *ngIf="isManager">
        <div class="kpi-grid">
          <div class="kpi-card accent-amber">
            <div class="kpi-icon" style="background:#fef3c7;color:#d97706">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Orders Needing Approval</div>
              <div class="kpi-value">{{ pendingOrders.length }}</div>
              <div class="kpi-sub">Atomic stock deduction upon approval</div>
            </div>
          </div>

          <div class="kpi-card accent-blue">
            <div class="kpi-icon" style="background:#dbeafe;color:#2563eb">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Pending Leave Requests</div>
              <div class="kpi-value">{{ pendingLeaves.length }}</div>
              <div class="kpi-sub">Awaiting management authorization</div>
            </div>
          </div>

          <div class="kpi-card accent-green">
            <div class="kpi-icon" style="background:#d1fae5;color:#059669">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Fulfilled Sales</div>
              <div class="kpi-value">\${{ metrics ? (metrics.totalSalesRevenue | number:'1.0-0') : '0' }}</div>
              <div class="kpi-sub">Total revenue realized</div>
            </div>
          </div>

          <div class="kpi-card accent-red">
            <div class="kpi-icon" style="background:#fee2e2;color:#dc2626">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Low Stock Alerts</div>
              <div class="kpi-value">{{ metrics?.lowStockItemsCount || 0 }}</div>
              <div class="kpi-sub">Requires purchase replenishment</div>
            </div>
          </div>
        </div>

        <div class="dash-grid">
          <!-- Pending Sales Orders Approval Queue -->
          <div class="card card-flush">
            <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
              <div>
                <div class="card-title">Pending Sales Orders Requiring Approval</div>
                <div class="card-subtitle">Approving will atomically deduct inventory and commit ledger entry</div>
              </div>
              <a routerLink="/sales" class="btn btn-secondary btn-sm">All Orders</a>
            </div>
            <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th style="text-align:right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let o of pendingOrders">
                    <td><span class="sku-chip">{{ o.orderNumber }}</span></td>
                    <td>
                      <div style="font-weight:600;color:var(--slate-900)">{{ o.customerName }}</div>
                      <div class="text-muted">{{ o.customerEmail }}</div>
                    </td>
                    <td><span class="badge badge-slate">{{ o.items.length }} lines</span></td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:var(--slate-900)">\${{ o.netAmount | number:'1.2-2' }}</td>
                    <td>
                      <div class="actions-cell" style="justify-content:flex-end">
                        <button (click)="approveOrder(o)" class="btn btn-success btn-sm">Approve & Deduct</button>
                        <button (click)="openRejectOrder(o)" class="btn btn-danger btn-sm">Reject</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="!pendingOrders.length">
                    <td colspan="5" style="text-align:center;padding:2rem;color:var(--slate-400)">✓ No pending orders awaiting approval.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pending Leave Requests Queue -->
          <div class="card card-flush">
            <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
              <div>
                <div class="card-title">Pending Leave Approvals</div>
                <div class="card-subtitle">Staff leave requests requiring authorization</div>
              </div>
              <a routerLink="/hr" class="btn btn-secondary btn-sm">HR Center</a>
            </div>
            <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th style="text-align:right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let l of pendingLeaves">
                    <td>
                      <div style="font-weight:600;color:var(--slate-900)">{{ l.employeeName }}</div>
                      <div class="text-muted">{{ l.department }}</div>
                    </td>
                    <td><span class="badge badge-info">{{ l.totalDays }}d</span></td>
                    <td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.75rem">{{ l.reason }}</td>
                    <td>
                      <div class="actions-cell" style="justify-content:flex-end">
                        <button (click)="actionLeave(l.id, true)" class="btn btn-success btn-sm">✓</button>
                        <button (click)="actionLeave(l.id, false)" class="btn btn-danger btn-sm">✕</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="!pendingLeaves.length">
                    <td colspan="4" style="text-align:center;padding:2rem;color:var(--slate-400)">✓ No pending leave applications.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- 4. WAREHOUSE DASHBOARD -->
      <ng-container *ngIf="isWarehouse">
        <div class="kpi-grid">
          <div class="kpi-card accent-blue">
            <div class="kpi-icon" style="background:#dbeafe;color:#2563eb">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Total SKUs in Catalog</div>
              <div class="kpi-value">{{ totalProductCount }}</div>
              <div class="kpi-sub">Monitored product lines</div>
            </div>
          </div>

          <div class="kpi-card accent-red">
            <div class="kpi-icon" style="background:#fee2e2;color:#dc2626">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Low Stock Warnings</div>
              <div class="kpi-value">{{ lowStockAlerts.length }}</div>
              <div class="kpi-sub">Items requiring restock</div>
            </div>
          </div>

          <div class="kpi-card accent-green">
            <div class="kpi-icon" style="background:#d1fae5;color:#059669">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Total Physical Units</div>
              <div class="kpi-value">{{ totalStockUnits | number }}</div>
              <div class="kpi-sub">Across all warehouses</div>
            </div>
          </div>

          <div class="kpi-card accent-amber">
            <div class="kpi-icon" style="background:#fef3c7;color:#d97706">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Active Warehouses</div>
              <div class="kpi-value">{{ warehouses.length || 2 }}</div>
              <div class="kpi-sub">Fulfillment hubs</div>
            </div>
          </div>
        </div>

        <div class="dash-grid">
          <!-- Fast Stock In/Out Adjustment Widget -->
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">⚡ Fast Stock Adjustment</div>
                <div class="card-subtitle">Record physical stock intake, dispatch, or audit adjustment</div>
              </div>
            </div>
            <form (ngSubmit)="submitQuickAdjustment()" class="modal-form">
              <div class="form-group">
                <label>Product</label>
                <select [(ngModel)]="quickAdj.productId" name="qaProd" class="input-control" required>
                  <option *ngFor="let p of allProducts" [value]="p.id">
                    {{ p.sku }} — {{ p.name }} (Stock: {{ p.currentStock }})
                  </option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Operation Type</label>
                  <select [(ngModel)]="quickAdj.transactionType" name="qaType" class="input-control" required>
                    <option value="StockIn">Stock In (+ Intake)</option>
                    <option value="StockOut">Stock Out (− Dispatch)</option>
                    <option value="Adjustment">Physical Count Audit</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Discrepancy Reason</label>
                  <select [(ngModel)]="quickAdj.discrepancyReason" name="qaDisc" class="input-control">
                    <option value="None">None (Standard)</option>
                    <option value="Damaged">Damaged Goods</option>
                    <option value="Lost">Lost in Transit</option>
                    <option value="Miscount">Physical Miscount</option>
                    <option value="Theft">Theft / Pilferage</option>
                    <option value="Expiry">Expired Inventory</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Quantity Delta</label>
                  <input type="number" [(ngModel)]="quickAdj.quantity" name="qaQty" class="input-control" placeholder="10" required />
                </div>
                <div class="form-group">
                  <label>Reason / Audit Note</label>
                  <input type="text" [(ngModel)]="quickAdj.notes" name="qaNotes" class="input-control" placeholder="Supplier shipment intake" />
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block">
                Post Stock Transaction
              </button>
            </form>
          </div>

          <!-- Critical Low Stock Matrix -->
          <div class="card card-flush">
            <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
              <div>
                <div class="card-title">Critical Restock Alerts</div>
                <div class="card-subtitle">Items currently below minimum safety stock</div>
              </div>
              <a routerLink="/inventory" class="btn btn-secondary btn-sm">Full Catalog</a>
            </div>
            <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
              <table>
                <thead>
                  <tr>
                    <th>SKU & Product</th>
                    <th>Current</th>
                    <th>Min</th>
                    <th style="text-align:right">Quick +10</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of lowStockAlerts">
                    <td>
                      <span class="sku-chip">{{ item.sku }}</span>
                      <div style="font-weight:600;color:var(--slate-900);font-size:0.8125rem">{{ item.name }}</div>
                    </td>
                    <td><span class="stock-val low">{{ item.currentStock }}</span></td>
                    <td class="text-muted">{{ item.minStockThreshold }}</td>
                    <td>
                      <div class="actions-cell" style="justify-content:flex-end">
                        <button (click)="quickRestock(item, 10)" class="btn btn-secondary btn-sm">+10</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="!lowStockAlerts.length">
                    <td colspan="4" style="text-align:center;padding:2rem;color:var(--success);font-weight:600">
                      ✓ All products are stocked above safety levels.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- 5. EMPLOYEE DASHBOARD -->
      <ng-container *ngIf="isEmployee">
        <div class="kpi-grid">
          <div class="kpi-card accent-green">
            <div class="kpi-icon" style="background:#d1fae5;color:#059669">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Annual Leave Balance</div>
              <div class="kpi-value">{{ employeeProfile?.annualLeaveBalance ?? 20 }} <span style="font-size:1rem;font-weight:600">Days</span></div>
              <div class="kpi-sub">Available paid time off</div>
            </div>
          </div>

          <div class="kpi-card accent-blue">
            <div class="kpi-icon" style="background:#dbeafe;color:#2563eb">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Today's Attendance</div>
              <div class="kpi-value" style="font-size:1.25rem">{{ myTodayAttendance ? 'Punched In' : 'Not Punched' }}</div>
              <div class="kpi-sub">{{ myTodayAttendance ? (myTodayAttendance.checkInTime) : 'Click Punch In' }}</div>
            </div>
          </div>

          <div class="kpi-card accent-amber">
            <div class="kpi-icon" style="background:#fef3c7;color:#d97706">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Pending Requests</div>
              <div class="kpi-value">{{ myPendingLeavesCount }}</div>
              <div class="kpi-sub">Under manager review</div>
            </div>
          </div>

          <div class="kpi-card accent-blue">
            <div class="kpi-icon" style="background:#dbeafe;color:#2563eb">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div class="kpi-meta">
              <div class="kpi-label">Department</div>
              <div class="kpi-value" style="font-size:1.25rem">{{ employeeProfile?.department || 'Engineering' }}</div>
              <div class="kpi-sub">{{ employeeProfile?.designation || 'Staff Member' }}</div>
            </div>
          </div>
        </div>

        <!-- Attendance Punch Bar -->
        <div class="card" style="display:flex;justify-content:space-between;align-items:center;padding:1rem 1.5rem">
          <div>
            <div style="font-weight:700;font-size:0.9375rem;color:var(--slate-900)">Daily Attendance Punch</div>
            <div class="text-muted">Record your daily work check-in and check-out times</div>
          </div>
          <div style="display:flex;gap:0.75rem">
            <button (click)="punchAttendance(true)" [disabled]="!!myTodayAttendance" class="btn btn-primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ myTodayAttendance ? 'Punched In' : 'Punch Check-In' }}
            </button>
            <button (click)="punchAttendance(false)" [disabled]="!myTodayAttendance || !!myTodayAttendance?.checkOutTime" class="btn btn-secondary">
              Punch Check-Out
            </button>
          </div>
        </div>

        <div class="dash-grid">
          <!-- Quick Leave Apply Form -->
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">✈ Quick Leave Application</div>
                <div class="card-subtitle">Submit a request directly for manager authorization</div>
              </div>
            </div>
            <form (ngSubmit)="submitEmployeeLeave()" class="modal-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Start Date</label>
                  <input type="date" [(ngModel)]="empLeaveForm.startDate" name="elStart" class="input-control" required />
                </div>
                <div class="form-group">
                  <label>End Date</label>
                  <input type="date" [(ngModel)]="empLeaveForm.endDate" name="elEnd" class="input-control" required />
                </div>
              </div>

              <div class="form-group">
                <label>Leave Type</label>
                <select [(ngModel)]="empLeaveForm.leaveType" name="elType" class="input-control" required>
                  <option value="Annual">Annual Leave (Paid Vacation)</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div class="form-group">
                <label>Reason for Leave</label>
                <textarea [(ngModel)]="empLeaveForm.reason" name="elReason" class="input-control" rows="2" placeholder="e.g. Personal travel, appointment" required></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-block">
                Submit Leave Application
              </button>
            </form>
          </div>

          <!-- My Leave History -->
          <div class="card card-flush">
            <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
              <div>
                <div class="card-title">My Leave Applications</div>
                <div class="card-subtitle">Status of recent time-off requests</div>
              </div>
              <a routerLink="/hr" class="btn btn-secondary btn-sm">HR Center</a>
            </div>
            <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Period</th>
                    <th>Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let l of myLeaves">
                    <td><span class="badge badge-info">{{ l.leaveType }}</span></td>
                    <td class="text-muted" style="font-size:0.75rem">{{ l.startDate | date:'MMM d' }} – {{ l.endDate | date:'MMM d' }}</td>
                    <td><strong>{{ l.totalDays }}d</strong></td>
                    <td><app-status-badge [status]="l.status"></app-status-badge></td>
                  </tr>
                  <tr *ngIf="!myLeaves.length">
                    <td colspan="4" style="text-align:center;padding:2.5rem 1rem;color:var(--slate-400)">
                      No leave requests submitted yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ng-container>

    </div>
  `,
  styles: [`
    .breadcrumb {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.75rem; color: var(--slate-400); margin-bottom: 4px;
      .bc-sep { opacity: 0.5; }
      .bc-current { color: var(--slate-600); font-weight: 600; }
    }

    .role-identity-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 9999px; font-size: 0.8125rem; font-weight: 700;
      letter-spacing: 0.02em;
      &.role-admin { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
      &.role-manager { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
      &.role-hr { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
      &.role-warehousestaff, &.role-warehouse { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
      &.role-employee { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    }
    .role-icon-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }

    .kpi-card {
      background: var(--surface); border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);
      display: flex; align-items: flex-start; gap: 1rem; position: relative;
      overflow: hidden; transition: var(--transition);
      &:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
      &::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px; }
      &.accent-blue::before  { background: var(--brand-500); }
      &.accent-green::before { background: var(--success); }
      &.accent-amber::before { background: var(--warning); }
      &.accent-red::before   { background: var(--danger); }
    }
    .kpi-icon { width: 42px; height: 42px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kpi-meta { flex: 1; min-width: 0; }
    .kpi-label { font-size: 0.75rem; font-weight: 600; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px; }
    .kpi-value { font-size: 1.625rem; font-weight: 800; color: var(--slate-900); letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; font-variant-numeric: tabular-nums; }
    .kpi-sub { font-size: 0.6875rem; color: var(--slate-400); }

    .dash-grid {
      display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.25rem;
      @media (max-width: 1100px) { grid-template-columns: 1fr; }
    }

    .alert-list { display: flex; flex-direction: column; gap: 0.625rem; }
    .alert-item {
      display: flex; justify-content: space-between; align-items: center; padding: 0.75rem;
      background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md);
      gap: 0.75rem; transition: var(--transition);
      &:hover { border-color: var(--danger-light); background: #fff5f5; }
    }
    .alert-item-left { display: flex; align-items: center; gap: 0.625rem; flex: 1; min-width: 0; }
    .alert-item-info { min-width: 0; }
    .alert-item-name { font-size: 0.8125rem; font-weight: 600; color: var(--slate-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .alert-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
    .stock-count.danger { font-size: 0.8125rem; font-weight: 700; color: var(--danger); }
    .stock-val.low { color: var(--danger); font-weight: 700; }

    .all-good {
      display: flex; align-items: center; gap: 0.75rem; padding: 1rem;
      background: var(--success-light); border-radius: var(--radius-md); color: var(--success-text); font-size: 0.8125rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics | null = null;
  lowStockAlerts: LowStockAlert[] = [];
  pendingOrders: SalesOrder[] = [];
  pendingLeaves: LeaveRequest[] = [];
  myLeaves: LeaveRequest[] = [];
  allProducts: Product[] = [];
  warehouses: Warehouse[] = [];
  employeeProfile: Employee | null = null;

  // HR metrics
  allEmployees: Employee[] = [];
  todayAttendance: AttendanceLog[] = [];
  pendingExpenses: ExpenseClaim[] = [];
  myTodayAttendance: AttendanceLog | null = null;

  quickAdj: StockAdjustment = {
    productId: 1,
    warehouseId: 1,
    quantity: 10,
    transactionType: 'StockIn',
    discrepancyReason: 'None',
    notes: 'Intake delivery replenishment'
  };

  empLeaveForm = {
    employeeId: 1,
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
    leaveType: 'Annual',
    reason: ''
  };

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private toast: ToastService
  ) {}

  get primaryRole(): string {
    const roles = this.auth.currentUser()?.roles || [];
    return roles[0] || 'Employee';
  }

  get userName(): string {
    return this.auth.currentUser()?.fullName || 'User';
  }

  get isAdmin(): boolean { return this.auth.hasRole(['Admin']); }
  get isManager(): boolean { return this.auth.hasRole(['Manager']); }
  get isHr(): boolean { return this.auth.hasRole(['HR']); }
  get isWarehouse(): boolean { return this.auth.hasRole(['WarehouseStaff', 'Warehouse']); }
  get isEmployee(): boolean { return !this.isAdmin && !this.isManager && !this.isHr && !this.isWarehouse; }

  get probationEmployees(): Employee[] {
    return this.allEmployees.filter(e => e.isOnProbation || e.department === 'Engineering');
  }

  get roleDashboardTitle(): string {
    if (this.isAdmin) return 'Executive Dashboard & System Control';
    if (this.isManager) return 'Operations & Approvals Command Center';
    if (this.isHr) return 'Human Resources & Payroll Control Hub';
    if (this.isWarehouse) return 'Warehouse & Logistics Operations Hub';
    return 'Employee Self-Service & Leave Workspace';
  }

  get roleDashboardSubtitle(): string {
    if (this.isAdmin) return 'Complete system-wide metrics, inventory valuation, and enterprise audit overview.';
    if (this.isManager) return 'Review pending sales orders for atomic stock deduction and authorize team leave requests.';
    if (this.isHr) return 'Headcount monitoring, probation tracking, attendance logs, and expense reimbursement reviews.';
    if (this.isWarehouse) return 'Live stock ledger, fast physical intake/dispatch adjustments, and reorder alerts.';
    return 'Manage your annual leave allowances, submit time-off applications, and lookup company colleagues.';
  }

  get greetingMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  get totalProductCount(): number { return this.allProducts.length; }
  get totalStockUnits(): number { return this.allProducts.reduce((sum, p) => sum + p.currentStock, 0); }
  get myPendingLeavesCount(): number { return this.myLeaves.filter(l => l.status === 'Pending').length; }

  ngOnInit(): void {
    this.loadCommonData();
    if (this.isAdmin || this.isManager) this.loadManagerData();
    if (this.isHr || this.isAdmin) this.loadHrData();
    if (this.isWarehouse || this.isAdmin) this.loadWarehouseData();
    if (this.isEmployee) this.loadEmployeeData();
  }

  loadCommonData(): void {
    this.api.getDashboard().subscribe(res => { if (res.success) this.metrics = res.data; });
    this.api.getLowStockAlerts().subscribe(res => { if (res.success) this.lowStockAlerts = res.data; });
  }

  loadManagerData(): void {
    this.api.getSalesOrders({ page: 1, pageSize: 10 }, 'Draft').subscribe(res => {
      if (res.success) this.pendingOrders = res.data.items;
    });
    this.api.getLeaveRequests({ page: 1, pageSize: 10 }, 'Pending').subscribe(res => {
      if (res.success) this.pendingLeaves = res.data.items;
    });
  }

  loadHrData(): void {
    this.api.getEmployees({ page: 1, pageSize: 50 }).subscribe(res => {
      if (res.success) this.allEmployees = res.data.items;
    });
    this.api.getAttendance({ page: 1, pageSize: 50 }, undefined, new Date().toISOString().substring(0, 10)).subscribe(res => {
      if (res.success) this.todayAttendance = res.data.items;
    });
    this.api.getExpenses({ page: 1, pageSize: 20 }, undefined, 'Pending').subscribe(res => {
      if (res.success) this.pendingExpenses = res.data.items;
    });
  }

  loadWarehouseData(): void {
    this.api.getProducts({ page: 1, pageSize: 100 }).subscribe(res => {
      if (res.success) {
        this.allProducts = res.data.items;
        if (this.allProducts.length > 0) this.quickAdj.productId = this.allProducts[0].id;
      }
    });
    this.api.getWarehouses().subscribe(res => {
      if (res.success) {
        this.warehouses = res.data;
        if (this.warehouses.length > 0) this.quickAdj.warehouseId = this.warehouses[0].id;
      }
    });
  }

  loadEmployeeData(): void {
    this.api.getLeaveRequests({ page: 1, pageSize: 20 }).subscribe(res => {
      if (res.success) this.myLeaves = res.data.items;
    });
    this.api.getEmployees({ page: 1, pageSize: 50 }).subscribe(res => {
      if (res.success && res.data.items.length > 0) {
        const user = this.auth.currentUser();
        const found = res.data.items.find(e => e.email === user?.email);
        this.employeeProfile = found || res.data.items[0];
        if (this.employeeProfile) {
          this.empLeaveForm.employeeId = this.employeeProfile.id;
          this.api.getAttendance({ page: 1, pageSize: 5 }, this.employeeProfile.id, new Date().toISOString().substring(0, 10)).subscribe(attRes => {
            if (attRes.success && attRes.data.items.length > 0) {
              this.myTodayAttendance = attRes.data.items[0];
            }
          });
        }
      }
    });
  }

  punchAttendance(isCheckIn: boolean): void {
    if (!this.employeeProfile) return;
    const obs = isCheckIn ? this.api.checkIn(this.employeeProfile.id) : this.api.checkOut(this.employeeProfile.id);
    obs.subscribe(res => {
      if (res.success) {
        this.toast.success(isCheckIn ? 'Check-in Recorded' : 'Check-out Recorded', `Time: ${res.data.checkInTime}`);
        this.myTodayAttendance = res.data;
      }
    });
  }

  actionExpense(id: number, status: string): void {
    this.api.processExpense(id, status).subscribe(res => {
      if (res.success) {
        this.toast.success(`Expense ${status}`);
        this.loadHrData();
      }
    });
  }

  approveOrder(order: SalesOrder): void {
    this.api.approveSalesOrder(order.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Order Approved!', `Stock deducted atomically for Order ${res.data.orderNumber}.`);
          this.loadManagerData();
          this.loadCommonData();
        }
      }
    });
  }

  openRejectOrder(order: SalesOrder): void {
    const reason = prompt(`Enter mandatory rejection reason for Order ${order.orderNumber}:`);
    if (reason) {
      this.api.rejectSalesOrder(order.id, reason).subscribe(res => {
        if (res.success) {
          this.toast.success('Order Rejected', `Order ${order.orderNumber} has been rejected.`);
          this.loadManagerData();
        }
      });
    }
  }

  actionLeave(id: number, approved: boolean): void {
    const rejectionReason = !approved ? (prompt('Enter reason for leave rejection:') || 'Schedule conflict') : undefined;
    this.api.processLeave(id, approved, rejectionReason).subscribe(res => {
      if (res.success) {
        this.toast.success(approved ? 'Leave Approved' : 'Leave Rejected');
        this.loadManagerData();
      }
    });
  }

  submitQuickAdjustment(): void {
    this.api.adjustStock(this.quickAdj).subscribe(res => {
      if (res.success) {
        this.toast.success('Stock Adjusted', `New balance: ${res.data.balanceAfter}`);
        this.loadWarehouseData();
        this.loadCommonData();
      }
    });
  }

  quickRestock(item: LowStockAlert, qty: number): void {
    this.api.adjustStock({
      productId: item.productId,
      warehouseId: 1,
      quantity: qty,
      transactionType: 'StockIn',
      discrepancyReason: 'None',
      notes: 'Quick restock from dashboard'
    }).subscribe(res => {
      if (res.success) {
        this.toast.success('Restock Successful', `Added +${qty} units of ${item.name}`);
        this.loadCommonData();
        this.loadWarehouseData();
      }
    });
  }

  submitEmployeeLeave(): void {
    if (!this.empLeaveForm.reason) {
      this.toast.error('Validation Error', 'Please enter a reason for your leave request.');
      return;
    }

    this.api.applyLeave(this.empLeaveForm).subscribe(res => {
      if (res.success) {
        this.toast.success('Leave Submitted', 'Your application is now under manager review.');
        this.empLeaveForm.reason = '';
        this.loadEmployeeData();
      }
    });
  }
}
