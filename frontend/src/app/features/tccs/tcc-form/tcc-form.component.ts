import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Aluno, Professor, Curso, SEMESTRES } from '../../../core/models/models';

@Component({
  selector: 'app-tcc-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header flex items-center gap-md">
      <a routerLink="/tccs" class="btn-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </a>
      <div>
        <h1 class="page-title">{{ isEdit ? 'Editar TCC' : 'Cadastrar TCC' }}</h1>
        <p class="page-subtitle">{{ isEdit ? 'Atualize as informações do trabalho' : 'Preencha as informações do novo trabalho' }}</p>
      </div>
    </div>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- Informações Gerais -->
      <div class="card mb-lg">
        <div class="card-header">
          <span class="card-title">📝 Informações Gerais</span>
        </div>
        <div class="form-group">
          <label class="form-label" for="titulo">Título *</label>
          <input id="titulo" class="form-control" formControlName="titulo" placeholder="Título completo do trabalho">
          @if (f['titulo'].invalid && f['titulo'].touched) {
            <div class="form-error">Título é obrigatório</div>
          }
        </div>
        <div class="form-group">
          <label class="form-label" for="resumo">Resumo *</label>
          <textarea id="resumo" class="form-control" formControlName="resumo" rows="4" placeholder="Resumo do trabalho..."></textarea>
          @if (f['resumo'].invalid && f['resumo'].touched) {
            <div class="form-error">Resumo é obrigatório</div>
          }
        </div>
        <div class="form-group">
          <label class="form-label" for="palavras_chave">Palavras-chave *</label>
          <input id="palavras_chave" class="form-control" formControlName="palavras_chave" placeholder="Ex: machine learning, redes neurais, Python">
          @if (f['palavras_chave'].invalid && f['palavras_chave'].touched) {
            <div class="form-error">Palavras-chave são obrigatórias</div>
          }
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="tipo">Tipo *</label>
            <select id="tipo" class="form-control" formControlName="tipo">
              <option value="">Selecione o tipo</option>
              <option value="MONOGRAFIA">Monografia</option>
              <option value="RELATORIO_ESTAGIO">Relatório de Estágio</option>
              <option value="RELATORIO_TECNICO">Relatório Técnico</option>
              <option value="ARTIGO">Artigo</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="idioma">Idioma *</label>
            <select id="idioma" class="form-control" formControlName="idioma">
              <option value="">Selecione o idioma</option>
              <option value="PT">Português</option>
              <option value="EN">Inglês</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="semestre">Semestre de Defesa</label>
            <select id="semestre" class="form-control" formControlName="semestre_letivo_defesa">
              <option value="">Selecione o semestre</option>
              @for (s of semestres; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="status">Status</label>
            <select id="status" class="form-control" formControlName="status">
              <option value="0">Em Elaboração</option>
              <option value="1">Enviado</option>
              <option value="2">Aprovado</option>
              <option value="3">Reprovado</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Pessoas -->
      <div class="card mb-lg">
        <div class="card-header">
          <span class="card-title">👥 Envolvidos</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="aluno">Aluno *</label>
            <select id="aluno" class="form-control" formControlName="aluno">
              <option value="">Selecione o aluno</option>
              @for (a of alunos; track a.id) {
                <option [value]="a.id">{{ a.nome }} ({{ a.matricula }})</option>
              }
            </select>
            @if (f['aluno'].invalid && f['aluno'].touched) {
              <div class="form-error">Aluno é obrigatório</div>
            }
          </div>
          <div class="form-group">
            <label class="form-label" for="orientador">Orientador *</label>
            <select id="orientador" class="form-control" formControlName="orientador">
              <option value="">Selecione o orientador</option>
              @for (p of professores; track p.id) {
                <option [value]="p.id">{{ p.nome }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="coorientador">Coorientador (opcional)</label>
            <select id="coorientador" class="form-control" formControlName="coorientador">
              <option value="">Nenhum</option>
              @for (p of professores; track p.id) {
                <option [value]="p.id">{{ p.nome }}</option>
              }
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="presidente">Presidente da Banca *</label>
            <select id="presidente" class="form-control" formControlName="presidente">
              <option value="">Selecione</option>
              @for (p of professores; track p.id) {
                <option [value]="p.id">{{ p.nome }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="membro1">1º Membro da Banca *</label>
            <select id="membro1" class="form-control" formControlName="primeiro_membro">
              <option value="">Selecione</option>
              @for (p of professores; track p.id) {
                <option [value]="p.id">{{ p.nome }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="membro2">2º Membro da Banca *</label>
            <select id="membro2" class="form-control" formControlName="segundo_membro">
              <option value="">Selecione</option>
              @for (p of professores; track p.id) {
                <option [value]="p.id">{{ p.nome }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <!-- Upload PDF -->
      <div class="card mb-lg">
        <div class="card-header">
          <span class="card-title">📎 Arquivo PDF</span>
        </div>
        <div class="file-upload-area" [class.drag-over]="isDragging"
          (click)="fileInput.click()"
          (dragover)="onDragOver($event)" (dragleave)="isDragging=false" (drop)="onDrop($event)">
          <div class="file-upload-icon">📂</div>
          @if (selectedFile) {
            <div class="file-upload-text" style="color:var(--primary)">
              ✓ {{ selectedFile.name }}
              <span style="color:var(--text-muted)"> ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB)</span>
            </div>
          } @else if (existingArquivo) {
            <div class="file-upload-text">
              Arquivo atual: <a [href]="getArquivoUrl(existingArquivo)" target="_blank" style="color:var(--primary)" (click)="$event.stopPropagation()">Ver PDF atual</a>
            </div>
            <div class="file-upload-hint">Clique para substituir</div>
          } @else {
            <div class="file-upload-text">Clique ou arraste um arquivo PDF aqui</div>
            <div class="file-upload-hint">Máximo 50MB — apenas arquivos PDF</div>
          }
        </div>
        <input #fileInput type="file" accept=".pdf" style="display:none" (change)="onFileChange($event)">
        @if (selectedFile) {
          <button type="button" class="btn btn-secondary btn-sm mt-md" (click)="selectedFile = null; fileInput.value = ''">
            Remover arquivo
          </button>
        }
      </div>

      <!-- Ações -->
      <div class="flex gap-md justify-between">
        <a routerLink="/tccs" class="btn btn-secondary">Cancelar</a>
        <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">
          @if (saving) { <span>Salvando…</span> }
          @else { <span>{{ isEdit ? 'Salvar Alterações' : 'Cadastrar TCC' }}</span> }
        </button>
      </div>
    </form>
  `
})
export class TccFormComponent implements OnInit {
  api = inject(ApiService);
  toast = inject(ToastService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);

  form!: FormGroup;
  alunos: Aluno[] = [];
  professores: Professor[] = [];
  semestres = SEMESTRES;
  isEdit = false;
  tccId: number | null = null;
  saving = false;
  selectedFile: File | null = null;
  existingArquivo: string | null = null;
  isDragging = false;

  ngOnInit() {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      resumo: ['', Validators.required],
      palavras_chave: ['', Validators.required],
      tipo: ['MONOGRAFIA', Validators.required],
      idioma: ['PT', Validators.required],
      semestre_letivo_defesa: [''],
      status: ['0'],
      aluno: ['', Validators.required],
      orientador: ['', Validators.required],
      coorientador: [''],
      presidente: ['', Validators.required],
      primeiro_membro: ['', Validators.required],
      segundo_membro: ['', Validators.required],
    });

    this.api.getAlunos().subscribe(a => this.alunos = a);
    this.api.getProfessores().subscribe(p => this.professores = p);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.tccId = +id;
      this.api.getTCC(+id).subscribe(tcc => {
        this.form.patchValue({
          ...tcc,
          aluno: tcc.aluno,
          orientador: tcc.orientador,
          coorientador: tcc.coorientador || '',
          presidente: tcc.presidente,
          primeiro_membro: tcc.primeiro_membro,
          segundo_membro: tcc.segundo_membro,
        });
        this.existingArquivo = tcc.arquivo || null;
      });
    }
  }

  get f() { return this.form.controls; }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.isDragging = true; }
  onDrop(event: DragEvent) {
    event.preventDefault(); this.isDragging = false;
    if (event.dataTransfer?.files[0]) this.selectedFile = event.dataTransfer.files[0];
  }

  getArquivoUrl(arquivo: string) {
    if (arquivo.startsWith('http')) return arquivo;
    return `http://localhost:8000/media/${arquivo}`;
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const formData = new FormData();
    const v = this.form.value;
    Object.entries(v).forEach(([key, val]) => {
      if (val !== null && val !== undefined && val !== '') {
        formData.append(key, String(val));
      }
    });
    if (this.selectedFile) formData.append('arquivo', this.selectedFile);

    const request$ = this.isEdit
      ? this.api.updateTCC(this.tccId!, formData)
      : this.api.createTCC(formData);

    request$.subscribe({
      next: (tcc) => {
        this.toast.success(this.isEdit ? 'TCC atualizado!' : 'TCC cadastrado com sucesso!');
        this.router.navigate(['/tccs', tcc.id]);
      },
      error: (err) => {
        this.saving = false;
        const msg = err.error ? JSON.stringify(err.error) : 'Erro ao salvar TCC';
        this.toast.error(msg.substring(0, 200));
      }
    });
  }
}
