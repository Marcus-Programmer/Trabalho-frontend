import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <div class="page-container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
    <app-toast></app-toast>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AppComponent {
  constructor() {
    inject(ThemeService).init();
  }
}

