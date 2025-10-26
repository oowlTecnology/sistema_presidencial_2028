import { Component, OnInit } from '@angular/core';
import { FuncionariosService, Funcionario } from '../../services/funcionarios.service';
import { ProvinciasService } from '../../services/provincias.service';
import { MunicipiosService } from '../../services/municipios.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})
export class FuncionariosComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  provincias: any[] = [];
  municipios: any[] = [];
  
  selectedProvinciaId: number | null = null;
  selectedMunicipioId: number | null = null;
  
  // Estadísticas para el dashboard
  estadisticas = {
    totalFuncionarios: 0,
    provincias: 1,
    municipios: 1,
    consultas: 0
  };
  
  loading = false;
  error: string | null = null;
  
  // Filtros
  searchTerm = '';
  
  // Usuario actual
  currentUser: any = null;
  canManage = false;

  constructor(
    private funcionariosService: FuncionariosService,
    private provinciasService: ProvinciasService,
    private municipiosService: MunicipiosService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProvincias();
    this.loadFuncionarios();
  }

  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.canManage = this.currentUser?.role === 'super_admin' || this.currentUser?.role === 'funcionarios';
  }

  private loadProvincias(): void {
    this.provinciasService.getProvincias().subscribe({
      next: (response) => {
        this.provincias = response.data;
      },
      error: (error) => {
        console.error('Error al cargar provincias:', error);
      }
    });
  }

  private loadMunicipios(): void {
    if (this.selectedProvinciaId) {
      this.municipiosService.getMunicipiosByProvincia(this.selectedProvinciaId).subscribe({
        next: (response) => {
          this.municipios = response.data;
        },
        error: (error) => {
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

    // Determinar qué tipo de filtro aplicar
    if (this.selectedMunicipioId) {
      // Filtrar por municipio específico
      request = this.funcionariosService.getFuncionariosByMunicipio(this.selectedMunicipioId);
    } else if (this.selectedProvinciaId) {
      // Filtrar por provincia (todos los municipios de la provincia)
      request = this.funcionariosService.getFuncionariosByProvincia(this.selectedProvinciaId);
    } else {
      // Sin filtros, obtener todos
      request = this.funcionariosService.getFuncionarios();
    }

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.funcionarios = response.data;
          this.calculateStats();
        } else {
          this.error = response.message || 'Error al cargar funcionarios';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar funcionarios:', error);
        this.error = 'Error al cargar funcionarios';
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.estadisticas.totalFuncionarios = this.funcionarios.length;
    
    // Calcular provincias únicas
    const provinciasUnicas = new Set(this.funcionarios.map(f => f.municipio));
    this.estadisticas.provincias = provinciasUnicas.size || 1;
    
    // Calcular municipios únicos
    const municipiosUnicos = new Set(this.funcionarios.map(f => f.municipioId));
    this.estadisticas.municipios = municipiosUnicos.size || 1;
  }

  onProvinciaChange(): void {
    this.selectedMunicipioId = null;
    this.municipios = [];
    this.loadMunicipios();
    this.loadFuncionarios();
  }

  onMunicipioChange(): void {
    this.loadFuncionarios();
  }

  clearFilters(): void {
    this.selectedProvinciaId = null;
    this.selectedMunicipioId = null;
    this.municipios = [];
    this.searchTerm = '';
    this.loadFuncionarios();
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
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjNjM2NjcwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjE1IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjAgODBDMjAgNjguOTU0MyAyOC45NTQzIDYwIDQwIDYwSDYwQzcxLjA0NTcgNjAgODAgNjguOTU0MyA4MCA4MFY5MEgyMFY4MFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=';
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultImage();
  }

  viewFuncionario(funcionario: Funcionario): void {
    // Implementar modal de visualización
    console.log('Ver funcionario:', funcionario);
  }

  editFuncionario(funcionario: Funcionario): void {
    if (!this.canManage) {
      this.showError('No tienes permisos para editar funcionarios');
      return;
    }
    // Implementar modal de edición
    console.log('Editar funcionario:', funcionario);
  }

  deleteFuncionario(funcionario: Funcionario): void {
    if (!this.canManage) {
      this.showError('No tienes permisos para eliminar funcionarios');
      return;
    }

    if (confirm(`¿Estás seguro de que deseas eliminar a ${funcionario.nombre}?`)) {
      this.funcionariosService.deleteFuncionario(funcionario.id).subscribe({
        next: (response) => {
          this.showSuccess(response.message);
          this.loadFuncionarios();
        },
        error: (error) => {
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
    // Implementar modal de creación
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

  // Métodos para el dashboard

  reloadStats(): void {
    this.loadFuncionarios();
    this.calculateStats();
    this.showSuccess('Estadísticas actualizadas');
  }

  exportData(): void {
    // Implementar exportación de datos
    console.log('Exportar datos');
    this.showSuccess('Función de exportación en desarrollo');
  }
}
