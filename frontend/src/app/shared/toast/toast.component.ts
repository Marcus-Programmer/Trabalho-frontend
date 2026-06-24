import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" (click)="toastService.remove(toast.id)">
          <span class="toast-icon">
            {{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}
          </span>
          {{ toast.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-icon {
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }
    .toast { cursor: pointer; }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
