import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  visible = signal(false);
  options = signal<ConfirmOptions>({
    title: 'Confirmar',
    message: 'Tem certeza?',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    danger: false
  });

  private resolveFn: ((value: boolean) => void) | null = null;

  open(opts: ConfirmOptions): Promise<boolean> {
    this.options.set({
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      danger: false,
      ...opts
    });
    this.visible.set(true);
    return new Promise(resolve => { this.resolveFn = resolve; });
  }

  confirm() {
    this.visible.set(false);
    this.resolveFn?.(true);
    this.resolveFn = null;
  }

  cancel() {
    this.visible.set(false);
    this.resolveFn?.(false);
    this.resolveFn = null;
  }
}
