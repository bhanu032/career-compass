import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Product, Category, Warehouse, StockAdjustment, WarehouseTransfer } from '../../core/models/inventory.models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-shell">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Inventory & Stock Ledger</h1>
          <p class="page-subtitle">Product catalog, atomic stock movements, warehouse transfers & audit discrepancies</p>
        </div>
        <div class="page-header-right">
          <button *ngIf="isAdmin || isManager || isWarehouse" (click)="openTransferModal()" class="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            Warehouse Transfer
          </button>
          <button *ngIf="isAdmin || isManager" (click)="openAddModal()" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </div>
      </div>

      <!-- Tab bar -->
      <div class="tab-bar">
        <button class="tab-btn" [class.active]="activeTab === 'catalog'" (click)="activeTab = 'catalog'">
          Product Catalog ({{ totalCount }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'transfers'" (click)="activeTab = 'transfers'">
          Inter-Warehouse Transfers
        </button>
      </div>

      <!-- ════════════════ TAB 1: PRODUCT CATALOG ════════════════ -->
      <ng-container *ngIf="activeTab === 'catalog'">
        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="filter-search">
            <input type="text" [(ngModel)]="search" (ngModelChange)="loadProducts()"
              class="input-control" placeholder="Search by SKU or product name..." />
          </div>
          <div class="filter-select">
            <select [(ngModel)]="selectedCategory" (ngModelChange)="loadProducts()" class="input-control">
              <option [ngValue]="null">All Categories</option>
              <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Current Stock</th>
                <th>Min Safety</th>
                <th>Status</th>
                <th *ngIf="isAdmin || isManager || isWarehouse" style="text-align:right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td><span class="sku-chip">{{ p.sku }}</span></td>
                <td>
                  <div style="font-weight:700;color:var(--slate-900)">{{ p.name }}</div>
                  <div class="text-muted">{{ p.description }}</div>
                </td>
                <td><span class="badge badge-brand">{{ p.categoryName }}</span></td>
                <td style="font-family:var(--font-mono);font-weight:700">\${{ p.unitPrice | number:'1.2-2' }}</td>
                <td style="font-weight:800;font-size:0.9375rem" [ngClass]="p.isLowStock ? 'text-danger' : ''">
                  {{ p.currentStock }} {{ p.unitOfMeasure }}
                </td>
                <td class="text-muted">{{ p.minStockThreshold }}</td>
                <td>
                  <span class="badge" [ngClass]="p.isLowStock ? 'badge-danger' : 'badge-success'">
                    {{ p.isLowStock ? 'Low Stock' : 'In Stock' }}
                  </span>
                </td>
                <td *ngIf="isAdmin || isManager || isWarehouse">
                  <div class="actions-cell" style="justify-content:flex-end">
                    <button (click)="openAdjustStock(p)" class="btn btn-secondary btn-sm">
                      Adjust Stock
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!products.length">
                <td colspan="8" style="text-align:center;padding:2.5rem;color:var(--slate-400)">
                  No products found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <!-- ════════════════ TAB 2: INTER-WAREHOUSE TRANSFERS ════════════════ -->
      <ng-container *ngIf="activeTab === 'transfers'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Transfer #</th>
                <th>Source Warehouse</th>
                <th>Destination Warehouse</th>
                <th>Product Item</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let trf of transfers">
                <td><span class="sku-chip">{{ trf.transferNumber }}</span></td>
                <td><strong style="color:var(--slate-800)">{{ trf.fromWarehouseName }}</strong></td>
                <td><strong style="color:var(--slate-800)">{{ trf.toWarehouseName }}</strong></td>
                <td>
                  <div style="font-weight:600;color:var(--slate-900)">{{ trf.productName }}</div>
                  <div class="text-muted">{{ trf.productSku }}</div>
                </td>
                <td style="font-family:var(--font-mono);font-weight:700">{{ trf.quantity }} pcs</td>
                <td><span class="badge badge-success">{{ trf.status }}</span></td>
                <td>{{ trf.createdAtUtc | date:'medium' }}</td>
              </tr>
              <tr *ngIf="!transfers.length">
                <td colspan="7" style="text-align:center;padding:2.5rem;color:var(--slate-400)">
                  No warehouse transfers logged yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>

      <!-- ════════════════ MODALS ════════════════ -->

      <!-- Stock Adjustment Modal -->
      <div class="modal-overlay" *ngIf="showAdjustModal && selectedProduct" (click)="showAdjustModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Adjust Stock — {{ selectedProduct.name }} ({{ selectedProduct.sku }})</div>
            <button (click)="showAdjustModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitAdjustStock()" class="modal-body modal-form">
            <div class="form-group">
              <label>Warehouse</label>
              <select [(ngModel)]="adjWarehouseId" name="wh" class="input-control">
                <option *ngFor="let w of warehouses" [value]="w.id">{{ w.name }} ({{ w.code }})</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Operation Type</label>
                <select [(ngModel)]="adjType" name="adjType" class="input-control">
                  <option value="StockIn">Stock In (+ Intake)</option>
                  <option value="StockOut">Stock Out (− Dispatch)</option>
                  <option value="Adjustment">Count Reconciliation</option>
                </select>
              </div>
              <div class="form-group">
                <label>Discrepancy Reason</label>
                <select [(ngModel)]="adjDiscrepancyReason" name="adjReason" class="input-control">
                  <option value="None">None (Standard Intake/Dispatch)</option>
                  <option value="Damaged">Damaged Goods</option>
                  <option value="Lost">Lost / Missing Goods</option>
                  <option value="Miscount">Physical Inventory Miscount</option>
                  <option value="Theft">Theft / Shrinkage</option>
                  <option value="Expiry">Expired Inventory</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Quantity Delta</label>
              <input type="number" [(ngModel)]="adjQty" name="adjQty" class="input-control" placeholder="10" required />
            </div>

            <div class="form-group">
              <label>Audit Notes / Reference</label>
              <input type="text" [(ngModel)]="adjNotes" name="adjNotes" class="input-control" placeholder="Physical floor count verification" />
            </div>

            <div class="modal-footer">
              <button type="button" (click)="showAdjustModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Commit Stock Adjustment</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Warehouse Transfer Modal -->
      <div class="modal-overlay" *ngIf="showTransferModal" (click)="showTransferModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Inter-Warehouse Inventory Transfer</div>
            <button (click)="showTransferModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitTransfer()" class="modal-body modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Source Warehouse (From)</label>
                <select [(ngModel)]="transferForm.fromWarehouseId" name="fromWh" class="input-control">
                  <option *ngFor="let w of warehouses" [value]="w.id">{{ w.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Destination Warehouse (To)</label>
                <select [(ngModel)]="transferForm.toWarehouseId" name="toWh" class="input-control">
                  <option *ngFor="let w of warehouses" [value]="w.id">{{ w.name }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Select Product Item</label>
              <select [(ngModel)]="transferForm.productId" name="trfProd" class="input-control">
                <option *ngFor="let p of products" [value]="p.id">{{ p.sku }} — {{ p.name }} (Stock: {{ p.currentStock }})</option>
              </select>
            </div>

            <div class="form-group">
              <label>Transfer Quantity</label>
              <input type="number" [(ngModel)]="transferForm.quantity" name="trfQty" class="input-control" min="1" placeholder="5" required />
            </div>

            <div class="form-group">
              <label>Transfer Notes</label>
              <input type="text" [(ngModel)]="transferForm.notes" name="trfNotes" class="input-control" placeholder="Rebalancing regional distribution stock" />
            </div>

            <div class="modal-footer">
              <button type="button" (click)="showTransferModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Dispatch Transfer</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class ProductsListComponent implements OnInit {
  activeTab: 'catalog' | 'transfers' = 'catalog';

  products: Product[] = [];
  categories: Category[] = [];
  warehouses: Warehouse[] = [];
  transfers: WarehouseTransfer[] = [];

  totalCount = 0;
  search = '';
  selectedCategory: number | null = null;

  showAdjustModal = false;
  showTransferModal = false;
  selectedProduct: Product | null = null;

  adjWarehouseId = 1;
  adjType = 'StockIn';
  adjDiscrepancyReason = 'None';
  adjQty = 10;
  adjNotes = '';

  transferForm = {
    fromWarehouseId: 1,
    toWarehouseId: 2,
    productId: 1,
    quantity: 5,
    notes: 'Regional fulfillment rebalance'
  };

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private toast: ToastService
  ) {}

  get isAdmin(): boolean { return this.auth.hasRole(['Admin']); }
  get isManager(): boolean { return this.auth.hasRole(['Manager']); }
  get isWarehouse(): boolean { return this.auth.hasRole(['WarehouseStaff', 'Warehouse']); }

  ngOnInit(): void {
    this.loadProducts();
    this.loadMetadata();
    this.loadTransfers();
  }

  loadProducts(): void {
    this.api.getProducts({ page: 1, pageSize: 50, search: this.search }, this.selectedCategory ?? undefined).subscribe(res => {
      if (res.success) {
        this.products = res.data.items;
        this.totalCount = res.data.totalCount;
      }
    });
  }

  loadMetadata(): void {
    this.api.getCategories().subscribe(res => { if (res.success) this.categories = res.data; });
    this.api.getWarehouses().subscribe(res => {
      if (res.success) {
        this.warehouses = res.data;
        if (this.warehouses.length > 0) {
          this.adjWarehouseId = this.warehouses[0].id;
          this.transferForm.fromWarehouseId = this.warehouses[0].id;
          if (this.warehouses.length > 1) {
            this.transferForm.toWarehouseId = this.warehouses[1].id;
          }
        }
      }
    });
  }

  loadTransfers(): void {
    this.api.getWarehouseTransfers().subscribe(res => {
      if (res.success) this.transfers = res.data;
    });
  }

  openAdjustStock(product: Product): void {
    this.selectedProduct = product;
    this.adjQty = 10;
    this.adjType = 'StockIn';
    this.adjDiscrepancyReason = 'None';
    this.adjNotes = '';
    this.showAdjustModal = true;
  }

  openTransferModal(): void {
    if (this.products.length > 0) {
      this.transferForm.productId = this.products[0].id;
    }
    this.showTransferModal = true;
  }

  openAddModal(): void {
    const name = prompt('Enter Product Name:');
    if (!name) return;
    const sku = prompt('Enter SKU (e.g. LAP-002):') || `PROD-${Date.now().toString().slice(-4)}`;
    const price = parseFloat(prompt('Enter Unit Price ($):') || '99.99');

    this.api.createProduct({
      sku: sku,
      name: name,
      description: 'Enterprise catalog product',
      unitPrice: price,
      costPrice: price * 0.7,
      currentStock: 25,
      minStockThreshold: 5,
      unitOfMeasure: 'Units',
      categoryId: this.categories.length > 0 ? this.categories[0].id : 1
    }).subscribe(res => {
      if (res.success) {
        this.toast.success('Product Added', `${res.data.name} added to catalog.`);
        this.loadProducts();
      }
    });
  }

  submitAdjustStock(): void {
    if (!this.selectedProduct) return;

    this.api.adjustStock({
      productId: this.selectedProduct.id,
      warehouseId: this.adjWarehouseId,
      quantity: this.adjQty,
      transactionType: this.adjType,
      discrepancyReason: this.adjDiscrepancyReason,
      notes: this.adjNotes
    }).subscribe(res => {
      if (res.success) {
        this.toast.success('Stock Adjusted', `New balance: ${res.data.balanceAfter}`);
        this.showAdjustModal = false;
        this.loadProducts();
      }
    });
  }

  submitTransfer(): void {
    if (this.transferForm.fromWarehouseId === this.transferForm.toWarehouseId) {
      this.toast.error('Validation Error', 'Source and Destination warehouses must be different.');
      return;
    }

    this.api.createWarehouseTransfer(this.transferForm).subscribe(res => {
      if (res.success) {
        this.toast.success('Transfer Dispatched', `Transfer ${res.data.transferNumber} completed.`);
        this.showTransferModal = false;
        this.loadProducts();
        this.loadTransfers();
      }
    });
  }
}
