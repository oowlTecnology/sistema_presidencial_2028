import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Gana tu Colegio 2028';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar autenticación al inicializar la app
    if (this.authService.isAuthenticated()) {
      this.authService.getProfile().subscribe({
        next: (user: User) => {
          // Redirigir al dashboard correspondiente si está autenticado
          this.router.navigate([`/dashboard/${user.role}`]);
        },
        error: () => {
          // Si hay error, limpiar token y redirigir al login
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
    }
  }
}









