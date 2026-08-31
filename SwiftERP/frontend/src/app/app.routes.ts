import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProductsListComponent } from './features/inventory/products-list.component';
import { SalesOrdersComponent } from './features/sales/sales-orders.component';
import { EmployeesListComponent } from './features/hr/employees-list.component';
import { ReportsComponent } from './features/reports/reports.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'inventory',
        component: ProductsListComponent,
        canActivate: [roleGuard(['Admin', 'Manager', 'WarehouseStaff', 'Warehouse', 'Employee'])]
      },
      {
        path: 'sales',
        component: SalesOrdersComponent,
        canActivate: [roleGuard(['Admin', 'Manager'])]
      },
      {
        path: 'hr',
        component: EmployeesListComponent,
        canActivate: [roleGuard(['Admin', 'Manager', 'Employee'])]
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [roleGuard(['Admin', 'Manager'])]
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
