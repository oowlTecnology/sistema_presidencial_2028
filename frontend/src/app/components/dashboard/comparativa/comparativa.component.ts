import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectoralService } from '../../../services/electoral.service';

@Component({
  selector: 'app-comparativa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparativa.component.html',
  styleUrls: ['./comparativa.component.scss']
})
export class ComparativaComponent implements OnInit {
  heatmapData = signal<any[]>([]);
  
  regions = [
    { name: 'Región 1', value: 85, color: '#ff6b9d' },
    { name: 'Región 2', value: 72, color: '#ffa07a' },
    { name: 'Región 3', value: 91, color: '#ff4757' },
    { name: 'Región 4', value: 68, color: '#ffd93d' },
    { name: 'Región 5', value: 78, color: '#6bcf7f' },
    { name: 'Región 6', value: 95, color: '#4ecdc4' },
    { name: 'Región 7', value: 82, color: '#5f27cd' },
    { name: 'Región 8', value: 70, color: '#ff8c94' }
  ];

  constructor(public electoralService: ElectoralService) {}

  ngOnInit(): void {
    this.loadHeatmapData();
    this.loadSVGMap();
  }

  loadHeatmapData(): void {
    this.heatmapData.set(this.regions);
  }

  async loadSVGMap(): Promise<void> {
    try {
      const response = await fetch('assets/dominican-republic.svg');
      const svgText = await response.text();
      const container = document.getElementById('svg-heatmap-container');
      
      if (container) {
        container.innerHTML = svgText;
        const svgElement = container.querySelector('svg');
        
        if (svgElement) {
          const originalWidth = svgElement.getAttribute('width') || '792.71484';
          const originalHeight = svgElement.getAttribute('height') || '556.42358';
          
          if (!svgElement.getAttribute('viewBox')) {
            svgElement.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
          }
          
          svgElement.removeAttribute('width');
          svgElement.removeAttribute('height');
          svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.maxWidth = '100%';
          svgElement.style.margin = '0 auto';
          svgElement.style.display = 'block';
          
          this.colorSVGProvinces(svgElement);
        }
      }
    } catch (error) {
      console.error('Error al cargar el mapa SVG:', error);
    }
  }

  colorSVGProvinces(svgElement: SVGElement): void {
    const paths = svgElement.querySelectorAll('path');
    const provinceColors: { [key: string]: string } = {
      'SANTO DOMINGO': '#ff6b9d',
      'DISTRITO NACIONAL': '#ffa07a',
      'SANTIAGO': '#ff4757',
      'LA VEGA': '#ffd93d',
      'SAN CRISTOBAL': '#6bcf7f',
      'DUARTE': '#4ecdc4',
      'PUERTO PLATA': '#5f27cd',
      'LA ALTAGRACIA': '#ff8c94'
    };

    paths.forEach((path) => {
      const title = path.getAttribute('title');
      if (title) {
        const normalizedTitle = title.toUpperCase().trim();
        const color = provinceColors[normalizedTitle] || '#e0e0e0';
        
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '1.5');
        path.style.cursor = 'pointer';
        path.style.transition = 'all 0.3s ease';
        
        path.addEventListener('mouseenter', () => {
          path.setAttribute('fill', this.lightenColor(color, 20));
          path.setAttribute('stroke-width', '3');
        });
        
        path.addEventListener('mouseleave', () => {
          path.setAttribute('fill', color);
          path.setAttribute('stroke-width', '1.5');
        });
      }
    });
  }

  lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }
}
