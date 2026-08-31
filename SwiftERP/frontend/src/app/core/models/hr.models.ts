export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  salary: number;
  annualLeaveBalance: number;
  probationEndDate?: string;
  isOnProbation?: boolean;
  onboardingStatus?: string;
  isActive?: boolean;
  userId?: number;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  totalDays: number;
  reason: string;
  status: string;
  createdAtUtc: string;
  approverName?: string;
  rejectionReason?: string;
}

export interface AttendanceLog {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: string;
  notes?: string;
  isManualCorrection: boolean;
  correctionReason?: string;
}

export interface ExpenseClaim {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  title: string;
  category: string;
  amount: number;
  receiptUrl?: string;
  status: string;
  managerComment?: string;
  createdAtUtc: string;
  processedAtUtc?: string;
}

export interface SalaryAuditLog {
  id: number;
  employeeId: number;
  employeeName: string;
  oldSalary: number;
  newSalary: number;
  changedBy: string;
  reason: string;
  createdAtUtc: string;
}

export interface Payslip {
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  department: string;
  designation: string;
  month: number;
  year: number;
  basicSalary: number;
  houseRentAllowance: number;
  specialAllowance: number;
  grossEarnings: number;
  taxDeduction: number;
  providentFund: number;
  totalDeductions: number;
  netPayable: number;
  generatedAtUtc: string;
}

