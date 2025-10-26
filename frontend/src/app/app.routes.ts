import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: 'ejecutivo',
        loadComponent: () => import('./components/dashboard/executive-dashboard/executive-dashboard.component').then(m => m.ExecutiveDashboardComponent),
        canActivate: [roleGuard(['ejecutivo', 'super_admin'])]
      },
      {
        path: 'provincial',
        loadComponent: () => import('./components/dashboard/provincial-dashboard/provincial-dashboard.component').then(m => m.ProvincialDashboardComponent),
        canActivate: [roleGuard(['provincial'])]
      },
      {
        path: 'municipal',
        loadComponent: () => import('./components/dashboard/municipal-dashboard/municipal-dashboard.component').then(m => m.MunicipalDashboardComponent),
        canActivate: [roleGuard(['municipal'])]
      },
      {
        path: 'circunscripcion',
        loadComponent: () => import('./components/dashboard/circunscripcion-dashboard/circunscripcion-dashboard.component').then(m => m.CircunscripcionDashboardComponent),
        canActivate: [roleGuard(['circunscripcion'])]
      },
      {
        path: 'colegio',
        loadComponent: () => import('./components/dashboard/colegio-dashboard/colegio-dashboard.component').then(m => m.ColegioDashboardComponent),
        canActivate: [roleGuard(['colegio'])]
      },
      {
        path: 'recinto',
        loadComponent: () => import('./components/dashboard/recinto-dashboard/recinto-dashboard.component').then(m => m.RecintoDashboardComponent),
        canActivate: [roleGuard(['recinto'])]
      },
      {
        path: 'funcionarios',
        loadComponent: () => import('./components/funcionarios/funcionarios.component').then(m => m.FuncionariosComponent),
        canActivate: [roleGuard(['super_admin', 'funcionarios'])]
      }
    ]
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },
  {
    path: 'funcionarios',
    canActivate: [authGuard, roleGuard(['super_admin', 'funcionarios', 'provincial', 'municipal'])],
    loadComponent: () => import('./components/funcionarios/funcionarios.component').then(m => m.FuncionariosComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
