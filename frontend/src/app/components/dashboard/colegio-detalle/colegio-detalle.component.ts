import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-colegio-detalle',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './colegio-detalle.component.html',
  styleUrls: ['./colegio-detalle.component.scss']
})
export class ColegioDetalleComponent implements OnInit {
  colegioData = signal<any>({
    nombre: 'Colegio San Martín Mesa 1',
    candidato: 'Juan Pérez',
    porcentaje: 69.0,
    votos: 345,
    totalVotantes: 500
  });

  votantes = signal<any[]>([]);
  
  public pieChartData = signal<ChartConfiguration<'pie'>['data']>({
    labels: ['Confirmados', 'Votaron', 'Pendientes'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b']
    }]
  });

  public pieChartType: ChartType = 'pie';

  ngOnInit(): void {
    this.loadVotantes();
  }

  loadVotantes(): void {
    this.votantes.set([
      { nombre: 'María Gómez', estado: 'Confirmado', hora: '08:30 AM' },
      { nombre: 'Jorge Medina', estado: 'Votó', hora: '09:15 AM' },
      { nombre: 'Ana Torres', estado: 'Confirmado', hora: '10:00 AM' },
      { nombre: 'Luis Castillo', estado: 'Votó', hora: '10:30 AM' }
    ]);
  }
}
