import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from '../stats/stats.component';
import { MapComponent } from '../map/map.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-mesa-situacional',
  standalone: true,
  imports: [CommonModule, StatsComponent, MapComponent],
  templateUrl: './mesa-situacional.component.html',
  styleUrls: ['./mesa-situacional.component.scss']
})
export class MesaSituacionalComponent implements OnInit, AfterViewInit {
  alerts = signal<any[]>([]);
  incidents = signal<any[]>([]);
  private map: L.Map | null = null;

  ngOnInit(): void {
    this.loadAlerts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  loadAlerts(): void {
    this.alerts.set([
      { id: 1, type: 'danger', title: 'Incidente en Mesa 15', message: 'Retraso en apertura de mesa', time: '08:30 AM', status: 'active', coords: [18.4861, -69.9312] },
      { id: 2, type: 'warning', title: 'Alerta Zona Norte', message: '2 mesas sin reportar', time: '09:15 AM', status: 'pending', coords: [19.4517, -70.6970] },
      { id: 3, type: 'danger', title: 'Incidente Reportado', message: 'Problema técnico en sistema', time: '10:00 AM', status: 'active', coords: [18.7357, -70.1627] },
      { id: 4, type: 'info', title: 'Actualización', message: 'Mesa 23 operativa', time: '10:30 AM', status: 'resolved', coords: [19.2167, -70.5333] }
    ]);

    this.incidents.set([
      { mesa: 'Mesa 15', colegio: 'Colegio San Martín', tipo: 'Técnico', prioridad: 'Alta', estado: 'En proceso', coords: [18.4861, -69.9312] },
      { mesa: 'Mesa 8', colegio: 'Escuela Central', tipo: 'Logístico', prioridad: 'Media', estado: 'Pendiente', coords: [19.4517, -70.6970] },
      { mesa: 'Mesa 23', colegio: 'Instituto Nacional', tipo: 'Técnico', prioridad: 'Alta', estado: 'Resuelto', coords: [18.7357, -70.1627] }
    ]);
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    const mapElement = document.getElementById('incidents-map');
    if (!mapElement) return;

    this.map = L.map('incidents-map').setView([18.7357, -70.1627], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.addIncidentMarkers();
  }

  addIncidentMarkers(): void {
    if (!this.map) return;

    this.alerts().forEach(alert => {
      if (alert.coords && this.map) {
        const color = alert.type === 'danger' ? '#ef4444' : 
                     alert.type === 'warning' ? '#f59e0b' : '#3b82f6';
        
        const marker = L.circleMarker(alert.coords as [number, number], {
          radius: 12,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(this.map);

        marker.bindPopup(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 1rem; font-weight: 600;">${alert.title}</h3>
            <p style="margin: 0 0 4px 0; font-size: 0.875rem;">${alert.message}</p>
            <p style="margin: 0; font-size: 0.75rem; color: #6b7280;">${alert.time}</p>
          </div>
        `);
      }
    });
  }

  getAlertIcon(type: string): string {
    const icons: any = {
      danger: '🚨',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[type] || '📢';
  }

  getPriorityClass(prioridad: string): string {
    return prioridad.toLowerCase();
  }
}
