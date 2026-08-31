import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ToastContainerComponent } from '../shared/components/toast-container.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastContainerComponent],
  template: `
    <div class="erp-shell">
      <!-- SIDEBAR -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">

        <!-- Brand -->
        <div class="sidebar-brand">
          <div class="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white"/></svg>
          </div>
          <div class="brand-text" *ngIf="!sidebarCollapsed">
            <span class="brand-name">SwiftERP</span>
            <span class="brand-tag">Enterprise Suite</span>
          </div>
        </div>

        <!-- Role Badge Header in Sidebar -->
        <div class="sidebar-role-indicator" *ngIf="!sidebarCollapsed">
          <div class="role-badge-box" [ngClass]="'role-' + primaryRole.toLowerCase()">
            <span class="role-dot"></span>
            <span class="role-title-text">{{ primaryRole }} Portal</span>
          </div>
        </div>

        <!-- Dynamic Navigation based on Roles -->
        <nav class="sidebar-nav">
          <!-- MAIN SECTION (All Roles) -->
          <div class="nav-section">
            <div class="nav-section-label" *ngIf="!sidebarCollapsed">Workspace</div>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" title="Dashboard">
              <span class="nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </span>
              <span class="nav-label" *ngIf="!sidebarCollapsed">
                {{ isEmployee ? 'My Workspace' : (isWarehouse ? 'Warehouse Hub' : (isHr ? 'HR & Payroll Portal' : (isManager ? 'Command Hub' : 'Executive Dashboard'))) }}
              </span>
            </a>
          </div>

          <!-- OPERATIONS SECTION (Filtered by Role) -->
          <div class="nav-section">
            <div class="nav-section-label" *ngIf="!sidebarCollapsed">Modules</div>

            <!-- Inventory (Admin, Manager, Warehouse) -->
            <a *ngIf="isAdmin || isManager || isWarehouse" routerLink="/inventory" routerLinkActive="active" class="nav-item" title="Inventory Management">
              <span class="nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                </svg>
              </span>
              <span class="nav-label" *ngIf="!sidebarCollapsed">
                {{ isWarehouse ? 'Stock & Transfers' : 'Inventory' }}
              </span>
            </a>

            <!-- Sales Orders (Admin, Manager, Employee) -->
            <a *ngIf="isAdmin || isManager || isEmployee" routerLink="/sales" routerLinkActive="active" class="nav-item" title="Sales Orders & Approvals">
              <span class="nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </span>
              <span class="nav-label" *ngIf="!sidebarCollapsed">
                {{ isManager ? 'Sales & Approvals' : (isEmployee ? 'My Sales Orders' : 'Sales Orders') }}
              </span>
            </a>

            <!-- HR & Leaves (Admin, Manager, HR, Employee) -->
            <a *ngIf="isAdmin || isManager || isHr || isEmployee" routerLink="/hr" routerLinkActive="active" class="nav-item" title="HR & Leave Management">
              <span class="nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <span class="nav-label" *ngIf="!sidebarCollapsed">
                {{ isHr ? 'HR, Payroll & Leaves' : (isEmployee ? 'My Leaves & Claims' : (isManager ? 'Leave Approvals' : 'HR & Staff')) }}
              </span>
            </a>
          </div>

          <!-- ANALYTICS SECTION (Admin, Manager only) -->
          <div class="nav-section" *ngIf="isAdmin || isManager">
            <div class="nav-section-label" *ngIf="!sidebarCollapsed">Analytics</div>
            <a routerLink="/reports" routerLinkActive="active" class="nav-item" title="Executive Reports">
              <span class="nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </span>
              <span class="nav-label" *ngIf="!sidebarCollapsed">Executive Reports</span>
            </a>
          </div>
        </nav>

        <!-- User footer -->
        <div class="sidebar-footer">
          <div class="user-row">
            <div class="user-avatar" [ngClass]="'avatar-' + primaryRole.toLowerCase()">{{ userInitials }}</div>
            <div class="user-details" *ngIf="!sidebarCollapsed">
              <div class="user-name">{{ authService.currentUser()?.fullName || 'User' }}</div>
              <div class="user-role">{{ primaryRole }}</div>
            </div>
            <button (click)="logout()" class="logout-btn" title="Sign Out" *ngIf="!sidebarCollapsed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Collapse toggle -->
        <button class="sidebar-toggle" (click)="sidebarCollapsed = !sidebarCollapsed" title="Toggle Sidebar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline *ngIf="!sidebarCollapsed" points="15 18 9 12 15 6"/>
            <polyline *ngIf="sidebarCollapsed"  points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </aside>

      <!-- MAIN AREA -->
      <div class="main-wrapper">
        <!-- Topbar -->
        <header class="topbar">
          <div class="topbar-left">
            <div class="topbar-breadcrumb">
              <span class="bc-root">SwiftERP</span>
              <span class="bc-sep">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
              <span class="bc-current">{{ currentPortalName }}</span>
            </div>
          </div>
          <div class="topbar-right">
            <div class="role-switcher-dropdown">
              <span class="role-switch-label">Role:</span>
              <span class="role-badge" [ngClass]="'role-' + primaryRole.toLowerCase()">
                {{ primaryRole }}
              </span>
            </div>

            <button (click)="logout()" class="btn btn-ghost btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </header>

        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>

      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .erp-shell { display: flex; min-height: 100vh; background: var(--bg-page); }

    .sidebar {
      width: 230px; min-width: 230px;
      background: var(--sidebar-bg);
      display: flex; flex-direction: column;
      position: relative; flex-shrink: 0;
      transition: width 0.2s ease, min-width 0.2s ease;
      border-right: 1px solid rgba(255,255,255,0.04);
      &.collapsed { width: 60px; min-width: 60px; }
    }

    .sidebar-brand {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 1.25rem 1rem;
      border-bottom: 1px solid var(--sidebar-border);
      min-height: 60px;
    }
    .brand-icon {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(37,99,235,0.4);
    }
    .brand-text { display: flex; flex-direction: column; }
    .brand-name { font-size: 0.9375rem; font-weight: 800; color: #f9fafb; letter-spacing: -0.02em; line-height: 1; }
    .brand-tag  { font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin-top: 2px; }

    .sidebar-role-indicator {
      padding: 0.75rem 0.75rem 0.25rem;
    }
    .role-badge-box {
      display: flex; align-items: center; gap: 6px;
      padding: 5px 10px; border-radius: 6px; font-size: 0.6875rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
      &.role-admin { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
      &.role-manager { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }
      &.role-hr { background: rgba(99, 102, 241, 0.15); color: #c7d2fe; }
      &.role-warehousestaff, &.role-warehouse { background: rgba(245, 158, 11, 0.15); color: #fde68a; }
      &.role-employee { background: rgba(16, 185, 129, 0.15); color: #a7f3d0; }
    }
    .role-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .sidebar-nav { flex: 1; padding: 0.75rem 0.5rem; display: flex; flex-direction: column; gap: 0.125rem; overflow-y: auto; }
    .nav-section { margin-bottom: 0.75rem; }
    .nav-section-label { font-size: 0.625rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; padding: 0 0.625rem; margin-bottom: 0.375rem; }

    .nav-item {
      display: flex; align-items: center; gap: 0.625rem;
      padding: 0.5rem 0.625rem;
      color: var(--sidebar-text);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.8125rem;
      transition: all 0.15s;
      white-space: nowrap;
      &:hover { background: var(--sidebar-hover); color: #e5e7eb; }
      &.active { background: var(--sidebar-active); color: var(--sidebar-active-text); }
      &.active .nav-icon { color: #60a5fa; }
    }
    .nav-icon { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #6b7280; }
    .nav-label { font-weight: 600; }

    .sidebar-footer { padding: 0.875rem; border-top: 1px solid var(--sidebar-border); }
    .user-row { display: flex; align-items: center; gap: 0.625rem; }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      color: #fff; font-size: 0.6875rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; border: 2px solid rgba(255,255,255,0.12);
      &.avatar-admin { background: linear-gradient(135deg, #ef4444, #b91c1c); }
      &.avatar-manager { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
      &.avatar-hr { background: linear-gradient(135deg, #6366f1, #4338ca); }
      &.avatar-warehousestaff, &.avatar-warehouse { background: linear-gradient(135deg, #f59e0b, #d97706); }
      &.avatar-employee { background: linear-gradient(135deg, #10b981, #047857); }
    }
    .user-details { flex: 1; min-width: 0; }
    .user-name { font-size: 0.8125rem; font-weight: 700; color: #f3f4f6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-role { font-size: 0.6875rem; color: #6b7280; }
    .logout-btn {
      background: none; border: none; color: #6b7280;
      cursor: pointer; padding: 4px; border-radius: 6px;
      display: flex; align-items: center; transition: all 0.15s;
      &:hover { background: rgba(255,255,255,0.08); color: #f87171; }
    }

    .sidebar-toggle {
      position: absolute; right: -12px; top: 72px;
      width: 24px; height: 24px;
      background: var(--sidebar-bg);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #6b7280; z-index: 10; transition: all 0.15s;
      &:hover { color: #93c5fd; border-color: rgba(147,197,253,0.3); }
    }

    .main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

    .topbar {
      height: 56px;
      background: var(--surface);
      border-bottom: 1px solid var(--slate-200);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 1.5rem;
      flex-shrink: 0; z-index: 100;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }

    .topbar-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.8125rem; }
    .bc-root { color: var(--slate-400); font-weight: 500; }
    .bc-sep  { color: var(--slate-300); display: flex; align-items: center; }
    .bc-current { color: var(--slate-700); font-weight: 600; }

    .topbar-right { display: flex; align-items: center; gap: 0.75rem; }

    .role-switcher-dropdown { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; }
    .role-switch-label { color: var(--slate-400); font-weight: 500; }
    .role-badge {
      font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
      padding: 3px 10px; border-radius: 9999px;
      &.role-admin { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
      &.role-manager { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
      &.role-hr { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
      &.role-warehousestaff, &.role-warehouse { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
      &.role-employee { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    }

    .page-content { flex: 1; padding: 1.75rem 2rem; overflow-y: auto; }

    @media (max-width: 768px) { .page-content { padding: 1rem; } }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = false;

  constructor(public authService: AuthService, private router: Router) {}

  get userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'U';
    return (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  }

  get primaryRole(): string {
    const user = this.authService.currentUser();
    return user?.roles?.[0] || 'Employee';
  }

  get isAdmin(): boolean { return this.authService.hasRole(['Admin']); }
  get isManager(): boolean { return this.authService.hasRole(['Manager']); }
  get isHr(): boolean { return this.authService.hasRole(['HR']); }
  get isWarehouse(): boolean { return this.authService.hasRole(['WarehouseStaff', 'Warehouse']); }
  get isEmployee(): boolean { return !this.isAdmin && !this.isManager && !this.isHr && !this.isWarehouse; }

  get currentPortalName(): string {
    if (this.isAdmin) return 'Executive Administrator Suite';
    if (this.isManager) return 'Operations & Approvals Management';
    if (this.isHr) return 'Human Resources & Payroll Portal';
    if (this.isWarehouse) return 'Warehouse & Inventory Control';
    return 'Employee Self-Service Portal';
  }

  logout(): void {
    this.authService.logout();
  }
}

