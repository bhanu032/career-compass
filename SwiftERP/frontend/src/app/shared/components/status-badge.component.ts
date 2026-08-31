import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="badgeClass">{{ status }}</span>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  get badgeClass(): string {
    const s = this.status?.toLowerCase() || '';
    if (['approved', 'fulfilled', 'present', 'stockin'].includes(s)) return 'badge badge-success';
    if (['draft', 'pending', 'late', 'stockout'].includes(s)) return 'badge badge-warning';
    if (['rejected', 'cancelled', 'absent'].includes(s)) return 'badge badge-danger';
    return 'badge badge-info';
  }
}
