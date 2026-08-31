import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
      <!-- Left hero panel -->
      <div class="auth-left">
        <div class="auth-hero">
          <div class="hero-brand">
            <div class="hero-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white"/></svg>
            </div>
            <span class="hero-name">SwiftERP</span>
          </div>
          <h2 class="hero-headline">Full-Stack Enterprise<br>Resource Planning Suite</h2>
          <p class="hero-desc">.NET 8 Clean Architecture + Angular 18 + MSSQL — inventory, sales, HR, and analytics unified in one intelligent platform.</p>
          <div class="hero-features">
            <div class="hero-feat"><span class="feat-dot"></span>Atomic stock deduction via DB transactions</div>
            <div class="hero-feat"><span class="feat-dot"></span>JWT-based role authorization (Admin / Manager / Staff)</div>
            <div class="hero-feat"><span class="feat-dot"></span>Real-time KPIs and stored procedure reports</div>
            <div class="hero-feat"><span class="feat-dot"></span>FluentValidation + Serilog structured logging</div>
          </div>
          <div class="hero-tech-stack">
            <span class="tech-pill">.NET 8</span>
            <span class="tech-pill">Angular 18</span>
            <span class="tech-pill">MSSQL</span>
            <span class="tech-pill">EF Core</span>
            <span class="tech-pill">JWT</span>
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-card-header">
            <div class="auth-logo">
              <div class="auth-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white"/></svg>
              </div>
              <span class="auth-logo-name">SwiftERP</span>
            </div>
            <h1 class="auth-title">Sign in to your account</h1>
            <p class="auth-subtitle">Enter your credentials to access the ERP dashboard</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label>Username or Email</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input type="text" [(ngModel)]="username" name="username" class="input-control input-icon-pad" placeholder="admin" required />
              </div>
            </div>
            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <span class="input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type="password" [(ngModel)]="password" name="password" class="input-control input-icon-pad" placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" [disabled]="loading" class="btn btn-primary btn-block" style="margin-top:0.5rem">
              <svg *ngIf="loading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ loading ? 'Signing in...' : 'Sign In to Dashboard' }}
            </button>
          </form>

          <div class="demo-section">
            <div class="demo-header">
              <div class="demo-divider"></div>
              <span class="demo-label">Quick Demo Login</span>
              <div class="demo-divider"></div>
            </div>
            <div class="demo-grid">
              <button (click)="fillCredentials('admin', 'Admin@123')" class="demo-btn">
                <div class="demo-role-icon admin-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div><div class="demo-role-name">Admin</div><div class="demo-role-desc">Full access</div></div>
              </button>
              <button (click)="fillCredentials('manager', 'Manager@123')" class="demo-btn">
                <div class="demo-role-icon manager-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
                  </svg>
                </div>
                <div><div class="demo-role-name">Manager</div><div class="demo-role-desc">Approvals</div></div>
              </button>
              <button (click)="fillCredentials('hr', 'Hr@123')" class="demo-btn">
                <div class="demo-role-icon hr-icon" style="background:#e0e7ff;color:#4338ca">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <div><div class="demo-role-name">HR Portal</div><div class="demo-role-desc">Payroll & Staff</div></div>
              </button>
              <button (click)="fillCredentials('employee', 'Employee@123')" class="demo-btn">
                <div class="demo-role-icon employee-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <div><div class="demo-role-name">Employee</div><div class="demo-role-desc">Self-Service</div></div>
              </button>
              <button (click)="fillCredentials('warehouse', 'Warehouse@123')" class="demo-btn" style="grid-column: span 2">
                <div class="demo-role-icon warehouse-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  </svg>
                </div>
                <div><div class="demo-role-name">Warehouse Staff</div><div class="demo-role-desc">Stock In/Out, Transfers & Fulfillment</div></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; }

    .auth-left {
      flex: 1;
      background: linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 3rem; position: relative; overflow: hidden;
    }
    .auth-left::before {
      content: ''; position: absolute; inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .auth-hero { position: relative; z-index: 1; max-width: 440px; }

    .hero-brand { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 2.5rem; }
    .hero-icon {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(37,99,235,0.5);
    }
    .hero-name { font-size: 1.375rem; font-weight: 800; color: #f9fafb; letter-spacing: -0.02em; }
    .hero-headline { font-size: 2.25rem; font-weight: 800; color: #fff; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 1rem; }
    .hero-desc { font-size: 0.9375rem; color: rgba(255,255,255,0.6); line-height: 1.6; margin-bottom: 2rem; }
    .hero-features { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
    .hero-feat { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: rgba(255,255,255,0.75); font-weight: 500; }
    .feat-dot { width: 6px; height: 6px; border-radius: 50%; background: #60a5fa; flex-shrink: 0; }
    .hero-tech-stack { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tech-pill {
      font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
      background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8);
      padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.15);
    }

    @media (max-width: 900px) { .auth-left { display: none; } }

    .auth-right {
      width: 480px; background: var(--bg-page);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem 1.5rem; flex-shrink: 0;
    }
    @media (max-width: 900px) { .auth-right { width: 100%; } }

    .auth-card {
      background: var(--surface);
      border-radius: 16px;
      border: 1px solid var(--slate-200);
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      padding: 2.25rem; width: 100%; max-width: 420px;
    }
    .auth-card-header { margin-bottom: 1.75rem; }
    .auth-logo { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
    .auth-logo-icon {
      width: 30px; height: 30px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
    }
    .auth-logo-name { font-size: 1rem; font-weight: 800; color: var(--slate-900); }
    .auth-title { font-size: 1.375rem; font-weight: 800; color: var(--slate-900); letter-spacing: -0.025em; margin-bottom: 4px; }
    .auth-subtitle { font-size: 0.8125rem; color: var(--slate-500); }
    .auth-form { display: flex; flex-direction: column; gap: 1.125rem; }

    .input-wrapper { position: relative; }
    .input-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--slate-400); display: flex; pointer-events: none; }
    .input-icon-pad { padding-left: 2rem; }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.8s linear infinite; }

    .demo-section { margin-top: 1.5rem; }
    .demo-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.875rem; }
    .demo-divider { flex: 1; height: 1px; background: var(--slate-200); }
    .demo-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--slate-400); white-space: nowrap; }

    .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .demo-btn {
      display: flex; align-items: center; gap: 0.625rem;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--slate-200); border-radius: 10px;
      background: var(--surface); cursor: pointer; text-align: left;
      transition: all 0.15s; font-family: var(--font-sans);
      &:hover { background: var(--slate-50); border-color: var(--slate-300); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.06); }
    }
    .demo-role-icon {
      width: 28px; height: 28px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      &.admin-icon     { background: #fee2e2; color: #dc2626; }
      &.manager-icon   { background: #dbeafe; color: #2563eb; }
      &.employee-icon  { background: #d1fae5; color: #059669; }
      &.warehouse-icon { background: #fef3c7; color: #d97706; }
    }
    .demo-role-name { font-size: 0.8125rem; font-weight: 700; color: var(--slate-800); }
    .demo-role-desc { font-size: 0.6875rem; color: var(--slate-400); }
  `]
})
export class LoginComponent {
  username = 'admin';
  password = 'Admin@123';
  loading = false;

  constructor(private authService: AuthService, private router: Router, private toast: ToastService) {}

  fillCredentials(u: string, p: string): void {
    this.username = u;
    this.password = p;
  }

  onSubmit(): void {
    if (!this.username || !this.password) return;
    this.loading = true;
    this.authService.login({ usernameOrEmail: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.toast.success('Welcome back!', `Signed in as ${res.data.user.fullName} (${res.data.user.roles.join(', ')})`);
        this.router.navigate(['/dashboard']);
      },
      error: () => { this.loading = false; }
    });
  }
}
