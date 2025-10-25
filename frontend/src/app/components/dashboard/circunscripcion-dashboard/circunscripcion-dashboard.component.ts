import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-circunscripcion-dashboard',
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
        <span>Dashboard de Circunscripción - Gana tu Colegio 2028</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Bienvenido, {{ currentUser?.firstName }} {{ currentUser?.lastName }}</h1>
          <p>Coordinador de Circunscripción</p>
        </div>

        <div class="dashboard-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalColegios }}</div>
              <div class="stat-label">Colegios</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalRecintos }}</div>
              <div class="stat-label">Recintos</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-number">{{ totalElectores }}</div>
              <div class="stat-label">Electores</div>
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
      background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
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
      background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
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
export class CircunscripcionDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalColegios = 0;
  totalRecintos = 0;
  totalElectores = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Simular datos - en una implementación real, estos vendrían del backend
    this.totalColegios = Math.floor(Math.random() * 10) + 5;
    this.totalRecintos = Math.floor(Math.random() * 20) + 10;
    this.totalElectores = Math.floor(Math.random() * 100) + 50;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}







