import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card stat-card">
      <div class="stat-meta">
        <span class="stat-title">{{ title }}</span>
        <span class="stat-value">{{ value }}</span>
        <span *ngIf="subtitle" class="stat-subtitle" [ngClass]="trendClass">{{ subtitle }}</span>
      </div>
      <div *ngIf="icon" class="stat-icon" [ngClass]="iconColor">
        <span>{{ icon }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stat-title {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--slate-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-value {
      display: block;
      font-size: 1.625rem;
      font-weight: 700;
      color: var(--slate-900);
      margin: 0.25rem 0;
    }
    .stat-subtitle {
      font-size: 0.75rem;
      color: var(--slate-600);
      &.trend-up { color: var(--success); }
      &.trend-down { color: var(--danger); }
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      background: var(--primary-light);
    }
  `]
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() iconColor: string = '';
  @Input() trendClass: string = '';
}
