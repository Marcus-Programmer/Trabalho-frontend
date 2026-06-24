import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Professor, Departamento } from '../../core/models/models';

@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Professores</h1>
      <p class="page-subtitle">{{ filtered.length }} professores cadastrados</p>
    </div>

    <div class="card mb-lg">
      <div class="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input [(ngModel)]="search" (ngModelChange)="applyFilter()"
          placeholder="Buscar por nome..." id="prof-search">
      </div>
    </div>

    @if (loading) {
      <div class="cards-grid">
        @for (i of [1,2,3,4,5,6]; track i) {
          <div class="card skeleton-card" style="height:120px"></div>
        }
      </div>
    } @else if (filtered.length === 0) {
      <div class="card"><div class="empty-state">
        <div class="empty-state-icon">👨‍🏫</div>
        <h3>Nenhum professor encontrado</h3>
      </div></div>
    } @else {
      <div class="cards-grid">
        @for (prof of filtered; track prof.id) {
          <div class="card person-card">
            <div class="person-avatar" style="background: linear-gradient(135deg, #a371f7, #7a4fd6)">
              {{ initials(prof.nome) }}
            </div>
            <div class="person-info">
              <div class="person-name">{{ prof.nome }}</div>
              <div class="person-sub">{{ getDeptNome(prof.departamento) }}</div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-md); }
    .person-card { display: flex; align-items: center; gap: var(--space-md); }
    .person-avatar {
      width: 48px; height: 48px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; color: #fff; flex-shrink: 0;
    }
    .person-name { font-weight: 600; font-size: var(--text-base); color: var(--text-primary); }
    .person-sub { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px; }
  `]
})
export class ProfessoresComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);
  professores: Professor[] = [];
  filtered: Professor[] = [];
  deptMap: Record<number, string> = {};
  search = '';
  loading = true;

  ngOnInit() {
    this.api.getDepartamentos().subscribe(d => d.forEach(x => this.deptMap[x.id] = x.nome));
    this.api.getProfessores().subscribe({
      next: p => { this.professores = p; this.filtered = p; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Erro ao carregar professores'); }
    });
  }

  applyFilter() {
    const t = this.search.toLowerCase();
    this.filtered = t ? this.professores.filter(p => p.nome.toLowerCase().includes(t)) : [...this.professores];
  }

  getDeptNome(id: number) { return this.deptMap[id] || 'Departamento desconhecido'; }
  initials(nome: string) { return nome.replace(/^(Prof\.|Dr\.|Dra\.)\s*/i, '').split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase(); }
}
