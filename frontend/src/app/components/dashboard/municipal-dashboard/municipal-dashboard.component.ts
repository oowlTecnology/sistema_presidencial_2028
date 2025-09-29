import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-municipal-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="toolbar">
        <span>Dashboard Municipal - Gana tu Colegio 2028</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Bienvenido, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</h1>
          <p>Coordinador Municipal</p>
        </div>

        <div class="dashboard-grid">
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
                  <mat-icon>school</mat-icon>
                  Gestionar Colegios
                </button>
                <button mat-raised-button color="warn">
                  <mat-icon>assessment</mat-icon>
                  Ver Reportes
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
      background: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
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
      background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
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
      color: #2196F3;
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
export class MunicipalDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalColegios = 0;
  totalRecintos = 0;
  totalPersonas = 0;
  recentActivities = [
    {
      icon: 'school',
      title: 'Nuevo coordinador de colegio registrado',
      time: 'Hace 1 hora'
    },
    {
      icon: 'location_on',
      title: 'Recinto "Centro" agregado al sistema',
      time: 'Hace 3 horas'
    },
    {
      icon: 'people',
      title: '25 personas registradas en el colegio "San Juan"',
      time: 'Hace 5 horas'
    },
    {
      icon: 'assessment',
      title: 'Reporte municipal generado',
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
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Filtrar usuarios del mismo municipio
        const municipalUsers = users.filter(u => u.municipioId === this.currentUser?.municipioId);
        this.totalColegios = municipalUsers.filter(u => u.role === UserRole.COLEGIO).length;
        this.totalRecintos = municipalUsers.filter(u => u.role === UserRole.RECINTO).length;
        this.totalPersonas = municipalUsers.length;
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






