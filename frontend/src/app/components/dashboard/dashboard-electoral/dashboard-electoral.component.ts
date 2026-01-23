import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ElectoralService } from '../../../services/electoral.service';
import { ElectoralData } from '../../../models/electoral.model';
import { MapComponent } from '../map/map.component';
import { ChartsComponent } from '../charts/charts.component';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-dashboard-electoral',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatIconModule, MapComponent, ChartsComponent, StatsComponent],
  templateUrl: './dashboard-electoral.component.html',
  styleUrls: ['./dashboard-electoral.component.scss']
})
export class DashboardElectoralComponent implements OnInit {
  electoralData = signal<ElectoralData | null>(null);
  loading = signal<boolean>(true);
  sugerencias = signal<any[]>([]);

  constructor(public electoralService: ElectoralService) {}

  ngOnInit(): void {
    // Usar datos de ejemplo mientras no haya backend
    this.loadMockData();
  }

  loadMockData(): void {
    const mockData = {
      totalVotes: 125000,
      goalVotes: 200000,
      currentPercentage: 62.5,
      regions: [
        { id: '1', name: 'Santo Domingo', votes: 45000, percentage: 36, color: '#321fdb', coordinates: [18.4861, -69.9312] as [number, number] },
        { id: '2', name: 'Santiago', votes: 32000, percentage: 25.6, color: '#3399ff', coordinates: [19.4517, -70.6970] as [number, number] },
        { id: '3', name: 'La Vega', votes: 18000, percentage: 14.4, color: '#2eb85c', coordinates: [19.2167, -70.5333] as [number, number] },
        { id: '4', name: 'San Cristóbal', votes: 15000, percentage: 12, color: '#f9b115', coordinates: [18.4167, -70.1000] as [number, number] },
        { id: '5', name: 'Puerto Plata', votes: 15000, percentage: 12, color: '#e55353', coordinates: [19.7933, -70.6867] as [number, number] }
      ],
      candidates: [
        { id: '1', name: 'Juan Pérez', photo: '', party: 'Partido A', percentage: 45, votes: 56250, status: 'confirmed' as const, color: '#321fdb' },
        { id: '2', name: 'María González', photo: '', party: 'Partido B', percentage: 35, votes: 43750, status: 'confirmed' as const, color: '#3399ff' },
        { id: '3', name: 'Carlos Rodríguez', photo: '', party: 'Partido C', percentage: 20, votes: 25000, status: 'pending' as const, color: '#2eb85c' }
      ],
      alerts: [
        { id: '1', type: 'warning' as const, message: '3 mesas sin reportar en zona norte', count: 3 },
        { id: '2', type: 'info' as const, message: 'Actualización de datos en progreso', count: 1 }
      ]
    };

    this.electoralData.set(mockData);
    this.loading.set(false);
    this.loadSugerencias();
  }

  loadSugerencias(): void {
    const sugerencias = [
      {
        tipo: 'oportunidad',
        icono: 'trending_up',
        titulo: 'Zona de Crecimiento',
        descripcion: 'Santo Domingo muestra un incremento del 15% en participación. Considera reforzar la presencia en esta región.'
      },
      {
        tipo: 'alerta',
        icono: 'warning',
        titulo: 'Atención Requerida',
        descripcion: 'San Cristóbal tiene 3 mesas sin reportar. Se recomienda contacto inmediato con coordinadores locales.'
      },
      {
        tipo: 'exito',
        icono: 'check_circle',
        titulo: 'Meta Alcanzada',
        descripcion: 'Santiago superó la meta de participación en un 8%. Excelente trabajo del equipo local.'
      },
      {
        tipo: 'info',
        icono: 'info',
        titulo: 'Tendencia Positiva',
        descripcion: 'La participación general aumentó 5% comparado con la misma hora en elecciones anteriores.'
      }
    ];
    
    this.sugerencias.set(sugerencias);
  }

  get darkMode() {
    return this.electoralService.darkMode();
  }

  toggleTheme(): void {
    this.electoralService.toggleDarkMode();
  }
}
