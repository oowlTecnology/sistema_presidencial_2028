import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

interface Elector {
  id: number;
  nombre: string;
  cedula: string;
  estado: 'ratificado' | 'a_confirmar';
  estadoVoto: 'voto' | 'no_voto';
  recomendacionIA: string;
  foto?: string;
}

@Component({
  selector: 'app-recinto-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatChipsModule,
    MatCheckboxModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="toolbar">
        <span class="dashboard-title">{{ currentUser?.firstName }} {{ currentUser?.lastName }} - Recinto {{ recintoId }}</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" class="filter-button">
          <mat-icon>filter_list</mat-icon>
          Aplicar filtro
        </button>
        <button mat-button (click)="logout()" class="logout-button">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <!-- Métricas principales -->
        <div class="metrics-row">
          <div class="metric-card meta">
            <div class="metric-number">{{ meta }}</div>
            <div class="metric-label">Meta</div>
          </div>
          <div class="metric-card captados">
            <div class="metric-number">{{ captados }}</div>
            <div class="metric-label">Captados</div>
          </div>
          <div class="metric-card cumplimiento">
            <div class="metric-number">{{ cumplimiento }}%</div>
            <div class="metric-label">Cumpl.</div>
          </div>
          <div class="metric-card faltan">
            <div class="metric-number">{{ faltan }}</div>
            <div class="metric-label">Faltan</div>
          </div>
        </div>

        <!-- Tabla de electores -->
        <mat-card class="electores-table-card">
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="electores" class="electores-table">
                <!-- Foto Column -->
                <ng-container matColumnDef="foto">
                  <th mat-header-cell *matHeaderCellDef>Foto</th>
                  <td mat-cell *matCellDef="let elector">
                    <div class="foto-placeholder">
                      <mat-icon>person</mat-icon>
                    </div>
                  </td>
                </ng-container>

                <!-- Nombre Column -->
                <ng-container matColumnDef="nombre">
                  <th mat-header-cell *matHeaderCellDef>Nombre</th>
                  <td mat-cell *matCellDef="let elector">
                    <div class="nombre-cell">
                      <div class="nombre">{{ elector.nombre }}</div>
                    </div>
                  </td>
                </ng-container>

                <!-- Cédula Column -->
                <ng-container matColumnDef="cedula">
                  <th mat-header-cell *matHeaderCellDef>Cédula</th>
                  <td mat-cell *matCellDef="let elector">{{ elector.cedula }}</td>
                </ng-container>

                <!-- Estado Column -->
                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let elector">
                    <span class="estado-badge" [ngClass]="'estado-' + elector.estado">
                      {{ getEstadoDisplay(elector.estado) }}
                    </span>
                  </td>
                </ng-container>

                <!-- Voto Column -->
                <ng-container matColumnDef="voto">
                  <th mat-header-cell *matHeaderCellDef>Voto</th>
                  <td mat-cell *matCellDef="let elector">
                    <div class="voto-cell">
                      <mat-icon [ngClass]="elector.estadoVoto === 'voto' ? 'voto-checked' : 'voto-unchecked'">
                        {{ elector.estadoVoto === 'voto' ? 'check_box' : 'check_box_outline_blank' }}
                      </mat-icon>
                      <span class="voto-text">{{ getVotoDisplay(elector.estadoVoto) }}</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Recomendación IA Column -->
                <ng-container matColumnDef="recomendacionIA">
                  <th mat-header-cell *matHeaderCellDef>Recomendación IA</th>
                  <td mat-cell *matCellDef="let elector">
                    <span class="recomendacion-text">{{ elector.recomendacionIA }}</span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Copiloto IA -->
        <mat-card class="copiloto-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="ai-icon">psychology</mat-icon>
              Copiloto IA
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="copiloto-content">
              <div class="copiloto-message">
                <p>Te faltan {{ faltan }} electores.</p>
                <p>Prioriza según fidelización.</p>
              </div>
              <div class="sugerencias">
                <div class="sugerencias-label">Sugerencias:</div>
                <div class="sugerencias-buttons">
                  <button mat-raised-button class="sugerencia-btn mensaje">
                    <mat-icon>message</mat-icon>
                    Mensaje
                  </button>
                  <button mat-raised-button class="sugerencia-btn llamar">
                    <mat-icon>phone</mat-icon>
                    Llamar
                  </button>
                  <button mat-raised-button class="sugerencia-btn transporte">
                    <mat-icon>directions_car</mat-icon>
                    Transporte
                  </button>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button mat-raised-button color="primary" class="save-button">
            <mat-icon>save</mat-icon>
            Guardar actualización
          </button>
          <button mat-raised-button color="accent" class="ranking-button">
            <mat-icon>leaderboard</mat-icon>
            Ver ranking
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 0 20px;
    }

    .dashboard-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .filter-button {
      margin-right: 10px;
    }

    .logout-button {
      color: white;
    }

    .dashboard-content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .metric-card.meta {
      background: linear-gradient(135deg, #3f51b5, #5c6bc0);
    }

    .metric-card.captados {
      background: linear-gradient(135deg, #4caf50, #66bb6a);
    }

    .metric-card.cumplimiento {
      background: linear-gradient(135deg, #9c27b0, #ba68c8);
    }

    .metric-card.faltan {
      background: linear-gradient(135deg, #f44336, #ef5350);
    }

    .metric-number {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .metric-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .electores-table-card {
      margin-bottom: 20px;
    }

    .table-container {
      overflow-x: auto;
    }

    .electores-table {
      width: 100%;
    }

    .foto-placeholder {
      width: 40px;
      height: 40px;
      background-color: #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }

    .nombre-cell {
      display: flex;
      flex-direction: column;
    }

    .nombre {
      font-weight: 500;
      color: #333;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .estado-ratificado {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .estado-a_confirmar {
      background-color: #ffebee;
      color: #c62828;
    }

    .voto-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .voto-checked {
      color: #4caf50;
    }

    .voto-unchecked {
      color: #666;
    }

    .voto-text {
      font-size: 0.9rem;
    }

    .recomendacion-text {
      font-size: 0.9rem;
      color: #555;
    }

    .copiloto-card {
      margin-bottom: 20px;
      background: linear-gradient(135deg, #f3e5f5, #e1bee7);
    }

    .ai-icon {
      color: #9c27b0;
      margin-right: 8px;
    }

    .copiloto-content {
      padding: 16px 0;
    }

    .copiloto-message p {
      margin: 8px 0;
      font-size: 1.1rem;
      color: #333;
    }

    .sugerencias {
      margin-top: 20px;
    }

    .sugerencias-label {
      font-weight: 500;
      margin-bottom: 12px;
      color: #333;
    }

    .sugerencias-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .sugerencia-btn {
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .sugerencia-btn.mensaje {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .sugerencia-btn.llamar {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    .sugerencia-btn.transporte {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .action-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-top: 30px;
    }

    .save-button, .ranking-button {
      min-width: 200px;
      height: 50px;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 10px;
      }

      .metrics-row {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }

      .dashboard-title {
        font-size: 1rem;
      }

      .sugerencias-buttons {
        flex-direction: column;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .save-button, .ranking-button {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class RecintoDashboardComponent implements OnInit {
  currentUser: User | null = null;
  recintoId = '1761'; // Esto debería venir de la base de datos
  
  // Métricas
  meta = 15;
  captados = 11;
  cumplimiento = 73;
  faltan = 4;

  // Tabla de electores
  displayedColumns: string[] = ['foto', 'nombre', 'cedula', 'estado', 'voto', 'recomendacionIA'];
  electores: Elector[] = [
    {
      id: 1,
      nombre: 'Juan Pérez',
      cedula: '001-1234567-8',
      estado: 'ratificado',
      estadoVoto: 'voto',
      recomendacionIA: 'Solo recordatorio'
    },
    {
      id: 2,
      nombre: 'María Díaz',
      cedula: '001-9876543-2',
      estado: 'a_confirmar',
      estadoVoto: 'no_voto',
      recomendacionIA: 'Asignar movilizador'
    },
    {
      id: 3,
      nombre: 'Pedro Gómez',
      cedula: '001-5556667-9',
      estado: 'ratificado',
      estadoVoto: 'no_voto',
      recomendacionIA: 'Recordatorio y transporte'
    },
    {
      id: 4,
      nombre: 'Ana López',
      cedula: '001-4443332-1',
      estado: 'ratificado',
      estadoVoto: 'voto',
      recomendacionIA: 'Solo recordatorio'
    },
    {
      id: 5,
      nombre: 'Carlos Ruiz',
      cedula: '001-2223334-5',
      estado: 'a_confirmar',
      estadoVoto: 'no_voto',
      recomendacionIA: 'Contactar hoy'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadElectores();
  }

  loadElectores() {
    // Aquí cargarías los electores reales desde la API
    console.log('Cargando electores para el recinto:', this.recintoId);
  }

  getEstadoDisplay(estado: string): string {
    const estados: { [key: string]: string } = {
      'ratificado': 'Ratificado',
      'a_confirmar': 'A confirmar'
    };
    return estados[estado] || estado;
  }

  getVotoDisplay(estadoVoto: string): string {
    const votos: { [key: string]: string } = {
      'voto': 'Votó',
      'no_voto': 'No ha votado'
    };
    return votos[estadoVoto] || estadoVoto;
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}