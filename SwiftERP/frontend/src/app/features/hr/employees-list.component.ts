import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Employee, LeaveRequest, AttendanceLog, ExpenseClaim, SalaryAuditLog, Payslip } from '../../core/models/hr.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="page-shell">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">HR & Workforce Management</h1>
          <p class="page-subtitle">Directory, Attendance, Leave Lifecycles, Payroll & Expense Claims</p>
        </div>
        <div class="page-header-right">
          <button *ngIf="isAdmin || isHr" (click)="openAddModal()" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Employee
          </button>
          <button *ngIf="isEmployee" (click)="openApplyLeaveModal()" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Apply for Leave
          </button>
          <button *ngIf="isEmployee" (click)="openClaimExpenseModal()" class="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Submit Expense
          </button>
        </div>
      </div>

      <!-- Tab navigation -->
      <div class="tab-bar">
        <button class="tab-btn" [class.active]="activeTab === 'employees'" (click)="activeTab = 'employees'">
          Employee Directory ({{ totalEmployees }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'leaves'" (click)="activeTab = 'leaves'">
          Leave Management
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'attendance'" (click)="activeTab = 'attendance'">
          Attendance Logs
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'payroll'" (click)="activeTab = 'payroll'">
          Payroll & Payslips
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'expenses'" (click)="activeTab = 'expenses'">
          Expense Claims
        </button>
      </div>

      <!-- ════════════════ TAB 1: EMPLOYEES DIRECTORY ════════════════ -->
      <ng-container *ngIf="activeTab === 'employees'">
        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="filter-search">
            <input type="text" [(ngModel)]="search" (ngModelChange)="loadEmployees()"
              class="input-control" placeholder="Search by name, code, or email..." />
          </div>
          <div class="filter-select">
            <select [(ngModel)]="selectedDepartment" (ngModelChange)="loadEmployees()" class="input-control">
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Employee</th>
                <th>Department & Role</th>
                <th>Date of Joining</th>
                <th>Salary (Annual)</th>
                <th>Leave Bal</th>
                <th>Status</th>
                <th *ngIf="isAdmin || isHr" style="text-align:right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of employees">
                <td><span class="sku-chip">{{ emp.employeeCode }}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:0.625rem">
                    <div class="emp-avatar">{{ emp.firstName.charAt(0) }}{{ emp.lastName.charAt(0) }}</div>
                    <div>
                      <div style="font-weight:700;color:var(--slate-900)">{{ emp.firstName }} {{ emp.lastName }}</div>
                      <div class="text-muted">{{ emp.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style="font-weight:600;color:var(--slate-800)">{{ emp.department }}</div>
                  <div class="text-muted">{{ emp.designation }}</div>
                </td>
                <td>{{ emp.dateOfJoining | date:'mediumDate' }}</td>
                <td style="font-family:var(--font-mono);font-weight:700">\${{ emp.salary | number:'1.2-2' }}</td>
                <td><span class="badge badge-brand">{{ emp.annualLeaveBalance }} days</span></td>
                <td>
                  <span *ngIf="emp.isOnProbation" class="badge badge-warning">Probation</span>
                  <span *ngIf="!emp.isOnProbation" class="badge badge-success">Confirmed</span>
                </td>
                <td *ngIf="isAdmin || isHr">
                  <div class="actions-cell" style="justify-content:flex-end">
                    <button (click)="openSalaryModal(emp)" class="btn btn-secondary btn-sm" title="Adjust Salary">
                      Edit Salary
                    </button>
                    <button (click)="openPayslipView(emp)" class="btn btn-primary btn-sm" title="Generate Payslip">
                      Payslip
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <!-- ════════════════ TAB 2: LEAVE REQUESTS ════════════════ -->
      <ng-container *ngIf="activeTab === 'leaves'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Department</th>
                <th>Period</th>
                <th>Type & Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th *ngIf="isAdmin || isManager || isHr" style="text-align:right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let req of leaveRequests">
                <td>
                  <div style="font-weight:700;color:var(--slate-900)">{{ req.employeeName }}</div>
                  <div class="text-muted">{{ req.employeeCode }}</div>
                </td>
                <td>{{ req.department }}</td>
                <td>
                  <div style="font-weight:600">{{ req.startDate | date:'mediumDate' }}</div>
                  <div class="text-muted">to {{ req.endDate | date:'mediumDate' }}</div>
                </td>
                <td>
                  <span class="badge badge-brand">{{ req.leaveType }}</span>
                  <span style="font-size:0.8125rem;font-weight:700;margin-left:6px">{{ req.totalDays }} days</span>
                </td>
                <td style="max-width:240px;color:var(--slate-600)">{{ req.reason }}</td>
                <td>
                  <app-status-badge [status]="req.status"></app-status-badge>
                  <div *ngIf="req.rejectionReason" class="text-danger" style="font-size:0.6875rem;margin-top:2px">
                    Reason: {{ req.rejectionReason }}
                  </div>
                </td>
                <td *ngIf="isAdmin || isManager || isHr">
                  <div class="actions-cell" style="justify-content:flex-end" *ngIf="req.status === 'Pending'">
                    <button (click)="processLeave(req.id, true)" class="btn btn-success btn-sm">Approve</button>
                    <button (click)="processLeave(req.id, false)" class="btn btn-danger btn-sm">Reject</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!leaveRequests.length">
                <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--slate-400)">
                  No leave requests found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <!-- ════════════════ TAB 3: ATTENDANCE LOGS ════════════════ -->
      <ng-container *ngIf="activeTab === 'attendance'">
        <div class="filter-bar">
          <div class="filter-search">
            <input type="date" [(ngModel)]="attendanceDate" (ngModelChange)="loadAttendance()" class="input-control" />
          </div>
          <div class="filter-right" *ngIf="isAdmin || isHr">
            <button (click)="openAttendanceCorrectionModal()" class="btn btn-secondary btn-sm">
              Manual Correction Override
            </button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Correction Audit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let att of attendanceLogs">
                <td>{{ att.date | date:'mediumDate' }}</td>
                <td>
                  <div style="font-weight:700;color:var(--slate-900)">{{ att.employeeName }}</div>
                  <div class="text-muted">{{ att.department }}</div>
                </td>
                <td><strong style="color:var(--slate-900)">{{ att.checkInTime }}</strong></td>
                <td>{{ att.checkOutTime || '— Active —' }}</td>
                <td>
                  <span class="badge" [ngClass]="att.status === 'Present' ? 'badge-success' : (att.status === 'Late' ? 'badge-warning' : 'badge-danger')">
                    {{ att.status }}
                  </span>
                </td>
                <td>
                  <span *ngIf="att.isManualCorrection" class="badge badge-warning" title="{{ att.correctionReason }}">
                    Manual Override: {{ att.correctionReason }}
                  </span>
                  <span *ngIf="!att.isManualCorrection" class="text-muted">—</span>
                </td>
              </tr>
              <tr *ngIf="!attendanceLogs.length">
                <td colspan="6" style="text-align:center;padding:2.5rem;color:var(--slate-400)">
                  No attendance punches logged for this date.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <!-- ════════════════ TAB 4: PAYROLL & AUDIT ════════════════ -->
      <ng-container *ngIf="activeTab === 'payroll'">
        <div class="dash-grid">
          <div class="card card-flush">
            <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
              <div>
                <div class="card-title">Salary & Compensation Directory</div>
                <div class="card-subtitle">Generate payslips and maintain compliant pay structures</div>
              </div>
            </div>
            <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Annual CTC</th>
                    <th>Est. Monthly Net</th>
                    <th style="text-align:right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let emp of employees">
                    <td>
                      <div style="font-weight:700;color:var(--slate-900)">{{ emp.firstName }} {{ emp.lastName }}</div>
                      <div class="text-muted">{{ emp.designation }}</div>
                    </td>
                    <td style="font-family:var(--font-mono);font-weight:700">\${{ emp.salary | number:'1.2-2' }}</td>
                    <td style="font-family:var(--font-mono);color:var(--success);font-weight:700">
                      \${{ ((emp.salary / 12) * 0.82) | number:'1.2-2' }}
                    </td>
                    <td>
                      <div class="actions-cell" style="justify-content:flex-end">
                        <button (click)="openPayslipView(emp)" class="btn btn-primary btn-sm">Generate Payslip</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Salary Audit Trail -->
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">📜 Salary Revision Audit Logs</div>
                <div class="card-subtitle">Immutable trail of compensation changes</div>
              </div>
            </div>
            <div class="alert-list">
              <div *ngFor="let log of salaryAuditLogs" class="alert-item">
                <div class="alert-item-left">
                  <div class="alert-item-info">
                    <div class="alert-item-name">{{ log.employeeName }}</div>
                    <div class="text-muted">By {{ log.changedBy }} • {{ log.createdAtUtc | date:'mediumDate' }}</div>
                    <div style="font-size:0.75rem;color:var(--slate-600);margin-top:2px">{{ log.reason }}</div>
                  </div>
                </div>
                <div class="alert-item-right">
                  <div style="font-family:var(--font-mono);font-size:0.75rem;text-decoration:line-through;color:var(--slate-400)">
                    \${{ log.oldSalary | number:'1.0-0' }}
                  </div>
                  <div style="font-family:var(--font-mono);font-weight:700;color:var(--success)">
                    \${{ log.newSalary | number:'1.0-0' }}
                  </div>
                </div>
              </div>
              <div *ngIf="!salaryAuditLogs.length" class="text-muted" style="text-align:center;padding:1.5rem">
                No salary modifications recorded yet.
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- ════════════════ TAB 5: EXPENSE CLAIMS ════════════════ -->
      <ng-container *ngIf="activeTab === 'expenses'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Employee</th>
                <th>Category & Title</th>
                <th>Amount</th>
                <th>Submitted</th>
                <th>Status</th>
                <th *ngIf="isAdmin || isHr || isManager" style="text-align:right">Review</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let exp of expenseClaims">
                <td><span class="sku-chip">EXP-{{ exp.id }}</span></td>
                <td>
                  <div style="font-weight:700;color:var(--slate-900)">{{ exp.employeeName }}</div>
                  <div class="text-muted">{{ exp.department }}</div>
                </td>
                <td>
                  <span class="badge badge-brand">{{ exp.category }}</span>
                  <div style="font-weight:600;margin-top:2px;color:var(--slate-800)">{{ exp.title }}</div>
                </td>
                <td style="font-family:var(--font-mono);font-weight:700;color:var(--slate-900)">\${{ exp.amount | number:'1.2-2' }}</td>
                <td>{{ exp.createdAtUtc | date:'mediumDate' }}</td>
                <td>
                  <span class="badge" [ngClass]="exp.status === 'Approved' ? 'badge-success' : (exp.status === 'Pending' ? 'badge-warning' : 'badge-danger')">
                    {{ exp.status }}
                  </span>
                </td>
                <td *ngIf="isAdmin || isHr || isManager">
                  <div class="actions-cell" style="justify-content:flex-end" *ngIf="exp.status === 'Pending'">
                    <button (click)="actionExpense(exp.id, 'Approved')" class="btn btn-success btn-sm">Approve</button>
                    <button (click)="actionExpense(exp.id, 'Rejected')" class="btn btn-danger btn-sm">Reject</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!expenseClaims.length">
                <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--slate-400)">
                  No expense claims logged.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <!-- ════════════════ MODALS ════════════════ -->

      <!-- Apply Leave Modal -->
      <div class="modal-overlay" *ngIf="showApplyLeaveModal" (click)="showApplyLeaveModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Apply for Time-Off</div>
            <button (click)="showApplyLeaveModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitApplyLeave()" class="modal-body modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" [(ngModel)]="leaveForm.startDate" name="startDate" class="input-control" required />
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="leaveForm.endDate" name="endDate" class="input-control" required />
              </div>
            </div>

            <div class="form-group">
              <label>Leave Category</label>
              <select [(ngModel)]="leaveForm.leaveType" name="leaveType" class="input-control">
                <option value="Annual">Annual Paid Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick / Medical Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div class="form-group">
              <label>Reason</label>
              <textarea [(ngModel)]="leaveForm.reason" name="reason" class="input-control" placeholder="Enter reason for leave..." rows="3" required></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="showApplyLeaveModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Application</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Expense Modal -->
      <div class="modal-overlay" *ngIf="showExpenseModal" (click)="showExpenseModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Submit Expense Reimbursement Claim</div>
            <button (click)="showExpenseModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitExpenseClaim()" class="modal-body modal-form">
            <div class="form-group">
              <label>Claim Title / Subject</label>
              <input type="text" [(ngModel)]="expForm.title" name="etitle" class="input-control" placeholder="Client Dinner / Flight to NYC" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="expForm.category" name="ecat" class="input-control">
                  <option value="Travel">Travel & Lodging</option>
                  <option value="Meals">Client Meals & Entertainment</option>
                  <option value="Equipment">Hardware & Office Supplies</option>
                  <option value="Training">Certifications & Courses</option>
                </select>
              </div>
              <div class="form-group">
                <label>Amount (\$)</label>
                <input type="number" [(ngModel)]="expForm.amount" name="eamt" class="input-control" placeholder="125.00" required />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="showExpenseModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Claim</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Payslip Generation Modal -->
      <div class="modal-overlay" *ngIf="showPayslipModal && activePayslip" (click)="showPayslipModal = false">
        <div class="modal-box" style="max-width:640px" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Enterprise Payslip Statement — {{ activePayslip.month }}/{{ activePayslip.year }}</div>
            <button (click)="showPayslipModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <div class="modal-body">
            <div style="background:var(--slate-50);border:1px solid var(--slate-200);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1.25rem">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.75rem">
                <div>
                  <h3 style="font-size:1.125rem;font-weight:800;color:var(--slate-900)">{{ activePayslip.employeeName }}</h3>
                  <div class="text-muted">{{ activePayslip.designation }} • {{ activePayslip.department }}</div>
                </div>
                <div style="text-align:right">
                  <span class="sku-chip">{{ activePayslip.employeeCode }}</span>
                  <div class="text-muted" style="margin-top:2px">Pay Period: {{ activePayslip.month }}/{{ activePayslip.year }}</div>
                </div>
              </div>
            </div>

            <div class="form-row" style="margin-bottom:1rem">
              <div class="card card-flush" style="padding:1rem">
                <div class="section-label" style="color:var(--success);margin-bottom:0.5rem">Earnings</div>
                <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:4px">
                  <span>Basic Pay:</span>
                  <strong>\${{ activePayslip.basicSalary | number:'1.2-2' }}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:4px">
                  <span>House Rent Allowance:</span>
                  <strong>\${{ activePayslip.houseRentAllowance | number:'1.2-2' }}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.8125rem">
                  <span>Special Allowance:</span>
                  <strong>\${{ activePayslip.specialAllowance | number:'1.2-2' }}</strong>
                </div>
              </div>

              <div class="card card-flush" style="padding:1rem">
                <div class="section-label" style="color:var(--danger);margin-bottom:0.5rem">Deductions</div>
                <div style="display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:4px">
                  <span>Provident Fund (PF):</span>
                  <strong>\${{ activePayslip.providentFund | number:'1.2-2' }}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.8125rem">
                  <span>Income Tax (TDS):</span>
                  <strong>\${{ activePayslip.taxDeduction | number:'1.2-2' }}</strong>
                </div>
              </div>
            </div>

            <div style="background:#dbeafe;border:1px solid #bfdbfe;border-radius:var(--radius-lg);padding:1rem 1.25rem;display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#1e40af">Net Take-Home Pay</div>
                <div style="font-size:0.6875rem;color:#3b82f6">Credited to registered salary account</div>
              </div>
              <div style="font-size:1.5rem;font-weight:800;color:#1e3a8a;font-family:var(--font-mono)">
                \${{ activePayslip.netPayable | number:'1.2-2' }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="showPayslipModal = false" class="btn btn-secondary">Close</button>
            <button (click)="toast.success('Downloaded', 'Payslip PDF generated.')" class="btn btn-primary">Download PDF</button>
          </div>
        </div>
      </div>

      <!-- Salary Update Modal -->
      <div class="modal-overlay" *ngIf="showSalaryModal && selectedEmployeeForSalary" (click)="showSalaryModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Revise Compensation — {{ selectedEmployeeForSalary.firstName }} {{ selectedEmployeeForSalary.lastName }}</div>
            <button (click)="showSalaryModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitSalaryUpdate()" class="modal-body modal-form">
            <div class="form-group">
              <label>Current Annual Salary</label>
              <input type="text" [value]="'$' + (selectedEmployeeForSalary.salary | number:'1.2-2')" class="input-control" disabled />
            </div>
            <div class="form-group">
              <label>New Annual Salary (\$) *</label>
              <input type="number" [(ngModel)]="newSalaryAmount" name="newSal" class="input-control" required />
            </div>
            <div class="form-group">
              <label>Mandatory Revision Reason (Audit Logged) *</label>
              <textarea [(ngModel)]="salaryRevisionReason" name="salReason" class="input-control" rows="2" placeholder="e.g. Annual merit appraisal promotion" required></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" (click)="showSalaryModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Save & Audit Revision</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Attendance Correction Modal -->
      <div class="modal-overlay" *ngIf="showAttendanceCorrectionModal" (click)="showAttendanceCorrectionModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Manual Attendance Override</div>
            <button (click)="showAttendanceCorrectionModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitAttendanceCorrection()" class="modal-body modal-form">
            <div class="form-group">
              <label>Employee</label>
              <select [(ngModel)]="correctionForm.employeeId" name="cEmp" class="input-control">
                <option *ngFor="let emp of employees" [value]="emp.id">{{ emp.firstName }} {{ emp.lastName }} ({{ emp.employeeCode }})</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date</label>
              <input type="date" [(ngModel)]="correctionForm.date" name="cDate" class="input-control" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Check In (HH:mm)</label>
                <input type="text" [(ngModel)]="correctionForm.checkInTime" name="cIn" class="input-control" placeholder="09:00:00" required />
              </div>
              <div class="form-group">
                <label>Check Out (HH:mm)</label>
                <input type="text" [(ngModel)]="correctionForm.checkOutTime" name="cOut" class="input-control" placeholder="18:00:00" required />
              </div>
            </div>
            <div class="form-group">
              <label>Mandatory Reason for Override</label>
              <textarea [(ngModel)]="correctionForm.correctionReason" name="cReason" class="input-control" placeholder="e.g. Biometric machine offline at security gate" required></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" (click)="showAttendanceCorrectionModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Correction</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .emp-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: #fff; font-size: 0.75rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .dash-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 1.25rem; }
    .alert-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .alert-item {
      display: flex; justify-content: space-between; align-items: center; padding: 0.75rem;
      background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md);
    }
    .alert-item-left { flex: 1; }
    .alert-item-name { font-size: 0.8125rem; font-weight: 700; color: var(--slate-900); }
  `]
})
export class EmployeesListComponent implements OnInit {
  activeTab: 'employees' | 'leaves' | 'attendance' | 'payroll' | 'expenses' = 'employees';

  employees: Employee[] = [];
  leaveRequests: LeaveRequest[] = [];
  attendanceLogs: AttendanceLog[] = [];
  expenseClaims: ExpenseClaim[] = [];
  salaryAuditLogs: SalaryAuditLog[] = [];

  totalEmployees = 0;
  search = '';
  selectedDepartment = '';
  attendanceDate = new Date().toISOString().substring(0, 10);

  // Modals
  showApplyLeaveModal = false;
  showExpenseModal = false;
  showPayslipModal = false;
  showSalaryModal = false;
  showAttendanceCorrectionModal = false;

  activePayslip: Payslip | null = null;
  selectedEmployeeForSalary: Employee | null = null;
  newSalaryAmount = 0;
  salaryRevisionReason = '';

  leaveForm = {
    employeeId: 1,
    startDate: new Date().toISOString().substring(0, 10),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
    leaveType: 'Annual',
    reason: ''
  };

  expForm = {
    employeeId: 1,
    title: '',
    category: 'Travel',
    amount: 100
  };

  correctionForm = {
    employeeId: 1,
    date: new Date().toISOString().substring(0, 10),
    checkInTime: '09:00:00',
    checkOutTime: '18:00:00',
    status: 'Present',
    correctionReason: ''
  };

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public toast: ToastService
  ) {}

  get isAdmin(): boolean { return this.auth.hasRole(['Admin']); }
  get isManager(): boolean { return this.auth.hasRole(['Manager']); }
  get isHr(): boolean { return this.auth.hasRole(['HR']); }
  get isEmployee(): boolean { return !this.isAdmin && !this.isManager && !this.isHr; }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadLeaves();
    this.loadAttendance();
    this.loadExpenses();
    this.loadSalaryAudits();
  }

  loadEmployees(): void {
    this.api.getEmployees({ page: 1, pageSize: 50, search: this.search }).subscribe(res => {
      if (res.success) {
        let items = res.data.items;
        if (this.selectedDepartment) {
          items = items.filter(e => e.department === this.selectedDepartment);
        }
        this.employees = items;
        this.totalEmployees = res.data.totalCount;
      }
    });
  }

  loadLeaves(): void {
    this.api.getLeaveRequests({ page: 1, pageSize: 50 }).subscribe(res => {
      if (res.success) this.leaveRequests = res.data.items;
    });
  }

  loadAttendance(): void {
    this.api.getAttendance({ page: 1, pageSize: 50 }, undefined, this.attendanceDate).subscribe(res => {
      if (res.success) this.attendanceLogs = res.data.items;
    });
  }

  loadExpenses(): void {
    this.api.getExpenses({ page: 1, pageSize: 50 }).subscribe(res => {
      if (res.success) this.expenseClaims = res.data.items;
    });
  }

  loadSalaryAudits(): void {
    this.api.getSalaryAuditLogs().subscribe(res => {
      if (res.success) this.salaryAuditLogs = res.data;
    });
  }

  openAddModal(): void {
    const fn = prompt('Enter Employee First Name:');
    if (!fn) return;
    const ln = prompt('Enter Employee Last Name:') || 'Smith';
    const email = prompt('Enter Employee Work Email:') || `${fn.toLowerCase()}@swifterp.com`;
    const dept = prompt('Enter Department (Engineering, Finance, Operations, Human Resources):') || 'Engineering';

    this.api.createEmployee({
      employeeCode: `EMP-000${this.employees.length + 1}`,
      firstName: fn,
      lastName: ln,
      email: email,
      phone: '+91 99887 76655',
      department: dept,
      designation: 'Specialist',
      dateOfJoining: new Date().toISOString(),
      salary: 80000,
      annualLeaveBalance: 20
    }).subscribe(res => {
      if (res.success) {
        this.toast.success('Employee Created', `${fn} ${ln} profile registered.`);
        this.loadEmployees();
      }
    });
  }

  openApplyLeaveModal(): void {
    this.showApplyLeaveModal = true;
  }

  openClaimExpenseModal(): void {
    this.showExpenseModal = true;
  }

  openSalaryModal(emp: Employee): void {
    this.selectedEmployeeForSalary = emp;
    this.newSalaryAmount = emp.salary;
    this.salaryRevisionReason = '';
    this.showSalaryModal = true;
  }

  openPayslipView(emp: Employee): void {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    this.api.getPayslip(emp.id, month, year).subscribe(res => {
      if (res.success) {
        this.activePayslip = res.data;
        this.showPayslipModal = true;
      }
    });
  }

  openAttendanceCorrectionModal(): void {
    this.showAttendanceCorrectionModal = true;
  }

  submitApplyLeave(): void {
    if (!this.leaveForm.reason) {
      this.toast.error('Validation Error', 'Please enter a reason.');
      return;
    }
    this.api.applyLeave(this.leaveForm).subscribe(res => {
      if (res.success) {
        this.toast.success('Leave Submitted', 'Your manager has been notified for approval.');
        this.showApplyLeaveModal = false;
        this.loadLeaves();
      }
    });
  }

  submitExpenseClaim(): void {
    if (!this.expForm.title) {
      this.toast.error('Validation Error', 'Please enter an expense title.');
      return;
    }
    this.api.createExpense(this.expForm).subscribe(res => {
      if (res.success) {
        this.toast.success('Claim Submitted', 'Expense reimbursement request registered.');
        this.showExpenseModal = false;
        this.loadExpenses();
      }
    });
  }

  submitSalaryUpdate(): void {
    if (!this.selectedEmployeeForSalary || !this.salaryRevisionReason) {
      this.toast.error('Validation Error', 'Please enter a revision reason for the audit log.');
      return;
    }
    this.api.updateSalary(this.selectedEmployeeForSalary.id, this.newSalaryAmount, this.salaryRevisionReason).subscribe(res => {
      if (res.success) {
        this.toast.success('Salary Revised', 'Audit log registered successfully.');
        this.showSalaryModal = false;
        this.loadEmployees();
        this.loadSalaryAudits();
      }
    });
  }

  submitAttendanceCorrection(): void {
    if (!this.correctionForm.correctionReason) {
      this.toast.error('Validation Error', 'Correction reason is mandatory.');
      return;
    }
    this.api.correctAttendance(this.correctionForm).subscribe(res => {
      if (res.success) {
        this.toast.success('Attendance Corrected', 'Manual punch override recorded.');
        this.showAttendanceCorrectionModal = false;
        this.loadAttendance();
      }
    });
  }

  processLeave(id: number, approved: boolean): void {
    const reason = !approved ? (prompt('Enter rejection reason:') || 'Unavailable dates') : undefined;
    this.api.processLeave(id, approved, reason).subscribe(res => {
      if (res.success) {
        this.toast.success(approved ? 'Leave Approved' : 'Leave Rejected');
        this.loadLeaves();
      }
    });
  }

  actionExpense(id: number, status: string): void {
    this.api.processExpense(id, status).subscribe(res => {
      if (res.success) {
        this.toast.success(`Expense ${status}`);
        this.loadExpenses();
      }
    });
  }
}
