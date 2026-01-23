import { Component, Input, OnInit, AfterViewInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Region } from '../../../models/electoral.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() regions: Region[] = [];
  
  private map: any = null;
  private L: any = null;
  mapReady = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeaflet();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  private async loadLeaflet(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.L = await import('leaflet');
      this.fixLeafletIconPath();
    }
  }

  private fixLeafletIconPath(): void {
    if (!this.L) return;
    
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = this.L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    this.L.Marker.prototype.options.icon = iconDefault;
  }

  private initMap(): void {
    if (!this.L || !isPlatformBrowser(this.platformId)) return;

    const mapElement = document.getElementById('electoral-map');
    if (!mapElement) return;

    // Inicializar mapa centrado en República Dominicana con zoom ajustado
    this.map = this.L.map('electoral-map', {
      center: [18.7357, -70.1627],
      zoom: 7.5,
      zoomControl: true,
      scrollWheelZoom: true
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.addRegionMarkers();
    
    // Ajustar vista para mostrar todos los marcadores
    if (this.regions.length > 0) {
      const bounds = this.L.latLngBounds(this.regions.map(r => r.coordinates));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    this.mapReady.set(true);
  }

  private addRegionMarkers(): void {
    if (!this.map || !this.L) return;

    this.regions.forEach(region => {
      if (this.map && this.L) {
        const marker = this.L.circleMarker(region.coordinates, {
          radius: 15,
          fillColor: region.color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(this.map);

        marker.bindPopup(`
          <div class="map-popup">
            <h3>${region.name}</h3>
            <p><strong>Votos:</strong> ${region.votes.toLocaleString()}</p>
            <p><strong>Porcentaje:</strong> ${region.percentage}%</p>
          </div>
        `);
      }
    });
  }
}
