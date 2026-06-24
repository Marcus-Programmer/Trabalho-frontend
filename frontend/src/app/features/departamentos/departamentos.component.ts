import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Departamento, UnidadeAcademica } from '../../core/models/models';

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Departamentos</h1>
      <p class="page-subtitle">{{ departamentos.length }} departamentos cadastrados</p>
    </div>

    @if (loading) {
      <div class="cards-grid">
        @for (i of [1,2,3,4,5,6]; track i) {
          <div class="card skeleton-card" style="height:100px"></div>
        }
      </div>
    } @else {
      <div class="cards-grid">
        @for (dept of departamentos; track dept.id) {
          <div class="card info-card">
            <div class="info-badge" style="background: linear-gradient(135deg, #a371f7, #7a4fd6)">{{ dept.sigla }}</div>
            <div class="info-name">{{ dept.nome }}</div>
            <div class="info-sub">{{ getUnidadeNome(dept.unidade_academica) }}</div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-md); }
    .info-card { position: relative; overflow: hidden; }
    .info-badge {
      display: inline-block; color: #fff; font-weight: 700; font-size: 13px; padding: 3px 10px;
      border-radius: var(--radius-full); margin-bottom: 10px;
    }
    .info-name { font-weight: 600; font-size: var(--text-base); color: var(--text-primary); }
    .info-sub { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px; }
  `]
})
export class DepartamentosComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);
  departamentos: Departamento[] = [];
  unidadeMap: Record<number, string> = {};
  loading = true;

  ngOnInit() {
    this.api.getUnidades().subscribe(u => u.forEach(x => this.unidadeMap[x.id] = x.sigla));
    this.api.getDepartamentos().subscribe({
      next: d => { this.departamentos = d; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Erro ao carregar departamentos'); }
    });
  }

  getUnidadeNome(id: number) { return this.unidadeMap[id] || ''; }
}
