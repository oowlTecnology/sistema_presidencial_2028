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
  selector: 'app-colegio-dashboard',
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
        <span>Dashboard de Colegio - Gana tu Colegio 2028</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Bienvenido, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</h1>
          <p>Coordinador de Colegio</p>
        </div>

        <div class="dashboard-grid">
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

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalContactados }}</div>
              <div class="stat-label">Personas Contactadas</div>
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
                  Gestionar Coordinadores
                </button>
                <button mat-raised-button color="accent">
                  <mat-icon>location_on</mat-icon>
                  Gestionar Recintos
                </button>
                <button mat-raised-button color="warn">
                  <mat-icon>person_add</mat-icon>
                  Registrar Personas
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
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
      background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
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
      color: #4CAF50;
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
export class ColegioDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalRecintos = 0;
  totalPersonas = 0;
  totalContactados = 0;
  recentActivities = [
    {
      icon: 'location_on',
      title: 'Nuevo coordinador de recinto registrado',
      time: 'Hace 30 minutos'
    },
    {
      icon: 'person_add',
      title: '10 personas registradas en el recinto #2',
      time: 'Hace 2 horas'
    },
    {
      icon: 'check_circle',
      title: '5 personas convencidas para apoyar',
      time: 'Hace 4 horas'
    },
    {
      icon: 'assessment',
      title: 'Reporte diario generado',
      time: 'Hace 6 horas'
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
        // Filtrar usuarios del mismo colegio
        const colegioUsers = users.filter(u => u.colegioId === this.currentUser?.colegioId);
        this.totalRecintos = colegioUsers.filter(u => u.role === UserRole.RECINTO).length;
        this.totalPersonas = colegioUsers.length;
        this.totalContactados = Math.floor(Math.random() * 50) + 20; // Simulado
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






