import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { UnidadeAcademica } from '../../core/models/models';

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Unidades Acadêmicas</h1>
      <p class="page-subtitle">{{ unidades.length }} unidades cadastradas</p>
    </div>

    @if (loading) {
      <div class="cards-grid">
        @for (i of [1,2,3]; track i) {
          <div class="card skeleton-card" style="height:120px"></div>
        }
      </div>
    } @else {
      <div class="cards-grid">
        @for (u of unidades; track u.id) {
          <div class="card info-card">
            <div class="unidade-icon">🏛️</div>
            <div class="info-badge" style="background: linear-gradient(135deg, #3fb950, #2d8f3d)">{{ u.sigla }}</div>
            <div class="info-name">{{ u.nome }}</div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-md); }
    .info-card { }
    .unidade-icon { font-size: 28px; margin-bottom: 8px; }
    .info-badge {
      display: inline-block; color: #fff; font-weight: 700; font-size: 13px; padding: 3px 10px;
      border-radius: var(--radius-full); margin-bottom: 10px;
    }
    .info-name { font-weight: 600; font-size: var(--text-base); color: var(--text-primary); }
  `]
})
export class UnidadesComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);
  unidades: UnidadeAcademica[] = [];
  loading = true;

  ngOnInit() {
    this.api.getUnidades().subscribe({
      next: u => { this.unidades = u; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Erro ao carregar unidades'); }
    });
  }
}
