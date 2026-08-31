import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedRequest, PagedResult } from '../models/api-response.model';
import { Product, Category, Warehouse, StockAdjustment, StockLedger, LowStockAlert, WarehouseTransfer } from '../models/inventory.models';
import { SalesOrder, ApprovalDelegation } from '../models/sales.models';
import { Employee, LeaveRequest, AttendanceLog, ExpenseClaim, SalaryAuditLog, Payslip } from '../models/hr.models';
import { DashboardMetrics, StockValuation, SalesSummary } from '../models/reports.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Inventory
  getProducts(req: PagedRequest, categoryId?: number): Observable<ApiResponse<PagedResult<Product>>> {
    let params = new HttpParams()
      .set('page', req.page)
      .set('pageSize', req.pageSize);
    if (req.search) params = params.set('search', req.search);
    if (req.sortBy) params = params.set('sortBy', req.sortBy);
    if (req.sortDescending) params = params.set('sortDescending', req.sortDescending);
    if (categoryId) params = params.set('categoryId', categoryId);

    return this.http.get<ApiResponse<PagedResult<Product>>>(`${this.baseUrl}/inventory/products`, { params });
  }

  createProduct(data: any): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/inventory/products`, data);
  }

  adjustStock(data: StockAdjustment): Observable<ApiResponse<StockLedger>> {
    return this.http.post<ApiResponse<StockLedger>>(`${this.baseUrl}/inventory/stock-adjust`, data);
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/inventory/categories`);
  }

  getWarehouses(): Observable<ApiResponse<Warehouse[]>> {
    return this.http.get<ApiResponse<Warehouse[]>>(`${this.baseUrl}/inventory/warehouses`);
  }

  getLowStockAlerts(): Observable<ApiResponse<LowStockAlert[]>> {
    return this.http.get<ApiResponse<LowStockAlert[]>>(`${this.baseUrl}/inventory/low-stock`);
  }

  createWarehouseTransfer(data: any): Observable<ApiResponse<WarehouseTransfer>> {
    return this.http.post<ApiResponse<WarehouseTransfer>>(`${this.baseUrl}/inventory/transfers`, data);
  }

  getWarehouseTransfers(): Observable<ApiResponse<WarehouseTransfer[]>> {
    return this.http.get<ApiResponse<WarehouseTransfer[]>>(`${this.baseUrl}/inventory/transfers`);
  }

  // Sales Orders
  getSalesOrders(req: PagedRequest, status?: string): Observable<ApiResponse<PagedResult<SalesOrder>>> {
    let params = new HttpParams().set('page', req.page).set('pageSize', req.pageSize);
    if (req.search) params = params.set('search', req.search);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<PagedResult<SalesOrder>>>(`${this.baseUrl}/sales/orders`, { params });
  }

  createSalesOrder(data: any): Observable<ApiResponse<SalesOrder>> {
    return this.http.post<ApiResponse<SalesOrder>>(`${this.baseUrl}/sales/orders`, data);
  }

  approveSalesOrder(id: number): Observable<ApiResponse<SalesOrder>> {
    return this.http.post<ApiResponse<SalesOrder>>(`${this.baseUrl}/sales/orders/${id}/approve`, {});
  }

  rejectSalesOrder(id: number, rejectionReason: string): Observable<ApiResponse<SalesOrder>> {
    return this.http.post<ApiResponse<SalesOrder>>(`${this.baseUrl}/sales/orders/${id}/reject`, { rejectionReason });
  }

  fulfillSalesOrder(id: number, stage: string): Observable<ApiResponse<SalesOrder>> {
    return this.http.post<ApiResponse<SalesOrder>>(`${this.baseUrl}/sales/orders/${id}/fulfill`, { stage });
  }

  // HR
  getEmployees(req: PagedRequest): Observable<ApiResponse<PagedResult<Employee>>> {
    let params = new HttpParams().set('page', req.page).set('pageSize', req.pageSize);
    if (req.search) params = params.set('search', req.search);
    return this.http.get<ApiResponse<PagedResult<Employee>>>(`${this.baseUrl}/hr/employees`, { params });
  }

  createEmployee(data: any): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(`${this.baseUrl}/hr/employees`, data);
  }

  getLeaveRequests(req: PagedRequest, status?: string): Observable<ApiResponse<PagedResult<LeaveRequest>>> {
    let params = new HttpParams().set('page', req.page).set('pageSize', req.pageSize);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<PagedResult<LeaveRequest>>>(`${this.baseUrl}/hr/leaves`, { params });
  }

  applyLeave(data: any): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.baseUrl}/hr/leaves`, data);
  }

  processLeave(id: number, approved: boolean, rejectionReason?: string): Observable<ApiResponse<LeaveRequest>> {
    return this.http.post<ApiResponse<LeaveRequest>>(`${this.baseUrl}/hr/leaves/${id}/action`, { approved, rejectionReason });
  }

  // Attendance
  checkIn(employeeId: number, notes?: string): Observable<ApiResponse<AttendanceLog>> {
    return this.http.post<ApiResponse<AttendanceLog>>(`${this.baseUrl}/hr/attendance/check-in`, { employeeId, notes });
  }

  checkOut(employeeId: number, notes?: string): Observable<ApiResponse<AttendanceLog>> {
    return this.http.post<ApiResponse<AttendanceLog>>(`${this.baseUrl}/hr/attendance/check-out`, { employeeId, notes });
  }

  getAttendance(req: PagedRequest, employeeId?: number, date?: string): Observable<ApiResponse<PagedResult<AttendanceLog>>> {
    let params = new HttpParams().set('page', req.page).set('pageSize', req.pageSize);
    if (employeeId) params = params.set('employeeId', employeeId);
    if (date) params = params.set('date', date);
    return this.http.get<ApiResponse<PagedResult<AttendanceLog>>>(`${this.baseUrl}/hr/attendance`, { params });
  }

  correctAttendance(data: any): Observable<ApiResponse<AttendanceLog>> {
    return this.http.post<ApiResponse<AttendanceLog>>(`${this.baseUrl}/hr/attendance/correct`, data);
  }

  // Expenses
  getExpenses(req: PagedRequest, employeeId?: number, status?: string): Observable<ApiResponse<PagedResult<ExpenseClaim>>> {
    let params = new HttpParams().set('page', req.page).set('pageSize', req.pageSize);
    if (employeeId) params = params.set('employeeId', employeeId);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<PagedResult<ExpenseClaim>>>(`${this.baseUrl}/hr/expenses`, { params });
  }

  createExpense(data: any): Observable<ApiResponse<ExpenseClaim>> {
    return this.http.post<ApiResponse<ExpenseClaim>>(`${this.baseUrl}/hr/expenses`, data);
  }

  processExpense(id: number, status: string, comment?: string): Observable<ApiResponse<ExpenseClaim>> {
    return this.http.post<ApiResponse<ExpenseClaim>>(`${this.baseUrl}/hr/expenses/${id}/action`, { status, comment });
  }

  // Payroll & Audit
  updateSalary(employeeId: number, newSalary: number, reason: string): Observable<ApiResponse<SalaryAuditLog>> {
    return this.http.put<ApiResponse<SalaryAuditLog>>(`${this.baseUrl}/hr/employees/${employeeId}/salary`, { newSalary, reason });
  }

  getPayslip(employeeId: number, month: number, year: number): Observable<ApiResponse<Payslip>> {
    return this.http.get<ApiResponse<Payslip>>(`${this.baseUrl}/hr/employees/${employeeId}/payslip?month=${month}&year=${year}`);
  }

  getSalaryAuditLogs(employeeId?: number): Observable<ApiResponse<SalaryAuditLog[]>> {
    let params = new HttpParams();
    if (employeeId) params = params.set('employeeId', employeeId);
    return this.http.get<ApiResponse<SalaryAuditLog[]>>(`${this.baseUrl}/hr/salary-audit-logs`, { params });
  }

  // Manager Delegations
  getDelegations(delegatorId?: number): Observable<ApiResponse<ApprovalDelegation[]>> {
    let params = new HttpParams();
    if (delegatorId) params = params.set('delegatorId', delegatorId);
    return this.http.get<ApiResponse<ApprovalDelegation[]>>(`${this.baseUrl}/manager/delegations`, { params });
  }

  createDelegation(data: any): Observable<ApiResponse<ApprovalDelegation>> {
    return this.http.post<ApiResponse<ApprovalDelegation>>(`${this.baseUrl}/manager/delegations`, data);
  }

  // Reports
  getDashboard(): Observable<ApiResponse<DashboardMetrics>> {
    return this.http.get<ApiResponse<DashboardMetrics>>(`${this.baseUrl}/reports/dashboard`);
  }

  getStockValuation(): Observable<ApiResponse<StockValuation[]>> {
    return this.http.get<ApiResponse<StockValuation[]>>(`${this.baseUrl}/reports/stock-valuation`);
  }

  getSalesSummary(): Observable<ApiResponse<SalesSummary[]>> {
    return this.http.get<ApiResponse<SalesSummary[]>>(`${this.baseUrl}/reports/sales-summary`);
  }
}

