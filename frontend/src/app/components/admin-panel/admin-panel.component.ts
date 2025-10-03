import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../models/user.model';
import { ProvinciaService, Provincia } from '../../services/provincia.service';
import { MunicipioService, Municipio } from '../../services/municipio.service';
import { CircunscripcionService, Circunscripcion } from '../../services/circunscripcion.service';
import { ColegioService, Colegio } from '../../services/colegio.service';
import { RecintoService, Recinto } from '../../services/recinto.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatMenuModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit {
  users: User[] = []
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'actions']
  isLoading = false
  selectedUser: User | null = null
  showPasswordDialog = false
  showRoleDialog = false
  
  // Datos para selectores
  provincias: Provincia[] = []
  municipios: Municipio[] = []
  circunscripciones: Circunscripcion[] = []
  colegios: Colegio[] = []
  recintos: Recinto[] = []
  
  passwordForm: FormGroup
  roleForm: FormGroup
  
  availableRoles = [
    { value: UserRole.SUPER_ADMIN, label: 'Super Admin' },
    { value: UserRole.EJECUTIVO, label: 'Ejecutivo' },
    { value: UserRole.PROVINCIAL, label: 'Provincial' },
    { value: UserRole.MUNICIPAL, label: 'Municipal' },
    { value: UserRole.CIRCUNSCRIPCION, label: 'Circunscripción' },
    { value: UserRole.COLEGIO, label: 'Colegio' },
    { value: UserRole.RECINTO, label: 'Recinto' }
  ]

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private circunscripcionService: CircunscripcionService,
    private colegioService: ColegioService,
    private recintoService: RecintoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    })

    this.roleForm = this.fb.group({
      newRole: ['', [Validators.required]],
      provinciaId: [''],
      municipioId: [''],
      circunscripcionId: [''],
      colegioId: [''],
      recintoId: ['']
    })
  }

  ngOnInit() {
    this.loadUsers()
  }

  loadUsers() {
    this.isLoading = true
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
        this.isLoading = false
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error)
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 })
        this.isLoading = false
      }
    })
  }

  openPasswordDialog(user: User) {
    this.selectedUser = user
    this.passwordForm.reset()
    this.showPasswordDialog = true
  }

  openRoleDialog(user: User) {
    this.selectedUser = user
    this.roleForm.patchValue({ 
      newRole: user.role,
      provinciaId: user.provinciaId,
      municipioId: user.municipioId,
      circunscripcionId: user.circunscripcionId,
      colegioId: user.colegioId,
      recintoId: user.recintoId
    })
    
    // Cargar provincias para todos los casos
    this.loadProvincias()
    
    // Si el usuario ya tiene datos, cargar las opciones correspondientes
    if (user.provinciaId) {
      this.loadMunicipios(user.provinciaId)
      this.loadCircunscripciones(user.provinciaId)
    }
    if (user.municipioId) {
      this.loadColegios(user.municipioId)
    }
    if (user.colegioId) {
      this.loadRecintos(user.colegioId)
    }
    
    this.showRoleDialog = true
  }

  loadProvincias() {
    this.provinciaService.getProvincias().subscribe({
      next: (data) => this.provincias = data,
      error: (err) => console.error('Error al cargar provincias:', err)
    })
  }

  loadMunicipios(provinciaId: number) {
    this.municipioService.getMunicipiosByProvincia(provinciaId).subscribe({
      next: (data) => this.municipios = data,
      error: (err) => console.error('Error al cargar municipios:', err)
    })
  }

  loadCircunscripciones(provinciaId: number) {
    this.circunscripcionService.getCircunscripcionesByProvincia(provinciaId).subscribe({
      next: (data) => this.circunscripciones = data,
      error: (err) => console.error('Error al cargar circunscripciones:', err)
    })
  }

  loadColegios(municipioId: number) {
    this.colegioService.getColegiosByMunicipio(municipioId).subscribe({
      next: (data) => this.colegios = data,
      error: (err) => console.error('Error al cargar colegios:', err)
    })
  }

  loadRecintos(colegioId: number) {
    this.recintoService.getRecintosByColegio(colegioId).subscribe({
      next: (data) => this.recintos = data,
      error: (err) => console.error('Error al cargar recintos:', err)
    })
  }

  onRoleChangeInDialog(newRole: string) {
    // Limpiar campos según el rol
    this.roleForm.patchValue({
      provinciaId: null,
      municipioId: null,
      circunscripcionId: null,
      colegioId: null,
      recintoId: null
    })

    // Cargar datos según el rol
    if (newRole === UserRole.PROVINCIAL) {
      this.loadProvincias()
    } else if (newRole === UserRole.MUNICIPAL) {
      this.loadProvincias()
    } else if (newRole === UserRole.CIRCUNSCRIPCION) {
      this.loadProvincias()
    }
  }

  changePassword() {
    if (this.passwordForm.invalid || !this.selectedUser) return

    const { newPassword, confirmPassword } = this.passwordForm.value

    if (newPassword !== confirmPassword) {
      this.snackBar.open('Las contraseñas no coinciden', 'Cerrar', { duration: 3000 })
      return
    }

    this.adminService.changeUserPassword(this.selectedUser.id, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', { duration: 3000 })
        this.showPasswordDialog = false
        this.selectedUser = null
      },
      error: (error) => {
        this.snackBar.open('Error al cambiar contraseña', 'Cerrar', { duration: 3000 })
      }
    })
  }

  changeRole() {
    if (this.roleForm.invalid || !this.selectedUser) return

    const formData = this.roleForm.value

    // Validar que se hayan seleccionado los IDs requeridos según el rol
    if (formData.newRole === UserRole.PROVINCIAL && !formData.provinciaId) {
      this.snackBar.open('Debes seleccionar una provincia', 'Cerrar', { duration: 3000 })
      return
    }
    if (formData.newRole === UserRole.MUNICIPAL && !formData.municipioId) {
      this.snackBar.open('Debes seleccionar un municipio', 'Cerrar', { duration: 3000 })
      return
    }
    if (formData.newRole === UserRole.CIRCUNSCRIPCION && !formData.circunscripcionId) {
      this.snackBar.open('Debes seleccionar una circunscripción', 'Cerrar', { duration: 3000 })
      return
    }

    const hierarchyData = {
      provinciaId: formData.provinciaId,
      municipioId: formData.municipioId,
      circunscripcionId: formData.circunscripcionId,
      colegioId: formData.colegioId,
      recintoId: formData.recintoId
    }

    this.adminService.changeUserRole(this.selectedUser.id, formData.newRole, hierarchyData).subscribe({
      next: () => {
        this.snackBar.open('Rol actualizado exitosamente', 'Cerrar', { duration: 3000 })
        this.showRoleDialog = false
        this.selectedUser = null
        this.loadUsers()
      },
      error: (error) => {
        this.snackBar.open('Error al cambiar rol', 'Cerrar', { duration: 3000 })
      }
    })
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.isActive
    this.adminService.toggleUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open(
          `Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`,
          'Cerrar',
          { duration: 3000 }
        )
        this.loadUsers()
      },
      error: (error) => {
        this.snackBar.open('Error al cambiar estado del usuario', 'Cerrar', { duration: 3000 })
      }
    })
  }

  deleteUser(user: User) {
    if (!confirm(`¿Estás seguro de eliminar a ${user.firstName} ${user.lastName}?`)) {
      return
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', { duration: 3000 })
        this.loadUsers()
      },
      error: (error) => {
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 })
      }
    })
  }

  getRoleLabel(role: string): string {
    const roleObj = this.availableRoles.find(r => r.value === role)
    return roleObj ? roleObj.label : role
  }

  closePasswordDialog() {
    this.showPasswordDialog = false
    this.selectedUser = null
    this.passwordForm.reset()
  }

  closeRoleDialog() {
    this.showRoleDialog = false
    this.selectedUser = null
    this.roleForm.reset()
  }

  logout() {
    this.authService.logout()
  }

  goBack() {
    this.router.navigate(['/'])
  }
}
