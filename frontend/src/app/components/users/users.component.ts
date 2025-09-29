import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTableModule } from '@angular/material/table'
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'
import { AuthService } from '../../services/auth.service'
import { UserService } from '../../services/user.service'
import { User, UserRole, RegisterRequest } from '../../models/user.model'
import { MunicipioService, Municipio } from '../../services/municipio.service'
import { ColegioService, Colegio } from '../../services/colegio.service'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="users-container">
      <mat-toolbar color="primary" class="toolbar">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Gestión de Usuarios</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openAddUserDialog()">
          <mat-icon>person_add</mat-icon>
          Agregar Usuario
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Lista de Usuarios</mat-card-title>
            <mat-card-subtitle
              >Gestiona los coordinadores de tu área</mat-card-subtitle
            >
          </mat-card-header>

          <mat-card-content>
            <div
              class="table-container"
              *ngIf="!isLoading; else loadingTemplate"
            >
              <table mat-table [dataSource]="users" class="users-table">
                <!-- Nombre Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Nombre</th>
                  <td mat-cell *matCellDef="let user">
                    {{ user.firstName }} {{ user.lastName }}
                  </td>
                </ng-container>

                <!-- Email Column -->
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let user">{{ user.email }}</td>
                </ng-container>

                <!-- Role Column -->
                <ng-container matColumnDef="role">
                  <th mat-header-cell *matHeaderCellDef>Rol</th>
                  <td mat-cell *matCellDef="let user">
                    <span class="role-badge" [ngClass]="'role-' + user.role">
                      {{ getRoleDisplayName(user.role) }}
                    </span>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let user">
                    <span
                      class="status-badge"
                      [ngClass]="user.isActive ? 'active' : 'inactive'"
                    >
                      {{ user.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                </ng-container>

                <!-- Created Date Column -->
                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef>Fecha de Registro</th>
                  <td mat-cell *matCellDef="let user">
                    {{ user.createdAt | date : 'short' }}
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let user">
                    <button
                      mat-icon-button
                      (click)="editUser(user)"
                      [disabled]="user.id === currentUser?.id"
                    >
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      color="warn"
                      (click)="deleteUser(user)"
                      [disabled]="
                        user.id === currentUser?.id || !canDeleteUsers
                      "
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                ></tr>
              </table>
            </div>

            <ng-template #loadingTemplate>
              <div class="loading-container">
                <mat-spinner></mat-spinner>
                <p>Cargando usuarios...</p>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <!-- Add/Edit User Dialog -->
    <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>{{ isEditing ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
          <button mat-icon-button (click)="closeDialog()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="firstName" required />
              <mat-error
                *ngIf="userForm.get('firstName')?.hasError('required')"
              >
                El nombre es requerido
              </mat-error>
            </mat-form-field>

          <!-- Dropdown de colegios solo si el usuario actual es municipal y está agregando un usuario de colegio -->
          <mat-form-field
            appearance="outline"
            class="full-width"
            *ngIf="
              currentUser?.role === 'municipal' &&
              userForm.get('role')?.value === 'colegio'
            "
          >
            <mat-label>Colegio</mat-label>
            <mat-select formControlName="colegioId">
              <mat-option *ngIf="colegios.length === 0" disabled>
                No hay colegios disponibles
              </mat-option>
              <mat-option
                *ngFor="let colegio of colegios"
                [value]="colegio.IDColegio"
              >
                {{ colegio.Descripcion }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="lastName" required />
            <mat-error *ngIf="userForm.get('lastName')?.hasError('required')">
              El apellido es requerido
            </mat-error>
          </mat-form-field>
          </div>

          <!-- Campo Email -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" required />
            <mat-error *ngIf="userForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="userForm.get('email')?.hasError('email')">
              Ingresa un email válido
            </mat-error>
          </mat-form-field>

          <mat-form-field
            appearance="outline"
            class="full-width"
            *ngIf="!isEditing"
          >
            <mat-label>Contraseña</mat-label>
            <input
              matInput
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              required
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hidePassword = !hidePassword"
              type="button"
            >
              <mat-icon>{{
                hidePassword ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            <mat-error *ngIf="userForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
              La contraseña debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Rol</mat-label>
            <mat-select
              formControlName="role"
              required
              (selectionChange)="onRoleChange($event.value)"
            >
              <mat-option
                *ngFor="let role of availableRoles"
                [value]="role.value"
              >
                {{ role.label }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="userForm.get('role')?.hasError('required')">
              El rol es requerido
            </mat-error>
          </mat-form-field>

          <!-- Dropdown de municipios solo si el usuario actual es provincial y está agregando un usuario municipal -->
          <mat-form-field
            appearance="outline"
            class="full-width"
            *ngIf="
              currentUser?.role === 'provincial' &&
              userForm.get('role')?.value === 'municipal'
            "
          >
            <mat-label>Municipio</mat-label>
            <mat-select formControlName="municipioId">
              <mat-option *ngIf="municipios.length === 0" disabled>
                No hay municipios disponibles
              </mat-option>
              <mat-option
                *ngFor="let municipio of municipios"
                [value]="municipio.ID"
              >
                {{ municipio.Descripcion }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Teléfono</mat-label>
            <input matInput type="tel" formControlName="phoneNumber" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dirección</mat-label>
            <input matInput formControlName="address" />
          </mat-form-field>

          <div class="dialog-actions">
            <button mat-button type="button" (click)="closeDialog()">
              Cancelar
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="userForm.invalid || isSubmitting"
            >
              <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
              <span *ngIf="!isSubmitting">{{
                isEditing ? 'Actualizar' : 'Crear'
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .users-container {
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

      .content {
        padding: 20px;
      }

      .table-container {
        overflow-x: auto;
      }

      .users-table {
        width: 100%;
      }

      .role-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: capitalize;
      }

      .role-provincial {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      .role-municipal {
        background-color: #f3e5f5;
        color: #7b1fa2;
      }

      .role-colegio {
        background-color: #e8f5e8;
        color: #388e3c;
      }

      .role-recinto {
        background-color: #fff3e0;
        color: #f57c00;
      }

      .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status-badge.active {
        background-color: #e8f5e8;
        color: #388e3c;
      }

      .status-badge.inactive {
        background-color: #ffebee;
        color: #d32f2f;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
      }

      .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
      }

      .dialog-content {
        background: white;
        border-radius: 8px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e0e0e0;
      }

      .dialog-header h2 {
        margin: 0;
        color: #333;
      }

      .form-row {
        display: flex;
        gap: 16px;
      }

      .half-width {
        flex: 1;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 20px;
        border-top: 1px solid #e0e0e0;
      }

      @media (max-width: 768px) {
        .content {
          padding: 10px;
        }

        .form-row {
          flex-direction: column;
        }

        .dialog-content {
          width: 95%;
        }
      }
    `,
  ],
})
export class UsersComponent implements OnInit {
  // Estado y datos
  municipios: Municipio[] = []
  colegios: Colegio[] = []
  users: User[] = []
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'createdAt', 'actions']
  currentUser: User | null = null
  isLoading = false
  showDialog = false
  isEditing = false
  isSubmitting = false
  hidePassword = true
  selectedUser: User | null = null

  // Formulario
  userForm: FormGroup
  availableRoles: { value: string; label: string }[] = []

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private municipioService: MunicipioService,
    private colegioService: ColegioService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      municipioId: [''],
      colegioId: [''],
      phoneNumber: [''],
      address: [''],
    })
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser()
    this.setupAvailableRoles()
    this.loadUsers()
  }

  setupAvailableRoles() {
    if (!this.currentUser) return

    const allRoles = [
      { value: UserRole.MUNICIPAL, label: 'Coordinador Municipal' },
      { value: UserRole.COLEGIO, label: 'Coordinador de Colegio' },
      { value: UserRole.RECINTO, label: 'Coordinador de Recinto' },
    ]

    if (this.currentUser.role === UserRole.PROVINCIAL) {
      this.availableRoles = allRoles.filter((r) => r.value === UserRole.MUNICIPAL)
    } else if (this.currentUser.role === UserRole.MUNICIPAL) {
      this.availableRoles = allRoles.filter((r) => r.value === UserRole.COLEGIO)
    } else if (this.currentUser.role === UserRole.COLEGIO) {
      this.availableRoles = allRoles.filter((r) => r.value === UserRole.RECINTO)
    } else {
      this.availableRoles = []
    }
  }

  get canDeleteUsers(): boolean {
    return this.currentUser?.role === UserRole.PROVINCIAL
  }

  loadUsers() {
    this.isLoading = true
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users
        this.isLoading = false
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios:', error)
        this.isLoading = false
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 })
      },
    })
  }

  openAddUserDialog() {
    console.log('Abriendo modal de usuario. Rol actual:', this.currentUser?.role)
    this.isEditing = false
    this.selectedUser = null
    this.userForm.reset()

    if (this.currentUser?.role === 'provincial') {
      this.userForm.patchValue({ role: 'municipal' })
      this.onRoleChange('municipal')
    } else if (this.currentUser?.role === 'municipal') {
      this.userForm.patchValue({ role: 'colegio' })
      console.log('Usuario municipal con municipioId =', this.currentUser.municipioId)
      this.onRoleChange('colegio')
    } else {
      this.userForm.patchValue({ role: this.availableRoles[0]?.value })
      this.municipios = []
      this.colegios = []
    }

    this.showDialog = true
    this.userForm.get('password')?.updateValueAndValidity()
  }
  editUser(user: User) {
    this.isEditing = true
    this.selectedUser = user
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
    })
    this.userForm.get('password')?.clearValidators()
    this.userForm.get('password')?.updateValueAndValidity()
    this.showDialog = true
  }
  onRoleChange(event: any) {
    console.log('onRoleChange valor recibido:', event)
    let value: string
    if (event && typeof event === 'object') {
      if ('value' in event) {
        value = event.value
      } else if (event.target && event.target.value) {
        value = event.target.value
      } else {
        value = this.userForm.get('role')?.value
      }
    } else {
      value = event
    }
    // Limpiar validaciones dinámicas
    this.userForm.get('municipioId')?.clearValidators()
    this.userForm.get('colegioId')?.clearValidators()

    // Caso 1: Provincial creando Municipal -> cargar municipios y requerir municipioId
    if (this.currentUser?.role === 'provincial' && value === 'municipal') {
      this.userForm.get('municipioId')?.setValidators([Validators.required])
      if (this.currentUser.provinciaId) {
        this.municipioService
          .getMunicipiosByProvincia(this.currentUser.provinciaId)
          .subscribe({
            next: (data: Municipio[]) => {
              this.municipios = [...data]
              this.cdr.detectChanges()
            },
            error: () => (this.municipios = []),
          })
      }
      this.colegios = []
    }

    // Caso 2: Municipal creando Colegio -> cargar colegios de su municipio y requerir colegioId
    if (this.currentUser?.role === 'municipal' && value === 'colegio') {
      this.userForm.get('colegioId')?.setValidators([Validators.required])
      if (this.currentUser.municipioId) {
        console.log('Cargando colegios para municipioId =', this.currentUser.municipioId)
        this.colegioService
          .getColegiosByMunicipio(this.currentUser.municipioId)
          .subscribe({
            next: (data: Colegio[]) => {
              this.colegios = [...data]
              console.log('Colegios cargados:', data)
              this.cdr.detectChanges()
            },
            error: (err: any) => {
              console.error('Error al cargar colegios:', err)
              this.colegios = []
            },
          })
      }
      this.municipios = []
    }

    // Actualizar estado de validaciones
    this.userForm.get('municipioId')?.updateValueAndValidity()
    this.userForm.get('colegioId')?.updateValueAndValidity()
  }

  closeDialog() {
    this.showDialog = false
    this.isEditing = false
    this.selectedUser = null
    this.userForm.reset()
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true
      const formData = this.userForm.value

      if (this.isEditing && this.selectedUser) {
        // Actualizar usuario
        this.userService.updateUser(this.selectedUser.id, formData).subscribe({
          next: () => {
            this.isSubmitting = false
            this.closeDialog()
            this.loadUsers()
            this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', {
              duration: 3000,
            })
          },
          error: (error) => {
            this.isSubmitting = false
            this.snackBar.open('Error al actualizar usuario', 'Cerrar', {
              duration: 3000,
            })
          },
        })
      } else {
        // Crear usuario
        const newUser: RegisterRequest = {
          ...formData,
          provinciaId:
            formData.role === 'municipal' &&
            this.currentUser?.role === 'provincial'
              ? this.currentUser.provinciaId
              : undefined,
        }

        this.userService.createUser(newUser).subscribe({
          next: () => {
            this.isSubmitting = false
            this.closeDialog()
            this.loadUsers()
            this.snackBar.open('Usuario creado exitosamente', 'Cerrar', {
              duration: 3000,
            })
          },
          error: (error) => {
            this.isSubmitting = false
            this.snackBar.open('Error al crear usuario', 'Cerrar', {
              duration: 3000,
            })
          },
        })
      }
    }
  }

  deleteUser(user: User) {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar a ${user.firstName} ${user.lastName}?`
      )
    ) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers()
          this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', {
            duration: 3000,
          })
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
            duration: 3000,
          })
        },
      })
    }
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      provincial: 'Provincial',
      municipal: 'Municipal',
      colegio: 'Colegio',
      recinto: 'Recinto',
    }
    return roleMap[role] || role
  }

  goBack() {
    if (this.currentUser) {
      window.location.href = `/dashboard/${this.currentUser.role}`
    }
  }
}
