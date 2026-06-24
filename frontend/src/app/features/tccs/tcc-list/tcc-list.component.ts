import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { TCC, STATUS_LABELS, STATUS_BADGE } from '../../../core/models/models';

@Component({
  selector: 'app-tcc-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">Trabalhos de Conclusão</h1>
        <p class="page-subtitle">{{ filteredTccs.length }} TCCs encontrados</p>
      </div>
      <a routerLink="/tccs/novo" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Novo TCC
      </a>
    </div>

    <!-- Filtros -->
    <div class="card mb-lg">
      <div class="flex gap-md" style="flex-wrap:wrap; align-items:center">
        <div class="search-bar" style="flex:1; min-width:200px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()"
            placeholder="Buscar por título ou resumo..." id="tcc-search">
        </div>
        <select class="form-control" style="width:180px" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()" id="tcc-status-filter">
          <option value="">Todos os status</option>
          <option value="0">Em Elaboração</option>
          <option value="1">Enviado</option>
          <option value="2">Aprovado</option>
          <option value="3">Reprovado</option>
        </select>
      </div>
    </div>

    <!-- Tabela -->
    @if (loading) {
      <div class="card">
        @for (i of [1,2,3,4,5]; track i) {
          <div style="display:flex; gap:16px; padding:12px 0; border-bottom:1px solid var(--border)">
            <div class="skeleton skeleton-text" style="flex:1"></div>
            <div class="skeleton skeleton-text" style="width:80px"></div>
            <div class="skeleton skeleton-text" style="width:100px"></div>
          </div>
        }
      </div>
    } @else if (filteredTccs.length === 0) {
      <div class="card">
        <div class="empty-state">
          <div class="empty-state-icon">📄</div>
          <h3>Nenhum TCC encontrado</h3>
          <p>Tente ajustar os filtros ou <a routerLink="/tccs/novo">cadastre um novo TCC</a></p>
        </div>
      </div>
    } @else {
      <div class="card" style="padding:0">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Aluno</th>
                <th>Orientador</th>
                <th>Tipo</th>
                <th>Semestre</th>
                <th>Status</th>
                <th>Arquivo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (tcc of paginatedTccs; track tcc.id) {
                <tr>
                  <td>
                    <a [routerLink]="['/tccs', tcc.id]" style="font-weight:500; color:var(--text-primary)">
                      {{ tcc.titulo | slice:0:50 }}{{ tcc.titulo.length > 50 ? '…' : '' }}
                    </a>
                  </td>
                  <td class="text-muted text-sm">{{ getAlunoNome(tcc.aluno) }}</td>
                  <td class="text-muted text-sm">{{ getProfNome(tcc.orientador) }}</td>
                  <td class="text-sm">{{ tcc.tipo_display || tcc.tipo }}</td>
                  <td class="text-sm text-muted">{{ tcc.semestre_letivo_defesa || '—' }}</td>
                  <td>
                    <span class="badge" [class]="getBadgeClass(tcc.status)">
                      <span class="badge-dot"></span>
                      {{ STATUS_LABELS[tcc.status] }}
                    </span>
                  </td>
                  <td>
                    @if (tcc.arquivo) {
                      <a [href]="getArquivoUrl(tcc.arquivo)" target="_blank" class="btn btn-sm btn-secondary" title="Baixar PDF">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        PDF
                      </a>
                    } @else {
                      <span class="text-muted text-sm">—</span>
                    }
                  </td>
                  <td>
                    <div class="flex gap-sm">
                      <a [routerLink]="['/tccs', tcc.id]" class="btn-icon" title="Ver detalhes">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <a [routerLink]="['/tccs', tcc.id, 'editar']" class="btn-icon" title="Editar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </a>
                      <button class="btn-icon" (click)="deleteTcc(tcc)" title="Excluir" style="color:var(--status-reprovado)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Paginação -->
        @if (totalPages > 1) {
          <div class="pagination">
            <button class="pagination-btn" (click)="setPage(currentPage - 1)" [disabled]="currentPage === 1">‹</button>
            @for (p of pages; track p) {
              <button class="pagination-btn" [class.active]="p === currentPage" (click)="setPage(p)">{{ p }}</button>
            }
            <button class="pagination-btn" (click)="setPage(currentPage + 1)" [disabled]="currentPage === totalPages">›</button>
          </div>
        }
      </div>
    }
  `
})
export class TccListComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);

  STATUS_LABELS = STATUS_LABELS;

  tccs: TCC[] = [];
  filteredTccs: TCC[] = [];
  loading = true;
  searchTerm = '';
  statusFilter = '';

  alunoMap: Record<number, string> = {};
  profMap: Record<number, string> = {};

  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.api.getTCCs().subscribe({
      next: (tccs) => {
        this.tccs = tccs;
        this.applyFilters();
        this.loading = false;
        this.loadNames(tccs);
      },
      error: () => { this.loading = false; this.toast.error('Erro ao carregar TCCs'); }
    });
  }

  loadNames(tccs: TCC[]) {
    this.api.getAlunos().subscribe(alunos => {
      alunos.forEach(a => this.alunoMap[a.id] = a.nome);
    });
    this.api.getProfessores().subscribe(profs => {
      profs.forEach(p => this.profMap[p.id] = p.nome);
    });
  }

  applyFilters() {
    let result = [...this.tccs];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.titulo.toLowerCase().includes(term) || t.resumo.toLowerCase().includes(term)
      );
    }
    if (this.statusFilter !== '') {
      result = result.filter(t => t.status === this.statusFilter);
    }
    this.filteredTccs = result;
    this.currentPage = 1;
  }

  get paginatedTccs() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTccs.slice(start, start + this.pageSize);
  }

  get totalPages() { return Math.ceil(this.filteredTccs.length / this.pageSize); }
  get pages() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  setPage(p: number) { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  getBadgeClass(status: string) { return STATUS_BADGE[status] || 'badge-enviado'; }
  getAlunoNome(id: number) { return this.alunoMap[id] || `#${id}`; }
  getProfNome(id: number) { return this.profMap[id] || `#${id}`; }
  getArquivoUrl(arquivo: string) {
    if (arquivo.startsWith('http')) return arquivo;
    return `http://localhost:8000${arquivo.startsWith('/') ? '' : '/media/'}${arquivo}`;
  }

  deleteTcc(tcc: TCC) {
    if (!confirm(`Excluir "${tcc.titulo}"? Esta ação não pode ser desfeita.`)) return;
    this.api.deleteTCC(tcc.id).subscribe({
      next: () => { this.toast.success('TCC excluído com sucesso'); this.loadAll(); },
      error: () => this.toast.error('Erro ao excluir TCC')
    });
  }
}
