export interface UnidadeAcademica {
  id: number;
  nome: string;
  sigla: string;
}

export interface Departamento {
  id: number;
  nome: string;
  sigla: string;
  unidade_academica: number;
}

export interface Curso {
  id: number;
  nome: string;
  sigla: string;
  codigo: string;
}

export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  curso: number;
  curso_nome?: string;
}

export interface Professor {
  id: number;
  nome: string;
  departamento: number;
  departamento_nome?: string;
}

export interface TCC {
  id: number;
  titulo: string;
  resumo: string;
  palavras_chave: string;
  tipo: string;
  tipo_display?: string;
  idioma: string;
  idioma_display?: string;
  aluno: number;
  aluno_nome?: string;
  orientador: number;
  orientador_nome?: string;
  coorientador?: number | null;
  coorientador_nome?: string | null;
  presidente: number;
  primeiro_membro: number;
  segundo_membro: number;
  semestre_letivo_defesa?: string;
  status: string;
  status_display?: string;
  arquivo?: string | null;
}

export interface Estatisticas {
  total_geral: number;
  por_status: Record<string, number>;
  por_tipo: Record<string, number>;
  por_idioma: Record<string, number>;
  por_semestre: Record<string, number>;
  por_orientador: Record<string, number>;
  por_coorientador: Record<string, number>;
  por_curso: Record<string, number>;
  por_departamento: Record<string, number>;
  por_unidade_academica: Record<string, number>;
}

export const STATUS_LABELS: Record<string, string> = {
  '0': 'Em Elaboração',
  '1': 'Enviado',
  '2': 'Aprovado',
  '3': 'Reprovado',
};

export const STATUS_BADGE: Record<string, string> = {
  '0': 'badge-elaboracao',
  '1': 'badge-enviado',
  '2': 'badge-aprovado',
  '3': 'badge-reprovado',
};

export const TIPO_LABELS: Record<string, string> = {
  'MONOGRAFIA': 'Monografia',
  'RELATORIO_ESTAGIO': 'Relatório de Estágio',
  'RELATORIO_TECNICO': 'Relatório Técnico',
  'ARTIGO': 'Artigo',
};

export const IDIOMA_LABELS: Record<string, string> = {
  'PT': 'Português',
  'EN': 'Inglês',
};

export const SEMESTRES = [
  '2020/1','2020/2','2021/1','2021/2','2022/1','2022/2',
  '2023/1','2023/2','2024/1','2024/2','2025/1','2025/2','2026/1'
];
