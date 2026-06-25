import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-logo">
        <div class="logo-icon">🎓</div>
        <span class="logo-text" *ngIf="!collapsed">TCC Manager</span>
        <button class="collapse-btn" (click)="toggle()" [title]="collapsed ? 'Expandir' : 'Recolher'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline *ngIf="collapsed" points="9 18 15 12 9 6"></polyline>
            <polyline *ngIf="!collapsed" points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" title="Dashboard">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
          </svg>
          <span class="nav-label" *ngIf="!collapsed">Dashboard</span>
        </a>

        <div class="nav-section-label" *ngIf="!collapsed">ACADÊMICO</div>

        <a routerLink="/tccs" routerLinkActive="active" class="nav-item" title="TCCs">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span class="nav-label" *ngIf="!collapsed">TCCs</span>
        </a>

        <a routerLink="/alunos" routerLinkActive="active" class="nav-item" title="Alunos">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="nav-label" *ngIf="!collapsed">Alunos</span>
        </a>

        <a routerLink="/professores" routerLinkActive="active" class="nav-item" title="Professores">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M20 21a8 8 0 1 0-16 0"></path>
            <line x1="12" y1="12" x2="12" y2="16"></line>
            <line x1="10" y1="14" x2="14" y2="14"></line>
          </svg>
          <span class="nav-label" *ngIf="!collapsed">Professores</span>
        </a>

        <div class="nav-section-label" *ngIf="!collapsed">ESTRUTURA</div>

        <a routerLink="/cursos" routerLinkActive="active" class="nav-item" title="Cursos">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
          <span class="nav-label" *ngIf="!collapsed">Cursos</span>
        </a>

        <a routerLink="/departamentos" routerLinkActive="active" class="nav-item" title="Departamentos">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="2" y="7" width="6" height="14"></rect>
            <rect x="9" y="3" width="6" height="18"></rect>
            <rect x="16" y="10" width="6" height="11"></rect>
          </svg>
          <span class="nav-label" *ngIf="!collapsed">Departamentos</span>
        </a>

        <a routerLink="/unidades" routerLinkActive="active" class="nav-item" title="Unidades Acadêmicas">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 21h18"></path>
            <path d="M5 21V7l8-4v18"></path>
            <path d="M19 21V11l-6-4"></path>
            <path d="M9 9h1v1H9zM9 13h1v1H9zM9 17h1v1H9z"></path>
          </svg>
          <span class="nav-label" *ngIf="!collapsed">Unidades</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <!-- Botão de tema claro/escuro -->
        <button class="theme-toggle-btn" (click)="themeService.toggle()"
          [title]="themeService.isDark() ? 'Mudar para modo claro' : 'Mudar para modo escuro'">
          <!-- Sol — aparece no modo escuro para mudar para claro -->
          <svg *ngIf="themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="theme-icon">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Lua — aparece no modo claro para mudar para escuro -->
          <svg *ngIf="!themeService.isDark()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="theme-icon">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span class="theme-label" *ngIf="!collapsed">
            {{ themeService.isDark() ? 'Modo Claro' : 'Modo Escuro' }}
          </span>
        </button>

        <!-- Info do projeto -->
        <div class="footer-info" *ngIf="!collapsed">
          <span class="footer-label">UFLA — GAC116</span>
          <span class="footer-sub">Programação Web 2026/2</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: var(--sidebar-width);
      background: var(--bg-surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: 100;
      transition: width var(--transition-slow);
      overflow: hidden;
    }
    .sidebar.collapsed { width: var(--sidebar-collapsed); }

    .sidebar-logo {
      display: flex; align-items: center;
      padding: 0 16px; height: 60px;
      border-bottom: 1px solid var(--border);
      gap: 10px; flex-shrink: 0;
    }
    .logo-icon { font-size: 22px; flex-shrink: 0; width: 32px; text-align: center; }
    .logo-text { font-size: 15px; font-weight: 700; color: var(--text-primary); white-space: nowrap; flex: 1; }

    .collapse-btn {
      background: none; border: none; color: var(--text-secondary);
      cursor: pointer; padding: 4px; border-radius: 6px;
      display: flex; align-items: center;
      transition: all var(--transition); flex-shrink: 0;
    }
    .collapse-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

    .sidebar-nav {
      flex: 1; padding: 12px 8px;
      overflow-y: auto; display: flex;
      flex-direction: column; gap: 2px;
    }

    .nav-section-label {
      font-size: 10px; font-weight: 700; color: var(--text-muted);
      letter-spacing: 0.8px; padding: 12px 8px 4px; text-transform: uppercase;
    }

    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 10px; border-radius: var(--radius-md);
      color: var(--text-secondary); text-decoration: none;
      font-size: 14px; font-weight: 500;
      transition: all var(--transition); white-space: nowrap;
    }
    .nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(79,142,247,0.18), rgba(79,142,247,0.08));
      color: var(--primary); border: 1px solid rgba(79,142,247,0.2);
    }
    .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }
    .nav-label { flex: 1; }

    .sidebar-footer {
      padding: 12px 8px; border-top: 1px solid var(--border);
      display: flex; flex-direction: column; gap: 6px;
    }

    .theme-toggle-btn {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 9px 10px; border-radius: var(--radius-md);
      background: none; border: none; color: var(--text-secondary);
      font-size: 13px; font-weight: 500; cursor: pointer;
      transition: all var(--transition); text-align: left; white-space: nowrap;
    }
    .theme-toggle-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
    .theme-icon { flex-shrink: 0; }
    .theme-label { flex: 1; }

    .footer-info { padding: 2px 10px; }
    .footer-label { display: block; font-size: 11px; font-weight: 600; color: var(--text-secondary); }
    .footer-sub { display: block; font-size: 10px; color: var(--text-muted); margin-top: 2px; }

    .collapsed .sidebar-logo { justify-content: center; padding: 0 12px; }
    .collapsed .nav-item { justify-content: center; }
    .collapsed .theme-toggle-btn { justify-content: center; }
  `]
})
export class SidebarComponent {
  themeService = inject(ThemeService);
  collapsed = false;
  toggle() { this.collapsed = !this.collapsed; }
}
