import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
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
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <!-- Header azul con logo PRM -->
      <div class="header-section">
        <div class="logo-container">
          <img src="assets/logo.png" alt="Logo PRM" class="prm-logo" 
               (error)="onImageError($event)">
        </div>
        <h1 class="system-title">Sistema PRM</h1>
        <p class="system-subtitle">Funcionarios República Dominicana</p>
      </div>

      <!-- Sección de login blanca -->
      <div class="login-section">
        <div class="login-card">
          <h2 class="login-title">Iniciar Sesión</h2>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <mat-icon class="input-icon">email</mat-icon>
              <label class="form-label">Correo Electrónico</label>
              <input type="email" 
                     class="form-input" 
                     formControlName="email" 
                     placeholder="ejemplo@correo.com"
                     required>
            </div>

            <div class="form-group">
              <mat-icon class="input-icon">lock</mat-icon>
              <label class="form-label">Contraseña</label>
              <div class="password-container">
                <input [type]="hidePassword ? 'password' : 'text'" 
                       class="form-input password-input" 
                       formControlName="password" 
                       placeholder="••••••••"
                       required>
                <button type="button" 
                        class="password-toggle" 
                        (click)="hidePassword = !hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
              </div>
            </div>

            <button type="submit" 
                    class="login-btn" 
                    [disabled]="loginForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading" class="spinner"></mat-spinner>
              <mat-icon *ngIf="!isLoading">login</mat-icon>
              <span *ngIf="!isLoading">Iniciar Sesión</span>
            </button>
          </form>

          <div class="error-message" *ngIf="errorMessage">
            <mat-icon>error</mat-icon>
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    // Header azul con logo PRM
    .header-section {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 50%, #1e3a8a 100%);
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px 20px;
      color: white;
      text-align: center;
    }

    .logo-container {
      margin-bottom: 30px;
    }

    .prm-logo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.1);
      padding: 10px;
    }

    .system-title {
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: white;
    }

    .system-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-weight: 300;
    }

    // Sección de login blanca
    .login-section {
      background: white;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
    }

    .login-title {
      font-size: 28px;
      font-weight: 600;
      color: #1e293b;
      text-align: center;
      margin: 0 0 40px 0;
    }

    .form-group {
      margin-bottom: 24px;
      position: relative;
    }

    .input-icon {
      color: #3b82f6;
      font-size: 20px;
      margin-bottom: 8px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: border-color 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
      
      &::placeholder {
        color: #9ca3af;
      }
    }

    .password-container {
      position: relative;
    }

    .password-input {
      padding-right: 50px;
    }

    .password-toggle {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      
      mat-icon {
        font-size: 20px;
      }
    }

    .login-btn {
      width: 100%;
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      color: white;
      border: none;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.2s ease;
      margin-top: 32px;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      
      mat-icon {
        font-size: 20px;
      }
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      
      mat-icon {
        font-size: 18px;
      }
    }

    .spinner {
      color: white;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      margin-top: 16px;
      padding: 8px;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .register-link {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link:hover {
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
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirigir según el rol del usuario
          if (response.user.role === 'super_admin') {
            this.router.navigate(['/admin']);
          } else if (response.user.role === 'ejecutivo') {
            this.router.navigate(['/dashboard/ejecutivo']);
          } else {
            this.router.navigate([`/dashboard/${response.user.role}`]);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        }
      });
    }
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}
