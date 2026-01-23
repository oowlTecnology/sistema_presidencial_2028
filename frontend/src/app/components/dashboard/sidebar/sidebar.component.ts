import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  category: 'desktop' | 'mobile';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isCollapsed = signal<boolean>(false);
  
  menuItems: MenuItem[] = [
    { label: 'Gestión Electoral', route: '/dashboard-electoral', icon: '📊', category: 'desktop' },
    { label: 'Comparativa 2024', route: '/comparativa', icon: '🗺️', category: 'desktop' },
    { label: 'Mesa Situacional', route: '/mesa-situacional', icon: '⚠️', category: 'desktop' },
    { label: 'Colegio Detalle', route: '/colegio-detalle', icon: '🏫', category: 'desktop' },
    { label: 'Mi Lista', route: '/mobile-voting', icon: '📱', category: 'mobile' },
    { label: 'Ruta Día D', route: '/mobile-voting', icon: '🗓️', category: 'mobile' },
    { label: 'Confirmar Voto', route: '/mobile-voting', icon: '✅', category: 'mobile' },
    { label: 'Reporte Día D', route: '/mobile-voting', icon: '📋', category: 'mobile' }
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  getDesktopItems(): MenuItem[] {
    return this.menuItems.filter(item => item.category === 'desktop');
  }

  getMobileItems(): MenuItem[] {
    return this.menuItems.filter(item => item.category === 'mobile');
  }
}
