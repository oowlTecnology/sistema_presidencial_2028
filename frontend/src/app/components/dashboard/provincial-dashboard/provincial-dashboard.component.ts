import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AuthService } from '../../../services/auth.service';
import { UserService, EstadisticasProvincial } from '../../../services/user.service';
import { User } from '../../../models/user.model';

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
    MatExpansionModule,
    MatProgressSpinnerModule,
    NgChartsModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="toolbar">
        <span>Dashboard Provincial - Gana tu Colegio 2028</span>
        <span class="spacer"></span>
        <button mat-raised-button color="warn" routerLink="/admin" class="admin-button" *ngIf="currentUser?.role === 'super_admin'">
          <mat-icon>admin_panel_settings</mat-icon>
          Panel Admin
        </button>
        <button mat-raised-button color="accent" routerLink="/users" class="users-button">
          <mat-icon>people</mat-icon>
          Gestión de Usuarios
        </button>
        <button mat-raised-button color="primary" routerLink="/funcionarios" *ngIf="currentUser?.role === 'super_admin' || currentUser?.role === 'funcionarios' || currentUser?.role === 'provincial'">
          <mat-icon>people_alt</mat-icon>
          Funcionarios PRM
        </button>
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

        <!-- Cards de Estadísticas -->
        <div class="stats-grid" *ngIf="!cargando; else loadingTemplate">
          <mat-card class="stat-card municipal-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>account_balance</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ estadisticas?.totalMunicipales || 0 }}</div>
                <div class="stat-label">Coordinadores Municipales</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card colegio-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>school</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ estadisticas?.totalColegios || 0 }}</div>
                <div class="stat-label">Coordinadores de Colegio</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card recinto-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>location_city</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ estadisticas?.totalRecintos || 0 }}</div>
                <div class="stat-label">Coordinadores de Recinto</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Gráficos -->
        <div class="charts-grid" *ngIf="!cargando">
          <!-- Gráfico de Pie: Distribución de Coordinadores -->
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>pie_chart</mat-icon>
                Distribución de Coordinadores
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas baseChart
                [data]="pieChartData"
                [type]="pieChartType"
                [options]="pieChartOptions">
              </canvas>
            </mat-card-content>
          </mat-card>

          <!-- Gráfico de Línea: Progreso de Fidelización -->
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>show_chart</mat-icon>
                Progreso de Fidelización por Coordinador
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas baseChart
                [data]="lineChartData"
                [type]="lineChartType"
                [options]="lineChartOptions">
              </canvas>
            </mat-card-content>
          </mat-card>

          <!-- Gráfico de Barras: Top 10 Coordinadores -->
          <mat-card class="chart-card full-width">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>bar_chart</mat-icon>
                Top 10 Coordinadores por Fidelización
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas baseChart
                [data]="barChartData"
                [type]="barChartType"
                [options]="barChartOptions">
              </canvas>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Metas de Coordinadores Municipales -->
        <mat-card class="metas-card" *ngIf="!cargando">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>emoji_events</mat-icon>
              Metas de Coordinadores Municipales
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-accordion>
              <mat-expansion-panel *ngFor="let meta of estadisticas?.metasMunicipales">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <div class="coordinator-info">
                      <strong>{{ meta.coordinador }}</strong>
                      <span class="municipio-label">{{ meta.municipio }}</span>
                    </div>
                  </mat-panel-title>
                  <mat-panel-description>
                    <span class="meta-badge" [ngClass]="getMetaClassColor(meta.porcentaje)">
                      {{ meta.fidelizados }} / {{ meta.meta }} ({{ meta.porcentaje }}%)
                    </span>
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <div class="meta-details">
                  <div class="municipio-stats">
                    <mat-icon>location_on</mat-icon>
                    <span><strong>Municipio:</strong> {{ meta.municipio }}</span>
                  </div>
                  <div class="municipio-stats">
                    <mat-icon>people</mat-icon>
                    <span><strong>Total personas en el municipio:</strong> {{ meta.totalPersonasMunicipio | number }}</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" [style.width.%]="meta.porcentaje"></div>
                  </div>
                  <p class="meta-text">
                    <mat-icon>check_circle</mat-icon>
                    {{ meta.fidelizados }} personas fidelizadas de {{ meta.meta }}
                  </p>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-card-content>
        </mat-card>

        <!-- Metas de Coordinadores de Colegio -->
        <mat-card class="metas-card" *ngIf="!cargando">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>emoji_events</mat-icon>
              Metas de Coordinadores de Colegio
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-accordion>
              <mat-expansion-panel *ngFor="let meta of estadisticas?.metasColegios">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <strong>{{ meta.coordinador }}</strong>
                  </mat-panel-title>
                  <mat-panel-description>
                    <span class="meta-badge" [ngClass]="getMetaClassColor(meta.porcentaje)">
                      {{ meta.fidelizados }} / {{ meta.meta }} ({{ meta.porcentaje }}%)
                    </span>
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <div class="meta-details">
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" [style.width.%]="meta.porcentaje"></div>
                  </div>
                  <p class="meta-text">
                    <mat-icon>check_circle</mat-icon>
                    {{ meta.fidelizados }} personas fidelizadas de {{ meta.meta }}
                  </p>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-card-content>
        </mat-card>

        <!-- Metas de Coordinadores de Recinto -->
        <mat-card class="metas-card" *ngIf="!cargando">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>emoji_events</mat-icon>
              Metas de Coordinadores de Recinto
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-accordion>
              <mat-expansion-panel *ngFor="let meta of estadisticas?.metasRecintos">
                <mat-expansion-panel-header>
                  <mat-panel-title>
                    <strong>{{ meta.coordinador }}</strong>
                  </mat-panel-title>
                  <mat-panel-description>
                    <span class="meta-badge" [ngClass]="getMetaClassColor(meta.porcentaje)">
                      {{ meta.fidelizados }} / {{ meta.meta }} ({{ meta.porcentaje }}%)
                    </span>
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <div class="meta-details">
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" [style.width.%]="meta.porcentaje"></div>
                  </div>
                  <p class="meta-text">
                    <mat-icon>check_circle</mat-icon>
                    {{ meta.fidelizados }} personas fidelizadas de {{ meta.meta }}
                  </p>
                </div>
              </mat-expansion-panel>
            </mat-accordion>
          </mat-card-content>
        </mat-card>

        <ng-template #loadingTemplate>
          <div class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Cargando estadísticas...</p>
          </div>
        </ng-template>
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

    .admin-button {
      margin-right: 16px;
    }

    .admin-button mat-icon {
      margin-right: 8px;
    }

    .users-button {
      margin-right: 16px;
    }

    .users-button mat-icon {
      margin-right: 8px;
    }

    .dashboard-content {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 20px;
    }

    .welcome-section h1 {
      margin: 0;
      color: #333;
      font-size: 2rem;
    }

    .welcome-section p {
      color: #666;
      margin: 5px 0;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.12);
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 28px !important;
    }

    .stat-icon {
      width: 70px;
      height: 70px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .stat-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #9e9e9e;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .municipal-card .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .municipal-card .stat-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .colegio-card .stat-icon {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    }

    .colegio-card .stat-number {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .recinto-card .stat-icon {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    }

    .recinto-card .stat-number {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .metas-card {
      margin-bottom: 24px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .metas-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #FFD700;
      font-weight: 600;
    }

    .metas-card mat-card-title mat-icon {
      color: #FFD700;
    }

    .meta-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .meta-badge.low {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .meta-badge.medium {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .meta-badge.high {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .coordinator-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .municipio-label {
      font-size: 0.85rem;
      color: #666;
      font-weight: 400;
    }

    .meta-details {
      padding: 16px 0;
    }

    .municipio-stats {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: #555;
    }

    .municipio-stats mat-icon {
      color: #2196F3;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .municipio-stats span {
      font-size: 0.95rem;
    }

    .progress-bar-container {
      width: 100%;
      height: 8px;
      background-color: #f5f5f5;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
      transition: width 0.6s ease;
      border-radius: 10px;
    }

    .meta-text {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      margin: 0;
    }

    .meta-text mat-icon {
      color: #FFD700;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }

    .chart-card {
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .chart-card.full-width {
      grid-column: 1 / -1;
    }

    .chart-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #333;
    }

    .chart-card mat-card-title mat-icon {
      color: #667eea;
    }

    .chart-card canvas {
      max-height: 300px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 10px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .chart-card.full-width {
        grid-column: 1;
      }
    }
  `]
})
export class ProvincialDashboardComponent implements OnInit {
  currentUser: User | null = null
  estadisticas: EstadisticasProvincial | null = null
  cargando: boolean = false

  // Gráfico de Pie
  pieChartType: ChartType = 'pie'
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#667eea', '#2196F3', '#FFD700']
    }]
  }
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }

  // Gráfico de Línea
  lineChartType: ChartType = 'line'
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Fidelizados',
      data: [],
      borderColor: '#FFD700',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Meta',
      data: [],
      borderColor: '#f44336',
      borderDash: [5, 5],
      tension: 0
    }]
  }
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  }

  // Gráfico de Barras
  barChartType: ChartType = 'bar'
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Personas Fidelizadas',
      data: [],
      backgroundColor: '#667eea'
    }]
  }
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser()
    this.cargarEstadisticas()
  }

  cargarEstadisticas() {
    this.cargando = true
    this.userService.getEstadisticasProvincial().subscribe({
      next: (stats) => {
        this.estadisticas = stats
        this.generarGraficos(stats)
        this.cargando = false
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error)
        this.cargando = false
      }
    })
  }

  generarGraficos(stats: EstadisticasProvincial) {
    // Gráfico de Pie: Distribución de Coordinadores
    this.pieChartData = {
      labels: ['Municipales', 'Colegios', 'Recintos'],
      datasets: [{
        data: [stats.totalMunicipales, stats.totalColegios, stats.totalRecintos],
        backgroundColor: ['#667eea', '#2196F3', '#FFD700']
      }]
    }

    // Combinar todos los coordinadores para los gráficos
    const todosCoordinadores = [
      ...stats.metasMunicipales,
      ...stats.metasColegios,
      ...stats.metasRecintos
    ]

    // Ordenar por fidelizados y tomar top 10
    const top10 = todosCoordinadores
      .sort((a, b) => b.fidelizados - a.fidelizados)
      .slice(0, 10)

    // Gráfico de Línea: Progreso vs Meta (top 10)
    this.lineChartData = {
      labels: top10.map(c => c.coordinador.split(' ')[0]), // Solo primer nombre
      datasets: [{
        label: 'Fidelizados',
        data: top10.map(c => c.fidelizados),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        tension: 0.4,
        fill: true
      }, {
        label: 'Meta (15)',
        data: top10.map(c => c.meta),
        borderColor: '#f44336',
        borderDash: [5, 5],
        tension: 0
      }]
    }

    // Gráfico de Barras: Top 10 Coordinadores
    this.barChartData = {
      labels: top10.map(c => c.coordinador),
      datasets: [{
        label: 'Personas Fidelizadas',
        data: top10.map(c => c.fidelizados),
        backgroundColor: top10.map(c => 
          c.porcentaje >= 80 ? '#FFD700' : 
          c.porcentaje >= 50 ? '#FFA500' : '#f44336'
        )
      }]
    }
  }

  getMetaClassColor(porcentaje: number): string {
    if (porcentaje >= 80) return 'high'
    if (porcentaje >= 50) return 'medium'
    return 'low'
  }

  logout() {
    this.authService.logout()
  }
}



