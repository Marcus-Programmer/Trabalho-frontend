import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'tccs',
    loadComponent: () => import('./features/tccs/tcc-list/tcc-list.component').then(m => m.TccListComponent)
  },
  {
    path: 'tccs/novo',
    loadComponent: () => import('./features/tccs/tcc-form/tcc-form.component').then(m => m.TccFormComponent)
  },
  {
    path: 'tccs/:id',
    loadComponent: () => import('./features/tccs/tcc-detail/tcc-detail.component').then(m => m.TccDetailComponent)
  },
  {
    path: 'tccs/:id/editar',
    loadComponent: () => import('./features/tccs/tcc-form/tcc-form.component').then(m => m.TccFormComponent)
  },
  {
    path: 'alunos',
    loadComponent: () => import('./features/alunos/alunos.component').then(m => m.AlunosComponent)
  },
  {
    path: 'professores',
    loadComponent: () => import('./features/professores/professores.component').then(m => m.ProfessoresComponent)
  },
  {
    path: 'cursos',
    loadComponent: () => import('./features/cursos/cursos.component').then(m => m.CursosComponent)
  },
  {
    path: 'departamentos',
    loadComponent: () => import('./features/departamentos/departamentos.component').then(m => m.DepartamentosComponent)
  },
  {
    path: 'unidades',
    loadComponent: () => import('./features/unidades/unidades.component').then(m => m.UnidadesComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
