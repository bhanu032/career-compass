import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { SalesOrder } from '../../core/models/sales.models';
import { Product } from '../../core/models/inventory.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="page-shell">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Sales Orders & Fulfillment</h1>
          <p class="page-subtitle">Draft generation, manager approvals, atomic inventory deduction & fulfillment</p>
        </div>
        <div class="page-header-right">
          <button (click)="openCreateModal()" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Sales Order
          </button>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-search">
          <input type="text" [(ngModel)]="search" (ngModelChange)="loadOrders()"
            class="input-control" placeholder="Search order # or customer..." />
        </div>
        <div class="filter-select">
          <select [(ngModel)]="statusFilter" (ngModelChange)="loadOrders()" class="input-control">
            <option value="">All Statuses</option>
            <option value="Draft">Draft (Pending Approval)</option>
            <option value="Approved">Approved (Allocated)</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Orders table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Net Amount</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Approved By</th>
              <th style="text-align:right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of orders">
              <td><span class="sku-chip">{{ order.orderNumber }}</span></td>
              <td>
                <div style="font-weight:700;color:var(--slate-900)">{{ order.customerName }}</div>
                <div class="text-muted">{{ order.customerEmail }}</div>
              </td>
              <td>
                <span class="badge badge-brand">{{ order.items.length }} line items</span>
              </td>
              <td style="font-family:var(--font-mono);font-weight:700;color:var(--slate-900)">
                \${{ order.netAmount | number:'1.2-2' }}
              </td>
              <td>
                <app-status-badge [status]="order.status"></app-status-badge>
                <div *ngIf="order.rejectionReason" class="text-danger" style="font-size:0.6875rem;margin-top:2px">
                  Reason: {{ order.rejectionReason }}
                </div>
              </td>
              <td>{{ order.createdAtUtc | date:'mediumDate' }}</td>
              <td>
                <span *ngIf="order.approvedBy" style="font-size:0.8125rem;font-weight:600;color:var(--slate-700)">
                  {{ order.approvedBy }}
                </span>
                <span *ngIf="!order.approvedBy" class="text-muted">—</span>
              </td>
              <td>
                <div class="actions-cell" style="justify-content:flex-end">
                  <!-- Manager: Approve / Reject -->
                  <button *ngIf="(isAdmin || isManager) && order.status === 'Draft'"
                    (click)="approve(order)" class="btn btn-success btn-sm">
                    Approve
                  </button>
                  <button *ngIf="(isAdmin || isManager) && order.status === 'Draft'"
                    (click)="openReject(order)" class="btn btn-danger btn-sm">
                    Reject
                  </button>

                  <!-- Warehouse / Manager: Fulfillment stages -->
                  <button *ngIf="(isAdmin || isManager || isWarehouse) && order.status === 'Approved'"
                    (click)="fulfill(order, 'Packed')" class="btn btn-secondary btn-sm">
                    Mark Packed
                  </button>
                  <button *ngIf="(isAdmin || isManager || isWarehouse) && order.status === 'Packed'"
                    (click)="fulfill(order, 'Shipped')" class="btn btn-primary btn-sm">
                    Mark Shipped
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="!orders.length">
              <td colspan="8" style="text-align:center;padding:2.5rem;color:var(--slate-400)">
                No sales orders found matching criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ════════════════ MODALS ════════════════ -->

      <!-- Create Order Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal" (click)="showCreateModal = false">
        <div class="modal-box" style="max-width:640px" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Create Sales Order (Draft)</div>
            <button (click)="showCreateModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitCreateOrder()" class="modal-body modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>Customer Name *</label>
                <input type="text" [(ngModel)]="newOrder.customerName" name="cname" class="input-control" placeholder="Acme Corp" required />
              </div>
              <div class="form-group">
                <label>Customer Email *</label>
                <input type="email" [(ngModel)]="newOrder.customerEmail" name="cemail" class="input-control" placeholder="procurement@acme.com" required />
              </div>
            </div>

            <div class="form-group">
              <label>Select Product Item</label>
              <select [(ngModel)]="selectedProductId" name="prod" class="input-control">
                <option *ngFor="let p of products" [value]="p.id">
                  {{ p.sku }} — {{ p.name }} (\${{ p.unitPrice }} | Stock: {{ p.currentStock }})
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" [(ngModel)]="orderQty" name="qty" class="input-control" min="1" placeholder="2" />
              </div>
              <div class="form-group">
                <label>Discount (\$)</label>
                <input type="number" [(ngModel)]="newOrder.discount" name="disc" class="input-control" placeholder="0.00" />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" (click)="showCreateModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-primary">Create Draft Order</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Reject Order Modal -->
      <div class="modal-overlay" *ngIf="showRejectModal && selectedOrder" (click)="showRejectModal = false">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">Reject Order — {{ selectedOrder.orderNumber }}</div>
            <button (click)="showRejectModal = false" class="btn btn-ghost btn-icon">✕</button>
          </div>
          <form (ngSubmit)="submitReject()" class="modal-body modal-form">
            <div class="form-group">
              <label>Mandatory Rejection Reason *</label>
              <textarea [(ngModel)]="rejectionReason" name="rejReason" class="input-control" rows="3"
                placeholder="e.g. Customer credit limit exceeded, insufficient stock reserve" required></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" (click)="showRejectModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-danger">Confirm Rejection</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class SalesOrdersComponent implements OnInit {
  orders: SalesOrder[] = [];
  products: Product[] = [];
  search = '';
  statusFilter = '';

  showCreateModal = false;
  showRejectModal = false;
  selectedOrder: SalesOrder | null = null;
  rejectionReason = '';

  selectedProductId = 1;
  orderQty = 2;

  newOrder = {
    customerName: '',
    customerEmail: '',
    customerPhone: '+1 800 555 0199',
    discount: 0,
    taxAmount: 0,
    notes: 'Standard enterprise purchase order'
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
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders(): void {
    this.api.getSalesOrders({ page: 1, pageSize: 50, search: this.search }, this.statusFilter || undefined).subscribe(res => {
      if (res.success) this.orders = res.data.items;
    });
  }

  loadProducts(): void {
    this.api.getProducts({ page: 1, pageSize: 100 }).subscribe(res => {
      if (res.success && res.data.items.length > 0) {
        this.products = res.data.items;
        this.selectedProductId = this.products[0].id;
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  submitCreateOrder(): void {
    const prod = this.products.find(p => p.id == this.selectedProductId);
    if (!prod) return;

    const payload = {
      ...this.newOrder,
      taxAmount: (prod.unitPrice * this.orderQty - this.newOrder.discount) * 0.10,
      items: [
        {
          productId: prod.id,
          quantity: this.orderQty,
          unitPrice: prod.unitPrice
        }
      ]
    };

    this.api.createSalesOrder(payload).subscribe(res => {
      if (res.success) {
        this.toast.success('Order Created', `Order ${res.data.orderNumber} created in Draft status.`);
        this.showCreateModal = false;
        this.loadOrders();
      }
    });
  }

  approve(order: SalesOrder): void {
    this.api.approveSalesOrder(order.id).subscribe(res => {
      if (res.success) {
        this.toast.success('Order Approved', `Inventory stock deducted atomically.`);
        this.loadOrders();
      }
    });
  }

  openReject(order: SalesOrder): void {
    this.selectedOrder = order;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  submitReject(): void {
    if (!this.selectedOrder || !this.rejectionReason) {
      this.toast.error('Validation Error', 'Rejection reason is mandatory.');
      return;
    }
    this.api.rejectSalesOrder(this.selectedOrder.id, this.rejectionReason).subscribe(res => {
      if (res.success) {
        this.toast.success('Order Rejected', `Order ${this.selectedOrder?.orderNumber} has been rejected.`);
        this.showRejectModal = false;
        this.loadOrders();
      }
    });
  }

  fulfill(order: SalesOrder, stage: string): void {
    this.api.fulfillSalesOrder(order.id, stage).subscribe(res => {
      if (res.success) {
        this.toast.success(`Order ${stage}`, `Order ${order.orderNumber} updated to ${stage}.`);
        this.loadOrders();
      }
    });
  }
}
