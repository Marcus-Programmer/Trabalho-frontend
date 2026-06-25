import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { TCC, STATUS_LABELS, STATUS_BADGE } from '../../../core/models/models';

@Component({
  selector: 'app-tcc-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header flex items-center gap-md">
      <a routerLink="/tccs" class="btn-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </a>
      <div style="flex:1">
        <h1 class="page-title" style="font-size: var(--text-xl)">{{ tcc?.titulo || 'Carregando…' }}</h1>
        <p class="page-subtitle">Detalhes do Trabalho de Conclusão de Curso</p>
      </div>
      @if (tcc) {
        <div class="flex gap-sm">
          <a [routerLink]="['/tccs', tcc.id, 'editar']" class="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Editar
          </a>
          @if (tcc.arquivo) {
            <a [href]="getArquivoUrl(tcc.arquivo)" target="_blank" class="btn btn-secondary" title="Visualizar PDF">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Visualizar
            </a>
            <button (click)="downloadPdf(tcc.arquivo)" class="btn btn-primary" title="Download direto do PDF">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </button>
          }
        </div>
      }
    </div>

    @if (loading) {
      <div class="card skeleton-card" style="height:400px"></div>
    } @else if (tcc) {
      <div style="display:grid; grid-template-columns: 2fr 1fr; gap: var(--space-lg)">
        <!-- Coluna principal -->
        <div>
          <div class="card mb-lg">
            <div class="card-header">
              <span class="card-title">📝 Informações</span>
              <span class="badge" [class]="getBadgeClass(tcc.status)">
                <span class="badge-dot"></span>{{ STATUS_LABELS[tcc.status] }}
              </span>
            </div>
            <div class="detail-field">
              <div class="detail-label">Resumo</div>
              <div class="detail-value">{{ tcc.resumo }}</div>
            </div>
            <div class="detail-field">
              <div class="detail-label">Palavras-chave</div>
              <div class="detail-value keywords">
                @for (kw of getKeywords(tcc.palavras_chave); track kw) {
                  <span class="keyword-tag">{{ kw }}</span>
                }
              </div>
            </div>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-label">Tipo</div>
                <div class="detail-value">{{ tcc.tipo_display || tcc.tipo }}</div>
              </div>
              <div class="detail-field">
                <div class="detail-label">Idioma</div>
                <div class="detail-value">{{ tcc.idioma_display || tcc.idioma }}</div>
              </div>
              <div class="detail-field">
                <div class="detail-label">Semestre de Defesa</div>
                <div class="detail-value">{{ tcc.semestre_letivo_defesa || '—' }}</div>
              </div>
            </div>
          </div>

          <div class="card mb-lg">
            <div class="card-header">
              <span class="card-title">👥 Banca e Orientação</span>
            </div>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-label">Aluno</div>
                <div class="detail-value">{{ alunoNome }}</div>
              </div>
              <div class="detail-field">
                <div class="detail-label">Orientador</div>
                <div class="detail-value">{{ orientadorNome }}</div>
              </div>
              @if (coorientadorNome) {
                <div class="detail-field">
                  <div class="detail-label">Coorientador</div>
                  <div class="detail-value">{{ coorientadorNome }}</div>
                </div>
              }
              <div class="detail-field">
                <div class="detail-label">Presidente</div>
                <div class="detail-value">{{ presidenteNome }}</div>
              </div>
              <div class="detail-field">
                <div class="detail-label">1º Membro</div>
                <div class="detail-value">{{ membro1Nome }}</div>
              </div>
              <div class="detail-field">
                <div class="detail-label">2º Membro</div>
                <div class="detail-value">{{ membro2Nome }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar direita -->
        <div>
          <!-- Status -->
          <div class="card mb-lg">
            <div class="card-header">
              <span class="card-title">🔄 Alterar Status</span>
            </div>
            <div class="status-options">
              @for (s of statusOptions; track s.value) {
                <button class="status-option" [class.active]="tcc.status === s.value"
                  [class]="'status-option status-option-' + s.key" (click)="changeStatus(s.value)">
                  <span>{{ s.label }}</span>
                  @if (tcc.status === s.value) {
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  }
                </button>
              }
            </div>
          </div>

          <!-- Arquivo -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">📎 Arquivo</span>
            </div>
            @if (tcc.arquivo) {
              <div class="flex flex-col gap-sm">
                <a [href]="getArquivoUrl(tcc.arquivo)" target="_blank" class="btn btn-secondary w-full" style="justify-content:center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Visualizar PDF
                </a>
                <button (click)="downloadPdf(tcc.arquivo)" class="btn btn-primary w-full" style="justify-content:center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </button>
              </div>
              <div class="text-sm text-muted mt-md" style="word-break:break-all; font-size:11px">{{ getFileName(tcc.arquivo) }}</div>
            } @else {
              <div class="empty-state" style="padding:20px">
                <div style="font-size:32px;margin-bottom:8px">📭</div>
                <p class="text-muted text-sm">Nenhum arquivo enviado</p>
                <a [routerLink]="['/tccs', tcc.id, 'editar']" class="btn btn-secondary btn-sm mt-md">Enviar PDF</a>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail-field { margin-bottom: var(--space-md); }
    .detail-label {
      font-size: var(--text-xs); font-weight: 600; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;
    }
    .detail-value { font-size: var(--text-sm); color: var(--text-primary); line-height: 1.6; }
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-md); }
    .keywords { display: flex; flex-wrap: wrap; gap: 6px; }
    .keyword-tag {
      background: var(--bg-glass); border: 1px solid var(--border); border-radius: var(--radius-full);
      padding: 2px 10px; font-size: var(--text-xs); color: var(--text-secondary);
    }
    .status-options { display: flex; flex-direction: column; gap: 8px; }
    .status-option {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; border-radius: var(--radius-md); font-size: var(--text-sm);
      font-weight: 500; cursor: pointer; transition: all var(--transition);
      background: var(--bg-glass); border: 1px solid var(--border); color: var(--text-secondary);
    }
    .status-option:hover { background: var(--bg-hover); color: var(--text-primary); }
    .status-option.active { border-color: currentColor; }
    .status-option-elaboracao.active { color: var(--status-elaboracao); background: var(--status-elaboracao-bg); }
    .status-option-enviado.active { color: var(--status-enviado); background: var(--status-enviado-bg); }
    .status-option-aprovado.active { color: var(--status-aprovado); background: var(--status-aprovado-bg); }
    .status-option-reprovado.active { color: var(--status-reprovado); background: var(--status-reprovado-bg); }
    @media(max-width:768px) {
      div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
    }
  `]
})
export class TccDetailComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);
  route = inject(ActivatedRoute);

  STATUS_LABELS = STATUS_LABELS;
  tcc: TCC | null = null;
  loading = true;
  alunoNome = ''; orientadorNome = ''; coorientadorNome = '';
  presidenteNome = ''; membro1Nome = ''; membro2Nome = '';

  statusOptions = [
    { value: '0', label: 'Em Elaboração', key: 'elaboracao' },
    { value: '1', label: 'Enviado', key: 'enviado' },
    { value: '2', label: 'Aprovado', key: 'aprovado' },
    { value: '3', label: 'Reprovado', key: 'reprovado' },
  ];

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.api.getTCC(id).subscribe({
      next: (tcc) => {
        this.tcc = tcc;
        this.loading = false;
        this.loadNames(tcc);
      },
      error: () => { this.loading = false; this.toast.error('Erro ao carregar TCC'); }
    });
  }

  loadNames(tcc: TCC) {
    this.api.getAluno(tcc.aluno).subscribe(a => this.alunoNome = a.nome);
    this.api.getProfessor(tcc.orientador).subscribe(p => this.orientadorNome = p.nome);
    if (tcc.coorientador) this.api.getProfessor(tcc.coorientador).subscribe(p => this.coorientadorNome = p.nome);
    this.api.getProfessor(tcc.presidente).subscribe(p => this.presidenteNome = p.nome);
    this.api.getProfessor(tcc.primeiro_membro).subscribe(p => this.membro1Nome = p.nome);
    this.api.getProfessor(tcc.segundo_membro).subscribe(p => this.membro2Nome = p.nome);
  }

  getBadgeClass(status: string) { return STATUS_BADGE[status] || ''; }
  getKeywords(kw: string) { return kw.split(/[,;]+/).map(k => k.trim()).filter(k => k); }
  getArquivoUrl(arquivo: string) {
    if (arquivo.startsWith('http')) return arquivo;
    return `http://localhost:8000/media/${arquivo}`;
  }

  getFileName(arquivo: string) {
    return arquivo.split('/').pop() || 'tcc.pdf';
  }

  downloadPdf(arquivo: string) {
    const url = this.getArquivoUrl(arquivo);
    const filename = this.getFileName(arquivo);
    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 10000);
      })
      .catch(() => this.toast.error('Erro ao baixar o arquivo'));
  }

  changeStatus(status: string) {
    if (!this.tcc || this.tcc.status === status) return;
    this.api.updateStatus(this.tcc.id, status).subscribe({
      next: (updated) => {
        this.tcc = { ...this.tcc!, status: updated.status };
        this.toast.success(`Status alterado para: ${STATUS_LABELS[status]}`);
      },
      error: () => this.toast.error('Erro ao alterar status')
    });
  }
}
