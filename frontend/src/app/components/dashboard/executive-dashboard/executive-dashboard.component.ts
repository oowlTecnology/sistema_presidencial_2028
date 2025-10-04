import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AuthService } from '../../../services/auth.service';
import { ExecutiveService, EstadisticasEjecutivas } from '../../../services/executive.service';
import { User } from '../../../models/user.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-executive-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatPaginatorModule,
    NgChartsModule
  ],
  templateUrl: './executive-dashboard.component.html',
  styleUrl: './executive-dashboard.component.scss'
})
export class ExecutiveDashboardComponent implements OnInit, AfterViewInit {
  currentUser: User | null = null
  estadisticas: EstadisticasEjecutivas | null = null
  cargando = false
  private map: L.Map | null = null
  
  // Paginación
  pageSize = 5
  pageIndex = 0
  get paginatedProvincias() {
    if (!this.estadisticas?.estadisticasPorProvincia) return []
    const start = this.pageIndex * this.pageSize
    const end = start + this.pageSize
    return this.estadisticas.estadisticasPorProvincia.slice(start, end)
  }

  // Gráficos
  pieChartType: ChartType = 'pie'
  doughnutChartType: ChartType = 'doughnut'
  barChartType: ChartType = 'bar'
  lineChartType: ChartType = 'line'
  radarChartType: ChartType = 'radar'

  // Datos de gráficos
  coordinadoresChartData: ChartData<'doughnut'> = { labels: [], datasets: [] }
  fidelizacionChartData: ChartData<'pie'> = { labels: [], datasets: [] }
  topCoordinadoresChartData: ChartData<'bar'> = { labels: [], datasets: [] }
  tendenciasChartData: ChartData<'line'> = { labels: [], datasets: [] }
  provinciasCoberturaChartData: ChartData<'radar'> = { labels: [], datasets: [] }

  // Opciones de gráficos
  doughnutOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: false }
    }
  }

  pieOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false }
    }
  }

  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: { beginAtZero: true }
    }
  }

  lineOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false }
    }
  }

  radarOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false }
    }
  }

  constructor(
    private authService: AuthService,
    private executiveService: ExecutiveService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser()
    this.cargarEstadisticas()
  }

  ngAfterViewInit() {
    // Inicializar mapa después de que la vista esté lista
    setTimeout(() => {
      if (this.estadisticas) {
        this.initMap()
        this.loadAndColorSVGMap()
      }
    }, 500)
  }

  cargarEstadisticas() {
    this.cargando = true
    console.log('[ExecutiveDashboard] Cargando estadísticas...')
    this.executiveService.getEstadisticasEjecutivas().subscribe({
      next: (stats) => {
        console.log('[ExecutiveDashboard] Estadísticas recibidas:', stats)
        this.estadisticas = stats
        this.generarGraficos(stats)
        this.cargando = false
        console.log('[ExecutiveDashboard] Gráficos generados')
        // Inicializar mapas después de cargar datos
        setTimeout(() => {
          this.initMap()
          this.loadAndColorSVGMap()
        }, 100)
      },
      error: (error) => {
        console.error('[ExecutiveDashboard] Error al cargar estadísticas:', error)
        this.cargando = false
      }
    })
  }

  generarGraficos(stats: EstadisticasEjecutivas) {
    console.log('[ExecutiveDashboard] Generando gráficos con datos:', stats.resumen)
    
    // Gráfico Doughnut: Distribución de Coordinadores
    this.coordinadoresChartData = {
      labels: ['Provinciales', 'Municipales', 'Circunscripción', 'Colegios', 'Recintos'],
      datasets: [{
        data: [
          stats.resumen.totalProvinciales,
          stats.resumen.totalMunicipales,
          stats.resumen.totalCircunscripciones,
          stats.resumen.totalColegios,
          stats.resumen.totalRecintos
        ],
        backgroundColor: ['#321fdb', '#3399ff', '#39f', '#2eb85c', '#f9b115']
      }]
    }
    console.log('[ExecutiveDashboard] Coordinadores chart data:', this.coordinadoresChartData)

    // Gráfico Pie: Fidelización
    const fidelizados = stats.resumen.totalFidelizaciones
    const noFidelizados = stats.resumen.totalPadron - fidelizados
    this.fidelizacionChartData = {
      labels: ['Fidelizados', 'Pendientes'],
      datasets: [{
        data: [fidelizados, noFidelizados],
        backgroundColor: ['#4CAF50', '#FF5252']
      }]
    }

    // Gráfico de Barras: Top Coordinadores
    if (stats.topCoordinadores && stats.topCoordinadores.length > 0) {
      this.topCoordinadoresChartData = {
        labels: stats.topCoordinadores.map(c => c.nombre),
        datasets: [{
          label: 'Fidelizaciones',
          data: stats.topCoordinadores.map(c => c.fidelizaciones),
          backgroundColor: '#FFD700',
          borderColor: '#FFA500',
          borderWidth: 2
        }]
      }
    }

    // Gráfico Radar: Cobertura por Provincia (top 10)
    const top10Provincias = stats.estadisticasPorProvincia
      .sort((a, b) => b.totalCoordinadores - a.totalCoordinadores)
      .slice(0, 10)

    this.provinciasCoberturaChartData = {
      labels: top10Provincias.map(p => p.provincia),
      datasets: [{
        label: 'Coordinadores',
        data: top10Provincias.map(p => p.totalCoordinadores),
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#667eea'
      }]
    }
  }

  getSugerenciaTipo(tipo: string): string {
    const tipos: any = {
      'critico': 'warn-suggestion',
      'importante': 'info-suggestion',
      'exito': 'success-suggestion',
      'info': 'default-suggestion'
    }
    return tipos[tipo] || 'default-suggestion'
  }

  getProvinciaX(index: number): number {
    const cols = 8
    return (index % cols) * 100 + 10
  }

  getProvinciaY(index: number): number {
    const cols = 8
    return Math.floor(index / cols) * 80 + 10
  }

  getProvinciaColor(cobertura: string): string {
    const colores: any = {
      'alta': '#2eb85c',
      'media': '#3399ff',
      'baja': '#e55353'
    }
    return colores[cobertura] || '#e55353'
  }

  getProvinciaShortName(nombre: string): string {
    // Acortar nombres largos para que quepan en el SVG
    if (nombre.length > 12) {
      return nombre.substring(0, 10) + '...'
    }
    return nombre
  }

  initMap() {
    if (this.map) {
      this.map.remove()
    }

    // Crear mapa centrado en República Dominicana
    this.map = L.map('leaflet-map').setView([18.7357, -70.1627], 8)

    // Agregar capa de tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map)

    // Agregar marcadores por provincia
    if (this.estadisticas && this.estadisticas.estadisticasPorProvincia) {
      this.estadisticas.estadisticasPorProvincia.forEach((prov: any) => {
        const coords = this.getProvinciaCoords(prov.provincia)
        if (coords) {
          const color = this.getProvinciaColor(prov.cobertura)
          
          // Crear círculo con color según cobertura
          const circle = L.circleMarker(coords, {
            radius: 15 + (prov.totalCoordinadores * 3),
            fillColor: color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(this.map!)

          // Popup con información detallada
          const popupContent = `
            <div class="provincia-popup">
              <h3 style="margin: 0 0 12px 0; color: ${color}; font-size: 1.1rem; border-bottom: 2px solid ${color}; padding-bottom: 8px;">
                ${prov.provincia}
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                <div style="text-align: center; padding: 8px; background: #f0f3f5; border-radius: 4px;">
                  <div style="font-size: 1.5rem; font-weight: 600; color: #321fdb;">${prov.coordinadoresProvinciales}</div>
                  <div style="font-size: 0.75rem; color: #768192;">Provinciales</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #f0f3f5; border-radius: 4px;">
                  <div style="font-size: 1.5rem; font-weight: 600; color: #3399ff;">${prov.coordinadoresMunicipales}</div>
                  <div style="font-size: 0.75rem; color: #768192;">Municipales</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #f0f3f5; border-radius: 4px;">
                  <div style="font-size: 1.5rem; font-weight: 600; color: #39f;">${prov.coordinadoresCircunscripcion}</div>
                  <div style="font-size: 0.75rem; color: #768192;">Circunscripción</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #f0f3f5; border-radius: 4px;">
                  <div style="font-size: 1.5rem; font-weight: 600; color: #2eb85c;">${prov.totalCoordinadores}</div>
                  <div style="font-size: 0.75rem; color: #768192;">Total</div>
                </div>
              </div>
              <div style="padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.75rem; font-weight: 700;">${prov.fidelizaciones}</div>
                <div style="font-size: 0.85rem; opacity: 0.9;">Fidelizaciones Totales</div>
              </div>
              <div style="margin-top: 12px; padding: 8px; background: ${color}20; border-radius: 4px; text-align: center;">
                <strong style="color: ${color};">Cobertura: ${prov.cobertura === 'alta' ? 'Alta ✓' : prov.cobertura === 'media' ? 'Media ○' : 'Baja ✗'}</strong>
              </div>
            </div>
          `
          
          circle.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
          })

          // Hacer zoom al hacer clic
          circle.on('click', () => {
            this.map?.flyTo(coords, 11, {
              duration: 1.5,
              easeLinearity: 0.25
            })
          })
        }
      })
    }
  }

  getProvinciaCoords(provincia: string): [number, number] | null {
    // Coordenadas aproximadas de las provincias de RD
    const coords: { [key: string]: [number, number] } = {
      'SANTO DOMINGO': [18.4861, -69.9312],
      'DISTRITO NACIONAL': [18.4861, -69.9312],
      'SANTIAGO': [19.4517, -70.6970],
      'LA VEGA': [19.2167, -70.5333],
      'SAN CRISTOBAL': [18.4167, -70.1000],
      'DUARTE': [19.2167, -70.0333],
      'PUERTO PLATA': [19.7933, -70.6867],
      'LA ALTAGRACIA': [18.5833, -68.4167],
      'SAN PEDRO DE MACORIS': [18.4539, -69.3028],
      'ESPAILLAT': [19.6167, -70.5167],
      'BARAHONA': [18.2083, -71.1000],
      'AZUA': [18.4500, -70.7333],
      'PERAVIA': [18.2833, -70.3333],
      'MONTE PLATA': [18.8167, -69.7833],
      'HATO MAYOR': [18.7667, -69.2500],
      'EL SEIBO': [18.7667, -69.0333],
      'SAN JUAN': [18.8167, -71.2333],
      'MARIA TRINIDAD SANCHEZ': [19.3833, -69.8500],
      'SAMANA': [19.2067, -69.3367],
      'BAORUCO': [18.4833, -71.4167],
      'MONTE CRISTI': [19.8500, -71.6500],
      'DAJABON': [19.5500, -71.7083],
      'SANTIAGO RODRIGUEZ': [19.4667, -71.3333],
      'VALVERDE': [19.5833, -70.9833],
      'ELIAS PINA': [18.8833, -71.6833],
      'INDEPENDENCIA': [18.6833, -71.7333],
      'PEDERNALES': [18.0333, -71.7333],
      'LA ROMANA': [18.4275, -68.9728],
      'SAN JOSE DE OCOA': [18.5500, -70.5000],
      'HERMANAS MIRABAL': [19.3667, -70.3667],
      'MONSENOR NOUEL': [18.9167, -70.3667]
    }
    return coords[provincia.toUpperCase()] || null
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
  }

  logout() {
    this.authService.logout()
  }

  async loadAndColorSVGMap() {
    try {
      const response = await fetch('assets/dominican-republic.svg')
      const svgText = await response.text()
      const container = document.getElementById('svg-map-container')
      
      if (container) {
        container.innerHTML = svgText
        const svgElement = container.querySelector('svg')
        
        if (svgElement && this.estadisticas) {
          // Obtener dimensiones originales del SVG
          const originalWidth = svgElement.getAttribute('width') || '792.71484'
          const originalHeight = svgElement.getAttribute('height') || '556.42358'
          
          // Establecer viewBox si no existe
          if (!svgElement.getAttribute('viewBox')) {
            svgElement.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`)
          }
          
          // Ajustar tamaño del SVG
          svgElement.removeAttribute('width')
          svgElement.removeAttribute('height')
          svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet')
          svgElement.style.width = '100%'
          svgElement.style.height = 'auto'
          svgElement.style.maxWidth = '100%'
          svgElement.style.margin = '0 auto'
          svgElement.style.display = 'block'
          
          // Colorear cada provincia según sus datos
          this.estadisticas.estadisticasPorProvincia.forEach((prov: any) => {
            const provinciaName = this.normalizeProvinciaName(prov.provincia)
            const paths = svgElement.querySelectorAll('path')
            
            paths.forEach((path) => {
              const title = path.getAttribute('title')
              if (title && this.normalizeProvinciaName(title) === provinciaName) {
                const color = this.getProvinciaColorForSVG(prov.totalCoordinadores)
                path.setAttribute('fill', color)
                path.setAttribute('stroke', '#ffffff')
                path.setAttribute('stroke-width', '1.5')
                path.style.cursor = 'pointer'
                path.style.transition = 'all 0.3s ease'
                
                // Agregar tooltip y eventos
                path.addEventListener('mouseenter', () => {
                  path.setAttribute('fill', this.lightenColor(color, 20))
                  path.setAttribute('stroke-width', '3')
                  this.showTooltip(prov, path)
                })
                
                path.addEventListener('mouseleave', () => {
                  path.setAttribute('fill', color)
                  path.setAttribute('stroke-width', '1.5')
                  this.hideTooltip()
                })
              }
            })
          })
        }
      }
    } catch (error) {
      console.error('Error al cargar el mapa SVG:', error)
    }
  }

  normalizeProvinciaName(name: string): string {
    return name.toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  getProvinciaColorForSVG(totalCoordinadores: number): string {
    if (totalCoordinadores >= 3) {
      return '#2eb85c' // Verde - Alta cobertura
    } else if (totalCoordinadores >= 1) {
      return '#3399ff' // Azul - Media cobertura
    } else {
      return '#e0e0e0' // Gris - Sin coordinadores
    }
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1)
  }

  showTooltip(prov: any, element: SVGPathElement) {
    const tooltip = document.createElement('div')
    tooltip.id = 'svg-tooltip'
    tooltip.className = 'svg-tooltip'
    tooltip.innerHTML = `
      <div class="tooltip-header">${prov.provincia}</div>
      <div class="tooltip-body">
        <div class="tooltip-row">
          <span>Provinciales:</span>
          <strong>${prov.coordinadoresProvinciales}</strong>
        </div>
        <div class="tooltip-row">
          <span>Municipales:</span>
          <strong>${prov.coordinadoresMunicipales}</strong>
        </div>
        <div class="tooltip-row">
          <span>Circunscripción:</span>
          <strong>${prov.coordinadoresCircunscripcion}</strong>
        </div>
        <div class="tooltip-row total">
          <span>Total Coordinadores:</span>
          <strong>${prov.totalCoordinadores}</strong>
        </div>
        <div class="tooltip-row fidelizaciones">
          <span>Fidelizaciones:</span>
          <strong>${prov.fidelizaciones}</strong>
        </div>
      </div>
    `
    document.body.appendChild(tooltip)
    
    const rect = element.getBoundingClientRect()
    tooltip.style.left = rect.left + rect.width / 2 + 'px'
    tooltip.style.top = rect.top - 10 + 'px'
  }

  hideTooltip() {
    const tooltip = document.getElementById('svg-tooltip')
    if (tooltip) {
      tooltip.remove()
    }
  }
}
