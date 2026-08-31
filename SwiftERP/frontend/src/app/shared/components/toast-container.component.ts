import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      <div *ngFor="let toast of toastService.toasts()" class="toast-item" [ngClass]="toast.type">
        <div class="toast-header">
          <strong>{{ toast.title }}</strong>
          <button (click)="toastService.remove(toast.id)" class="close-btn">&times;</button>
        </div>
        <div *ngIf="toast.message" class="toast-body">{{ toast.message }}</div>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }
    .toast-item {
      padding: 0.875rem 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      background: #ffffff;
      border-left: 4px solid var(--primary);
      animation: slideIn 0.2s ease-out;

      &.success { border-color: var(--success); }
      &.danger { border-color: var(--danger); }
      &.warning { border-color: var(--warning); }
    }
    .toast-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }
    .toast-body {
      font-size: 0.8125rem;
      color: var(--slate-600);
      margin-top: 0.25rem;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--slate-600);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
