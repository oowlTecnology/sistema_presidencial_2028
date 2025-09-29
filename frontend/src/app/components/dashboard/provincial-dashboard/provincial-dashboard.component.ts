import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-provincial-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="toolbar">
        <span>Dashboard Provincial - Gana tu Colegio 2028</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Bienvenido, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</h1>
          <p>Coordinador Provincial</p>
        </div>

        <div class="dashboard-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalMunicipales }}</div>
              <div class="stat-label">Coordinadores Municipales</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalColegios }}</div>
              <div class="stat-label">Coordinadores de Colegio</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalRecintos }}</div>
              <div class="stat-label">Coordinadores de Recinto</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalPersonas }}</div>
              <div class="stat-label">Personas Registradas</div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="actions-section">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Acciones Disponibles</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="action-buttons">
                <button mat-raised-button color="primary" routerLink="/users">
                  <mat-icon>people</mat-icon>
                  Gestionar Usuarios
                </button>
                <button mat-raised-button color="accent">
                  <mat-icon>assessment</mat-icon>
                  Ver Reportes
                </button>
                <button mat-raised-button color="warn">
                  <mat-icon>settings</mat-icon>
                  Configuración
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="recent-activity">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Actividad Reciente</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                <div class="activity-item" *ngFor="let activity of recentActivities">
                  <mat-icon class="activity-icon">{{ activity.icon }}</mat-icon>
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .dashboard-content {
      padding: 20px;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
    }

    .welcome-section h1 {
      margin: 0 0 10px 0;
      font-size: 2.5rem;
    }

    .welcome-section p {
      margin: 0;
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }

    .stat-label {
      text-align: center;
      font-size: 1rem;
      opacity: 0.9;
    }

    .actions-section {
      margin-bottom: 30px;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .action-buttons button {
      flex: 1;
      min-width: 200px;
    }

    .recent-activity {
      margin-bottom: 30px;
    }

    .activity-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      margin-right: 15px;
      color: #3f51b5;
    }

    .activity-title {
      font-weight: 500;
      margin-bottom: 5px;
    }

    .activity-time {
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 10px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        min-width: auto;
      }

      .welcome-section h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ProvincialDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalMunicipales = 0;
  totalColegios = 0;
  totalRecintos = 0;
  totalPersonas = 0;
  recentActivities = [
    {
      icon: 'person_add',
      title: 'Nuevo coordinador municipal registrado',
      time: 'Hace 2 horas'
    },
    {
      icon: 'school',
      title: 'Colegio "San José" agregado al sistema',
      time: 'Hace 4 horas'
    },
    {
      icon: 'people',
      title: '50 personas registradas en el recinto #1',
      time: 'Hace 6 horas'
    },
    {
      icon: 'assessment',
      title: 'Reporte semanal generado',
      time: 'Ayer'
    }
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Cargar estadísticas del dashboard
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalMunicipales = users.filter(u => u.role === UserRole.MUNICIPAL).length;
        this.totalColegios = users.filter(u => u.role === UserRole.COLEGIO).length;
        this.totalRecintos = users.filter(u => u.role === UserRole.RECINTO).length;
        this.totalPersonas = users.length; // Esto debería ser personas, no usuarios
      },
      error: (error) => {
        console.error('Error al cargar datos del dashboard:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}






