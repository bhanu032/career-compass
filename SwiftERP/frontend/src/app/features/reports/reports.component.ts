import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { StockValuation, SalesSummary } from '../../core/models/reports.models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-shell">

      <!-- Header -->
      <div class="page-header">
        <div class="page-header-left">
          <div class="breadcrumb"><span>Analytics</span><span class="bc-sep">/</span><span class="bc-current">Reports</span></div>
          <h1 class="page-title">Executive Reports & Valuation</h1>
          <p class="page-subtitle">MSSQL stored procedure aggregated stock valuation and sales performance analysis.</p>
        </div>
        <div class="page-header-right">
          <div class="report-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
            MSSQL Stored Proc Engine
          </div>
        </div>
      </div>

      <!-- Summary KPIs -->
      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="report-kpi">
          <div class="report-kpi-label">Total Inventory (Cost)</div>
          <div class="report-kpi-value">\${{ totalCostValue | number:'1.0-0' }}</div>
          <div class="report-kpi-sub">Across all product categories</div>
        </div>
        <div class="report-kpi">
          <div class="report-kpi-label">Total Inventory (Retail)</div>
          <div class="report-kpi-value">\${{ totalRetailValue | number:'1.0-0' }}</div>
          <div class="report-kpi-sub">At current selling prices</div>
        </div>
        <div class="report-kpi" style="border-color:var(--success-light);background:#f0fdf4">
          <div class="report-kpi-label" style="color:var(--success)">Projected Gross Profit</div>
          <div class="report-kpi-value" style="color:var(--success)">\${{ totalProfit | number:'1.0-0' }}</div>
          <div class="report-kpi-sub">Upon full stock liquidation</div>
        </div>
      </div>

      <!-- Valuation table -->
      <div class="card card-flush">
        <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
          <div>
            <div class="card-title">Stock Valuation by Category</div>
            <div class="card-subtitle">Aggregated via SP_GetInventoryValuation stored procedure</div>
          </div>
        </div>
        <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Total SKUs</th>
                <th>Total Qty</th>
                <th>Total Cost Value</th>
                <th>Total Retail Value</th>
                <th>Projected Profit</th>
                <th>Margin %</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of stockValuations">
                <td><strong style="color:var(--slate-900)">{{ row.categoryName }}</strong></td>
                <td><span class="badge badge-slate">{{ row.totalProducts }}</span></td>
                <td>{{ row.totalStockQuantity | number }} units</td>
                <td style="font-family:var(--font-mono);font-size:0.8rem">\${{ row.totalCostValue | number:'1.2-2' }}</td>
                <td style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--slate-900)">\${{ row.totalRetailValue | number:'1.2-2' }}</td>
                <td><span class="badge badge-success">+\${{ row.potentialProfit | number:'1.2-2' }}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px">
                    <div style="width:50px;height:4px;background:var(--slate-200);border-radius:9999px;overflow:hidden">
                      <div [style.width]="getMarginPct(row) + '%'" style="height:100%;background:var(--success);border-radius:9999px"></div>
                    </div>
                    <span style="font-size:0.75rem;font-weight:700;color:var(--success)">{{ getMarginPct(row) | number:'1.0-0' }}%</span>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!stockValuations.length">
                <td colspan="7">
                  <div style="text-align:center;padding:3rem;color:var(--slate-400)">No valuation data available.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sales summary -->
      <div class="card card-flush">
        <div class="card-header" style="padding:1.25rem 1.25rem 0.875rem">
          <div>
            <div class="card-title">Sales Revenue Summary</div>
            <div class="card-subtitle">Daily fulfilled order revenue and average order value trends</div>
          </div>
        </div>
        <div class="table-container" style="border:none;border-radius:0;box-shadow:none">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders Fulfilled</th>
                <th>Daily Revenue</th>
                <th>Avg Order Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of salesSummary">
                <td><strong style="color:var(--slate-900)">{{ s.date | date:'MMMM d, y' }}</strong></td>
                <td><span class="badge badge-brand">{{ s.totalOrders }} orders</span></td>
                <td style="font-family:var(--font-mono);font-weight:700;font-size:0.875rem;color:var(--slate-900)">\${{ s.totalRevenue | number:'1.2-2' }}</td>
                <td style="font-family:var(--font-mono);font-size:0.8rem;color:var(--slate-500)">\${{ s.averageOrderValue | number:'1.2-2' }}</td>
              </tr>
              <tr *ngIf="!salesSummary?.length">
                <td colspan="4">
                  <div style="text-align:center;padding:3rem;color:var(--slate-400)">No sales transactions yet. Create and approve a sales order to see trends here.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb { display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--slate-400);margin-bottom:4px; .bc-sep{opacity:0.5} .bc-current{color:var(--slate-600);font-weight:600} }
    .report-badge {
      display:flex;align-items:center;gap:6px;
      font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;
      color:#6b7280;background:#f3f4f6;padding:5px 10px;border-radius:9999px;
      border:1px solid #e5e7eb;
    }
    .report-kpi {
      background:var(--surface);
      border:1px solid var(--slate-200);
      border-radius:var(--radius-lg);
      padding:1.25rem;
      box-shadow:var(--shadow-sm);
    }
    .report-kpi-label { font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--slate-500);margin-bottom:6px; }
    .report-kpi-value { font-size:1.75rem;font-weight:800;color:var(--slate-900);letter-spacing:-0.03em;font-variant-numeric:tabular-nums; }
    .report-kpi-sub { font-size:0.6875rem;color:var(--slate-400);margin-top:4px; }
  `]
})
export class ReportsComponent implements OnInit {
  stockValuations: StockValuation[] = [];
  salesSummary: SalesSummary[] = [];

  constructor(private api: ApiService) {}

  get totalCostValue():   number { return this.stockValuations.reduce((s,r) => s + r.totalCostValue, 0); }
  get totalRetailValue(): number { return this.stockValuations.reduce((s,r) => s + r.totalRetailValue, 0); }
  get totalProfit():      number { return this.stockValuations.reduce((s,r) => s + r.potentialProfit, 0); }

  getMarginPct(row: StockValuation): number {
    if (!row.totalRetailValue) return 0;
    return Math.min(100, (row.potentialProfit / row.totalRetailValue) * 100);
  }

  ngOnInit(): void {
    this.api.getStockValuation().subscribe(res => { if (res.success) this.stockValuations = res.data; });
    this.api.getSalesSummary().subscribe(res => { if (res.success) this.salesSummary = res.data; });
  }
}
