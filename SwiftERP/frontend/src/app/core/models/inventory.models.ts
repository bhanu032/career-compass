export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  currentStock: number;
  minStockThreshold: number;
  unitOfMeasure: string;
  categoryId: number;
  categoryName: string;
  isLowStock: boolean;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description?: string;
  productCount: number;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  location: string;
  contactPerson?: string;
}

export interface StockAdjustment {
  productId: number;
  warehouseId: number;
  quantity: number;
  transactionType: string;
  discrepancyReason?: string; // None, Damaged, Lost, Miscount, Theft, Expiry
  referenceNumber?: string;
  notes?: string;
}

export interface StockLedger {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  warehouseId: number;
  warehouseName: string;
  transactionType: string;
  discrepancyReason?: string;
  quantityChange: number;
  balanceAfter: number;
  referenceNumber: string;
  notes?: string;
  createdAtUtc: string;
  createdBy?: string;
}

export interface LowStockAlert {
  productId: number;
  sku: string;
  name: string;
  currentStock: number;
  minStockThreshold: number;
  deficit: number;
  categoryName: string;
}

export interface WarehouseTransfer {
  id: number;
  transferNumber: string;
  fromWarehouseId: number;
  fromWarehouseName: string;
  toWarehouseId: number;
  toWarehouseName: string;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  status: string;
  notes?: string;
  createdAtUtc: string;
}

