import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (cs.visible()) {
      <!-- Backdrop -->
      <div class="modal-backdrop" (click)="cs.cancel()"></div>

      <!-- Dialog -->
      <div class="modal-wrapper" role="dialog" aria-modal="true">
        <div class="modal-dialog" [class.danger]="cs.options().danger">

          <!-- Ícone -->
          <div class="modal-icon" [class.danger-icon]="cs.options().danger">
            @if (cs.options().danger) {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            }
          </div>

          <!-- Conteúdo -->
          <div class="modal-body">
            <h3 class="modal-title">{{ cs.options().title }}</h3>
            <p class="modal-message">{{ cs.options().message }}</p>
          </div>

          <!-- Ações -->
          <div class="modal-actions">
            <button class="modal-btn modal-btn-cancel" (click)="cs.cancel()">
              {{ cs.options().cancelText }}
            </button>
            <button class="modal-btn"
              [class.modal-btn-danger]="cs.options().danger"
              [class.modal-btn-confirm]="!cs.options().danger"
              (click)="cs.confirm()">
              {{ cs.options().confirmText }}
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 900;
      animation: fadeIn 150ms ease;
    }

    .modal-wrapper {
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      z-index: 901;
      padding: 16px;
    }

    .modal-dialog {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px 28px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-lg), 0 0 0 1px var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      animation: slideUp 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
      text-align: center;
    }

    .modal-icon {
      width: 56px; height: 56px;
      border-radius: 50%;
      background: rgba(79, 142, 247, 0.12);
      display: flex; align-items: center; justify-content: center;
      color: var(--primary);
      flex-shrink: 0;
    }
    .modal-icon svg { width: 26px; height: 26px; }

    .modal-icon.danger-icon {
      background: rgba(248, 81, 73, 0.12);
      color: var(--status-reprovado);
    }

    .modal-body { display: flex; flex-direction: column; gap: 8px; }

    .modal-title {
      font-size: 18px; font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .modal-message {
      font-size: 14px; color: var(--text-secondary);
      line-height: 1.6;
    }

    .modal-actions {
      display: flex; gap: 10px;
      width: 100%; margin-top: 4px;
    }

    .modal-btn {
      flex: 1; padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px; font-weight: 600;
      cursor: pointer; border: none;
      transition: all 200ms ease;
    }

    .modal-btn-cancel {
      background: var(--bg-glass);
      border: 1px solid var(--border);
      color: var(--text-secondary);
    }
    .modal-btn-cancel:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    .modal-btn-confirm {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 4px 14px var(--primary-glow);
    }
    .modal-btn-confirm:hover {
      background: var(--primary-light);
      transform: translateY(-1px);
    }

    .modal-btn-danger {
      background: var(--status-reprovado);
      color: #fff;
      box-shadow: 0 4px 14px rgba(248, 81, 73, 0.3);
    }
    .modal-btn-danger:hover {
      background: #ff6b63;
      transform: translateY(-1px);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class ConfirmModalComponent {
  cs = inject(ConfirmService);
}
