import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'tcc-theme';

  isDark = signal<boolean>(this.loadTheme());

  private loadTheme(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggle() {
    const next = !this.isDark();
    this.isDark.set(next);
    localStorage.setItem(this.STORAGE_KEY, next ? 'dark' : 'light');
    this.applyTheme(next);
  }

  applyTheme(dark: boolean) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  init() {
    this.applyTheme(this.isDark());
  }
}
