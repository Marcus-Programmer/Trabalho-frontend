import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Curso } from '../../core/models/models';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Cursos</h1>
      <p class="page-subtitle">{{ cursos.length }} cursos cadastrados</p>
    </div>

    @if (loading) {
      <div class="cards-grid">
        @for (i of [1,2,3,4]; track i) {
          <div class="card skeleton-card" style="height:100px"></div>
        }
      </div>
    } @else {
      <div class="cards-grid">
        @for (curso of cursos; track curso.id) {
          <div class="card info-card">
            <div class="info-badge">{{ curso.sigla }}</div>
            <div class="info-name">{{ curso.nome }}</div>
            <div class="info-sub">Código: {{ curso.codigo }}</div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-md); }
    .info-card { position: relative; overflow: hidden; }
    .info-badge {
      display: inline-block; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: #fff; font-weight: 700; font-size: 13px; padding: 3px 10px;
      border-radius: var(--radius-full); margin-bottom: 10px;
    }
    .info-name { font-weight: 600; font-size: var(--text-base); color: var(--text-primary); }
    .info-sub { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px; }
  `]
})
export class CursosComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);
  cursos: Curso[] = [];
  loading = true;

  ngOnInit() {
    this.api.getCursos().subscribe({
      next: c => { this.cursos = c; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Erro ao carregar cursos'); }
    });
  }
}
