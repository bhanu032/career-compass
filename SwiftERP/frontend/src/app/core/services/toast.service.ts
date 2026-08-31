import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  public toasts = this.toastsSignal.asReadonly();

  show(type: 'success' | 'danger' | 'warning' | 'info', title: string, message: string): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, title, message };
    this.toastsSignal.update(list => [...list, toast]);

    setTimeout(() => this.remove(id), 5000);
  }

  success(title: string, message: string = ''): void {
    this.show('success', title, message);
  }

  error(title: string, message: string = ''): void {
    this.show('danger', title, message);
  }

  remove(id: string): void {
    this.toastsSignal.update(list => list.filter(t => t.id !== id));
  }
}
