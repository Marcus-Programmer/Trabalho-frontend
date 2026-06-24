import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UnidadeAcademica, Departamento, Curso, Aluno, Professor, TCC, Estatisticas
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ========== Unidades Acadêmicas ==========
  getUnidades(): Observable<UnidadeAcademica[]> {
    return this.http.get<UnidadeAcademica[]>(`${this.baseUrl}/unidades-academicas/`);
  }

  // ========== Departamentos ==========
  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(`${this.baseUrl}/departamentos/`);
  }

  // ========== Cursos ==========
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.baseUrl}/cursos/`);
  }

  // ========== Alunos ==========
  getAlunos(search?: string): Observable<Aluno[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Aluno[]>(`${this.baseUrl}/alunos/`, { params });
  }

  getAluno(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.baseUrl}/alunos/${id}/`);
  }

  // ========== Professores ==========
  getProfessores(search?: string): Observable<Professor[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Professor[]>(`${this.baseUrl}/professores/`, { params });
  }

  getProfessor(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.baseUrl}/professores/${id}/`);
  }

  // ========== TCCs ==========
  getTCCs(search?: string): Observable<TCC[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<TCC[]>(`${this.baseUrl}/tccs/`, { params });
  }

  getTCC(id: number): Observable<TCC> {
    return this.http.get<TCC>(`${this.baseUrl}/tccs/${id}/`);
  }

  createTCC(data: FormData): Observable<TCC> {
    return this.http.post<TCC>(`${this.baseUrl}/tccs/`, data);
  }

  updateTCC(id: number, data: FormData | Partial<TCC>): Observable<TCC> {
    if (data instanceof FormData) {
      return this.http.put<TCC>(`${this.baseUrl}/tccs/${id}/`, data);
    }
    return this.http.patch<TCC>(`${this.baseUrl}/tccs/${id}/`, data);
  }

  updateStatus(id: number, status: string): Observable<TCC> {
    return this.http.patch<TCC>(`${this.baseUrl}/tccs/${id}/`, { status });
  }

  deleteTCC(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tccs/${id}/`);
  }

  // ========== Estatísticas ==========
  getEstatisticas(): Observable<Estatisticas> {
    return this.http.get<Estatisticas>(`${this.baseUrl}/tccs/estatisticas/`);
  }
}
