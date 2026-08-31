export interface SalesOrderItem {
  id?: number;
  productId: number;
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  totalAmount: number;
  discount: number;
  taxAmount: number;
  netAmount: number;
  notes?: string;
  rejectionReason?: string;
  createdAtUtc: string;
  approvedBy?: string;
  approvedAtUtc?: string;
  packedAtUtc?: string;
  shippedAtUtc?: string;
  items: SalesOrderItem[];
}

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone: string;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAtUtc: string;
  items: SalesOrderItem[];
}

export interface ApprovalDelegation {
  id: number;
  delegatorUserId: number;
  delegatorName: string;
  delegateeUserId: number;
  delegateeName: string;
  startDateUtc: string;
  endDateUtc: string;
  isActive: boolean;
  reason?: string;
  createdAtUtc: string;
}

