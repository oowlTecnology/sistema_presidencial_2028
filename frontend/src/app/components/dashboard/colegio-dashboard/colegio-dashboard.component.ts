import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../../services/auth.service';
import { PadronService, PersonaPadron, PaginatedResponse, EstadisticasColegio } from '../../../services/padron.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-colegio-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
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

        <!-- Cards de Estadísticas -->
        <div class="stats-grid">
          <mat-card class="stat-card total-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ estadisticas?.totalPersonas || 0 }}</div>
                <div class="stat-label">Total Personas</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card male-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>man</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ estadisticas?.totalMasculinos || 0 }}</div>
                <div class="stat-label">Masculinos</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card female-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>woman</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ estadisticas?.totalFemeninos || 0 }}</div>
                <div class="stat-label">Femeninos</div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card meta-card">
            <mat-card-content>
              <div class="stat-icon">
                <mat-icon>emoji_events</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ estadisticas?.totalFidelizados || 0 }} / {{ estadisticas?.metaFidelizacion || 15 }}</div>
                <div class="stat-label">Meta Fidelización</div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="estadisticas?.porcentajeMeta || 0"></div>
                </div>
                <div class="progress-text">{{ estadisticas?.porcentajeMeta || 0 }}%</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Búsqueda por cédula -->
        <mat-card class="search-card">
          <mat-card-header>
            <mat-card-title>Buscar Persona por Cédula</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="search-form">
              <mat-form-field appearance="outline" class="search-input">
                <mat-label>Cédula</mat-label>
                <input matInput [(ngModel)]="cedulaBusqueda" placeholder="000-0000000-0" maxlength="13" />
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="buscarPersona()" [disabled]="buscando">
                <mat-icon>search</mat-icon>
                Buscar
              </button>
            </div>

            <!-- Resultado de búsqueda -->
            <div class="search-result" *ngIf="personaBuscada">
              <div class="persona-card">
                <div class="persona-foto">
                  <img [src]="personaBuscada.foto || 'assets/no-photo.png'" alt="Foto" />
                </div>
                <div class="persona-info">
                  <h3>{{ personaBuscada.nombreCompleto }}</h3>
                  <p><strong>Cédula:</strong> {{ personaBuscada.cedula }}</p>
                  <p *ngIf="personaBuscada.colegioElectoral">
                    <strong>Colegio Electoral:</strong> 
                    {{ personaBuscada.colegioElectoral.codigo }} - {{ personaBuscada.colegioElectoral.descripcion }}
                  </p>
                  <div class="fidelizacion-status" *ngIf="personaBuscada.fidelizado">
                    <mat-icon color="warn">check_circle</mat-icon>
                    <span>Fidelizado por {{ personaBuscada.fidelizadoPor?.coordinador }} 
                    el {{ personaBuscada.fidelizadoPor?.fecha | date:'short' }}</span>
                  </div>
                </div>
                <div class="persona-actions">
                  <button 
                    mat-raised-button 
                    color="accent" 
                    (click)="fidelizarPersona(personaBuscada.cedula)"
                    [disabled]="personaBuscada.fidelizado || fidelizando"
                  >
                    <mat-icon>person_add</mat-icon>
                    {{ personaBuscada.fidelizado ? 'Ya Fidelizado' : 'Fidelizar' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="no-result" *ngIf="busquedaRealizada && !personaBuscada">
              <mat-icon>info</mat-icon>
              <p>No se encontró ninguna persona con esa cédula</p>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Tabla de personas del colegio -->
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>Personas del Colegio Electoral</mat-card-title>
            <mat-card-subtitle>Total: {{ totalPersonas }} personas</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="table-container" *ngIf="!cargandoTabla; else loadingTemplate">
              <table mat-table [dataSource]="personasColegio" class="personas-table">
                <!-- Foto Column -->
                <ng-container matColumnDef="foto">
                  <th mat-header-cell *matHeaderCellDef>Foto</th>
                  <td mat-cell *matCellDef="let persona">
                    <img [src]="persona.foto || 'assets/no-photo.png'" alt="Foto" class="table-foto" />
                  </td>
                </ng-container>

                <!-- Cédula Column -->
                <ng-container matColumnDef="cedula">
                  <th mat-header-cell *matHeaderCellDef>Cédula</th>
                  <td mat-cell *matCellDef="let persona">{{ persona.cedula }}</td>
                </ng-container>

                <!-- Nombre Column -->
                <ng-container matColumnDef="nombre">
                  <th mat-header-cell *matHeaderCellDef>Nombre Completo</th>
                  <td mat-cell *matCellDef="let persona">{{ persona.nombreCompleto }}</td>
                </ng-container>

                <!-- Estado Column -->
                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let persona">
                    <span class="estado-badge" [ngClass]="persona.fidelizado ? 'fidelizado' : 'pendiente'">
                      {{ persona.fidelizado ? 'Fidelizado' : 'Pendiente' }}
                    </span>
                  </td>
                </ng-container>

                <!-- Fidelizado Por Column -->
                <ng-container matColumnDef="fidelizadoPor">
                  <th mat-header-cell *matHeaderCellDef>Fidelizado Por</th>
                  <td mat-cell *matCellDef="let persona">
                    {{ persona.fidelizadoPor?.coordinador || '-' }}
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="acciones">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let persona">
                    <button 
                      mat-icon-button 
                      color="accent"
                      (click)="fidelizarPersona(persona.cedula)"
                      [disabled]="persona.fidelizado"
                    >
                      <mat-icon>person_add</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
              </table>
            </div>

            <ng-template #loadingTemplate>
              <div class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Cargando personas...</p>
              </div>
            </ng-template>

            <!-- Paginador -->
            <mat-paginator
              *ngIf="!cargandoTabla"
              [length]="totalPersonas"
              [pageSize]="pageSize"
              [pageSizeOptions]="[10, 25, 50, 100]"
              [pageIndex]="currentPage - 1"
              (page)="onPageChange($event)"
              showFirstLastButtons
            >
            </mat-paginator>
          </mat-card-content>
        </mat-card>
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
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      border: 1px solid #f0f0f0;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.12);
      border-color: #e0e0e0;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 28px !important;
      position: relative;
    }

    .stat-icon {
      width: 70px;
      height: 70px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      position: relative;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .stat-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
      z-index: 1;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 8px;
      line-height: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #9e9e9e;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .total-card .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .total-card .stat-number {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .male-card .stat-icon {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
    }

    .male-card .stat-number {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .female-card .stat-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .female-card .stat-number {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .meta-card .stat-icon {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.4);
    }

    .meta-card .stat-number {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 1.8rem;
    }

    .meta-card .stat-label {
      color: #FFA500;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background-color: #f5f5f5;
      border-radius: 10px;
      margin-top: 12px;
      overflow: hidden;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
    }

    .progress-text {
      font-size: 0.9rem;
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
      margin-top: 8px;
      text-align: right;
    }

    .search-card, .table-card {
      margin-bottom: 20px;
    }

    .search-form {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-input {
      flex: 1;
      max-width: 300px;
    }

    .search-result {
      margin-top: 20px;
    }

    .persona-card {
      display: flex;
      gap: 20px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      align-items: center;
    }

    .persona-foto img {
      width: 120px;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #ddd;
    }

    .persona-info {
      flex: 1;
    }

    .persona-info h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .persona-info p {
      margin: 5px 0;
      color: #666;
    }

    .fidelizacion-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      color: #f57c00;
      font-weight: 500;
    }

    .persona-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .no-result {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .no-result mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .table-container {
      overflow-x: auto;
    }

    .personas-table {
      width: 100%;
    }

    .table-foto {
      width: 50px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .estado-badge.fidelizado {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .estado-badge.pendiente {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 10px;
      }

      .persona-card {
        flex-direction: column;
        text-align: center;
      }

      .search-form {
        flex-direction: column;
        align-items: stretch;
      }

      .search-input {
        max-width: 100%;
      }
    }
  `]
})
export class ColegioDashboardComponent implements OnInit {
  currentUser: User | null = null
  cedulaBusqueda: string = ''
  personaBuscada: PersonaPadron | null = null
  busquedaRealizada: boolean = false
  buscando: boolean = false
  fidelizando: boolean = false
  
  personasColegio: PersonaPadron[] = []
  displayedColumns: string[] = ['foto', 'cedula', 'nombre', 'estado', 'fidelizadoPor', 'acciones']
  cargandoTabla: boolean = false
  
  // Paginación
  currentPage: number = 1
  pageSize: number = 10
  totalPersonas: number = 0
  
  // Estadísticas
  estadisticas: EstadisticasColegio | null = null

  constructor(
    private authService: AuthService,
    private padronService: PadronService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser()
    if (this.currentUser?.colegioId) {
      this.cargarEstadisticas()
      this.cargarPersonasColegio()
    }
  }

  buscarPersona() {
    if (!this.cedulaBusqueda.trim()) {
      this.snackBar.open('Por favor ingrese una cédula', 'Cerrar', { duration: 3000 })
      return
    }

    this.buscando = true
    this.busquedaRealizada = false
    this.personaBuscada = null

    this.padronService.buscarPorCedula(this.cedulaBusqueda).subscribe({
      next: (persona) => {
        this.personaBuscada = persona
        this.busquedaRealizada = true
        this.buscando = false
      },
      error: (error) => {
        this.busquedaRealizada = true
        this.buscando = false
        if (error.status === 404) {
          this.snackBar.open('Cédula no encontrada en el padrón', 'Cerrar', { duration: 3000 })
        } else {
          this.snackBar.open('Error al buscar persona', 'Cerrar', { duration: 3000 })
        }
      }
    })
  }

  fidelizarPersona(cedula: string) {
    this.fidelizando = true
    this.padronService.fidelizar(cedula).subscribe({
      next: () => {
        this.snackBar.open('Persona fidelizada exitosamente', 'Cerrar', { duration: 3000 })
        this.fidelizando = false
        // Actualizar búsqueda, tabla y estadísticas
        if (this.personaBuscada?.cedula === cedula) {
          this.buscarPersona()
        }
        this.cargarEstadisticas()
        this.cargarPersonasColegio()
      },
      error: (error) => {
        this.fidelizando = false
        const mensaje = error.error?.message || 'Error al fidelizar persona'
        this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 })
      }
    })
  }

  cargarPersonasColegio() {
    if (!this.currentUser?.colegioId) return

    this.cargandoTabla = true
    this.padronService.getPersonasPorColegio(this.currentUser.colegioId, this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse) => {
        this.personasColegio = response.data
        this.totalPersonas = response.pagination.total
        this.currentPage = response.pagination.page
        this.cargandoTabla = false
      },
      error: (error) => {
        console.error('Error al cargar personas del colegio:', error)
        this.cargandoTabla = false
        this.snackBar.open('Error al cargar personas del colegio', 'Cerrar', { duration: 3000 })
      }
    })
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1
    this.pageSize = event.pageSize
    this.cargarPersonasColegio()
  }

  cargarEstadisticas() {
    if (!this.currentUser?.colegioId) return

    this.padronService.getEstadisticas(this.currentUser.colegioId).subscribe({
      next: (stats) => {
        this.estadisticas = stats
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error)
      }
    })
  }

  logout() {
    this.authService.logout()
  }
}









