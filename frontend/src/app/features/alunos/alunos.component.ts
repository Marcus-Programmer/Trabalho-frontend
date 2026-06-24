import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { Aluno, Curso } from '../../core/models/models';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Alunos</h1>
      <p class="page-subtitle">{{ filtered.length }} alunos cadastrados</p>
    </div>

    <div class="card mb-lg">
      <div class="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input [(ngModel)]="search" (ngModelChange)="applyFilter()"
          placeholder="Buscar por nome ou matrícula..." id="aluno-search">
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
        <div class="empty-state-icon">👤</div>
        <h3>Nenhum aluno encontrado</h3>
      </div></div>
    } @else {
      <div class="cards-grid">
        @for (aluno of filtered; track aluno.id) {
          <div class="card person-card">
            <div class="person-avatar">{{ initials(aluno.nome) }}</div>
            <div class="person-info">
              <div class="person-name">{{ aluno.nome }}</div>
              <div class="person-sub">Matrícula: {{ aluno.matricula }}</div>
              <div class="person-sub">{{ getCursoNome(aluno.curso) }}</div>
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
      width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; color: #fff; flex-shrink: 0;
    }
    .person-name { font-weight: 600; font-size: var(--text-base); color: var(--text-primary); }
    .person-sub { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px; }
  `]
})
export class AlunosComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);
  alunos: Aluno[] = [];
  filtered: Aluno[] = [];
  cursos: Curso[] = [];
  cursoMap: Record<number, string> = {};
  search = '';
  loading = true;

  ngOnInit() {
    this.api.getCursos().subscribe(c => { this.cursos = c; c.forEach(x => this.cursoMap[x.id] = x.nome); });
    this.api.getAlunos().subscribe({
      next: a => { this.alunos = a; this.filtered = a; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Erro ao carregar alunos'); }
    });
  }

  applyFilter() {
    const t = this.search.toLowerCase();
    this.filtered = t ? this.alunos.filter(a => a.nome.toLowerCase().includes(t) || a.matricula.toLowerCase().includes(t)) : [...this.alunos];
  }

  getCursoNome(id: number) { return this.cursoMap[id] || 'Curso desconhecido'; }
  initials(nome: string) { return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase(); }
}
