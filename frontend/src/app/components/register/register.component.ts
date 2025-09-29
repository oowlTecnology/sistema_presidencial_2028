import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../../services/auth.service'
import { RegisterRequest, UserRole } from '../../models/user.model'
import { ProvinciaService, Provincia } from '../../services/provincia.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Gana tu Colegio 2028</mat-card-title>
          <mat-card-subtitle>Registro de Usuario</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="firstName" required />
                <mat-error
                  *ngIf="registerForm.get('firstName')?.hasError('required')"
                >
                  El nombre es requerido
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="lastName" required />
                <mat-error
                  *ngIf="registerForm.get('lastName')?.hasError('required')"
                >
                  El apellido es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-error
                *ngIf="registerForm.get('email')?.hasError('required')"
              >
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Ingresa un email válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
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
              <mat-error
                *ngIf="registerForm.get('password')?.hasError('required')"
              >
                La contraseña es requerida
              </mat-error>
              <mat-error
                *ngIf="registerForm.get('password')?.hasError('minlength')"
              >
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rol</mat-label>
              <mat-select formControlName="role" required [disabled]="true">
                <mat-option value="provincial"
                  >Coordinador Provincial</mat-option
                >
              </mat-select>
              <mat-error *ngIf="registerForm.get('role')?.hasError('required')">
                El rol es requerido
              </mat-error>
            </mat-form-field>

            <!-- Dropdown de provincias para coordinador provincial -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Provincia</mat-label>
              <mat-select formControlName="provinciaId" required>
                <mat-option
                  *ngFor="let provincia of provincias"
                  [value]="provincia.ID"
                >
                  {{ provincia.Descripcion }}
                </mat-option>
              </mat-select>
              <mat-error
                *ngIf="registerForm.get('provinciaId')?.hasError('required')"
              >
                La provincia es requerida
              </mat-error>
            </mat-form-field>

            <!-- Selección territorial según el rol -->
            <div class="territorial-selection" *ngIf="selectedRole">
              <mat-form-field
                appearance="outline"
                class="full-width"
                *ngIf="selectedRole === 'municipal'"
              >
                <mat-label>Provincia</mat-label>
                <mat-select formControlName="provinciaId">
                  <mat-option value="1">Santo Domingo</mat-option>
                  <mat-option value="2">Santiago</mat-option>
                  <mat-option value="3">La Vega</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                class="full-width"
                *ngIf="selectedRole === 'circunscripcion'"
              >
                <mat-label>Municipio</mat-label>
                <mat-select formControlName="municipioId">
                  <mat-option value="1">Santo Domingo Este</mat-option>
                  <mat-option value="2">Santo Domingo Norte</mat-option>
                  <mat-option value="3">Santo Domingo Oeste</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                class="full-width"
                *ngIf="selectedRole === 'colegio'"
              >
                <mat-label>Circunscripción</mat-label>
                <mat-select formControlName="circunscripcionId">
                  <mat-option value="1">Circunscripción 1</mat-option>
                  <mat-option value="2">Circunscripción 2</mat-option>
                  <mat-option value="3">Circunscripción 3</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field
                appearance="outline"
                class="full-width"
                *ngIf="selectedRole === 'recinto'"
              >
                <mat-label>Colegio</mat-label>
                <mat-select formControlName="colegioId">
                  <mat-option value="1">Colegio San José</mat-option>
                  <mat-option value="2">Colegio San Juan</mat-option>
                  <mat-option value="3">Colegio San Pedro</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Teléfono</mat-label>
              <input matInput type="tel" formControlName="phoneNumber" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Dirección</mat-label>
              <input matInput formControlName="address" />
            </mat-form-field>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width"
              [disabled]="registerForm.invalid || isLoading"
            >
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">Registrarse</span>
            </button>
          </form>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </mat-card-content>

        <mat-card-actions>
          <p class="text-center">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="login-link">Inicia sesión aquí</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }

      .register-card {
        width: 100%;
        max-width: 500px;
        padding: 20px;
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

      .error-message {
        color: #f44336;
        text-align: center;
        margin-top: 16px;
        padding: 8px;
        background-color: #ffebee;
        border-radius: 4px;
      }

      .login-link {
        color: #3f51b5;
        text-decoration: none;
        font-weight: 500;
      }

      .login-link:hover {
        text-decoration: underline;
      }

      .text-center {
        text-align: center;
        width: 100%;
      }

      mat-card-title {
        text-align: center;
        color: #3f51b5;
        font-weight: bold;
      }

      mat-card-subtitle {
        text-align: center;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup
  hidePassword = true
  isLoading = false
  errorMessage = ''
  selectedRole: string | null = null
  provincias: Provincia[] = []

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private provinciaService: ProvinciaService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['provincial', [Validators.required]],
      provinciaId: ['', [Validators.required]],
      circunscripcionId: [''],
      colegioId: [''],
      recintoId: [''],
      phoneNumber: [''],
      address: [''],
    })
  }

  ngOnInit() {
    this.provinciaService.getProvincias().subscribe({
      next: (data: Provincia[]) => (this.provincias = data),
      error: () => (this.provincias = []),
    })
  }

  onRoleChange(event: any) {
    this.selectedRole = event.value

    // Limpiar campos territoriales cuando cambia el rol
    this.registerForm.patchValue({
      provinciaId: '',
      circunscripcionId: '',
      colegioId: '',
      recintoId: '',
    })
  }

  onSubmit() {
    console.log('onSubmit ejecutado')
    if (this.registerForm.valid) {
      this.isLoading = true
      this.errorMessage = ''

      const registerData: RegisterRequest = {
        ...this.registerForm.value,
        provinciaId: Number(this.registerForm.value.provinciaId),
      }
      console.log('Datos enviados al backend:', registerData)

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false
          // Redirigir al dashboard según el rol del usuario
          this.router.navigate([`/dashboard/${response.user.role}`])
        },
        error: (error) => {
          this.isLoading = false
          this.errorMessage =
            error.error?.message || 'Error al registrar usuario'
        },
      })
    }
  }
}
