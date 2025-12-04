import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FuncionariosService, Funcionario } from '../../services/funcionarios.service';
import { AuthService } from '../../services/auth.service';
import { ProvinciaService, Provincia } from '../../services/provincia.service';
import { MunicipioService, Municipio } from '../../services/municipio.service';
import { FuncionarioDetailModalComponent } from './funcionario-detail-modal.component';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})
export class FuncionariosComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  
  selectedProvinciaId: number | null = null;
  selectedMunicipioId: number | null = null;
  
  estadisticas = {
    totalFuncionarios: 0,
    provincias: 1,
    municipios: 1,
    consultas: 0
  };
  
  loading = false;
  error: string | null = null;
  searchTerm = '';
  currentUser: any = null;
  canManage = false;

  constructor(
    private funcionariosService: FuncionariosService,
    private authService: AuthService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProvincias();
    // No cargar funcionarios al inicio - solo cuando se seleccione provincia/municipio
  }

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.canManage = this.currentUser?.role === 'super_admin' || this.currentUser?.role === 'funcionarios';
  }

  private loadProvincias(): void {
    this.provinciaService.getProvincias().subscribe({
      next: (provincias: Provincia[]) => {
        this.provincias = provincias;
      },
      error: (error: any) => {
        console.error('Error al cargar provincias:', error);
      }
    });
  }

  private loadMunicipios(): void {
    if (this.selectedProvinciaId) {
      this.municipioService.getMunicipiosByProvincia(this.selectedProvinciaId).subscribe({
        next: (municipios: Municipio[]) => {
          this.municipios = municipios;
        },
        error: (error: any) => {
          console.error('Error al cargar municipios:', error);
          this.municipios = [];
        }
      });
    } else {
      this.municipios = [];
    }
  }

  private loadFuncionarios(): void {
    this.loading = true;
    this.error = null;

    let request;
    if (this.selectedMunicipioId) {
      request = this.funcionariosService.getFuncionariosByMunicipio(this.selectedMunicipioId);
    } else if (this.selectedProvinciaId) {
      request = this.funcionariosService.getFuncionariosByProvincia(this.selectedProvinciaId);
    } else {
      // Si no hay filtros seleccionados, no cargar funcionarios
      this.funcionarios = [];
      this.calculateStats();
      this.loading = false;
      return;
    }

    request.subscribe({
      next: (response: any) => {
        if (response.success) {
          this.funcionarios = response.data;
          this.calculateStats();
        } else {
          this.error = response.message || 'Error al cargar funcionarios';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar funcionarios:', error);
        this.error = 'Error al cargar funcionarios';
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.estadisticas.totalFuncionarios = this.funcionarios.length;
    const provinciasUnicas = new Set(this.funcionarios.map(f => f.municipio));
    this.estadisticas.provincias = provinciasUnicas.size || 1;
    const municipiosUnicos = new Set(this.funcionarios.map(f => f.municipioId));
    this.estadisticas.municipios = municipiosUnicos.size || 1;
  }

  onProvinciaChange(event: any): void {
    this.selectedProvinciaId = event.value;
    this.selectedMunicipioId = null;
    this.municipios = [];
    this.loadMunicipios();
    this.loadFuncionarios();
  }

  onMunicipioChange(event: any): void {
    this.selectedMunicipioId = event.value;
    this.loadFuncionarios();
  }

  clearFilters(): void {
    this.selectedProvinciaId = null;
    this.selectedMunicipioId = null;
    this.municipios = [];
    this.searchTerm = '';
    this.funcionarios = [];
    this.calculateStats();
  }

  getFilteredFuncionarios(): Funcionario[] {
    if (!this.searchTerm) {
      return this.funcionarios;
    }
    const term = this.searchTerm.toLowerCase();
    return this.funcionarios.filter(funcionario =>
      funcionario.nombre?.toLowerCase().includes(term) ||
      funcionario.cargo?.toLowerCase().includes(term) ||
      funcionario.cedula?.toLowerCase().includes(term) ||
      funcionario.telefono?.toLowerCase().includes(term) ||
      funcionario.municipio?.toLowerCase().includes(term)
    );
  }

  getDefaultImage(): string {
    return 'assets/default-avatar.svg';
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultImage();
  }

  viewFuncionario(funcionario: Funcionario): void {
    const dialogRef = this.dialog.open(FuncionarioDetailModalComponent, {
      data: funcionario,
      maxWidth: '500px',
      width: '90vw',
      panelClass: 'funcionario-detail-dialog',
      backdropClass: 'funcionario-detail-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Opcional: manejar acciones después de cerrar el modal
      console.log('Modal cerrado');
    });
  }

  editFuncionario(funcionario: Funcionario): void {
    if (!this.canManage) {
      this.showError('No tienes permisos para editar funcionarios');
      return;
    }
    console.log('Editar funcionario:', funcionario);
  }

  deleteFuncionario(funcionario: Funcionario): void {
    if (!this.canManage) {
      this.showError('No tienes permisos para eliminar funcionarios');
      return;
    }
    if (confirm(`¿Estás seguro de que deseas eliminar a ${funcionario.nombre}?`)) {
      this.funcionariosService.deleteFuncionario(funcionario.id).subscribe({
        next: (response: any) => {
          this.showSuccess(response.message);
          this.loadFuncionarios();
        },
        error: (error: any) => {
          console.error('Error al eliminar funcionario:', error);
          this.showError('Error al eliminar funcionario');
        }
      });
    }
  }

  addFuncionario(): void {
    if (!this.canManage) {
      this.showError('No tienes permisos para agregar funcionarios');
      return;
    }
    console.log('Agregar funcionario');
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  reloadStats(): void {
    this.loadFuncionarios();
    this.calculateStats();
    this.showSuccess('Estadísticas actualizadas');
  }

  exportData(): void {
    console.log('Exportar datos');
    this.showSuccess('Función de exportación en desarrollo');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
