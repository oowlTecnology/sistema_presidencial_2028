import { Component, Input, OnInit, signal, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { Candidate } from '../../../models/electoral.model';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  @Input() candidates: Candidate[] = [];
  
  isBrowser = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    }
  };

  public pieChartData = signal<ChartConfiguration<'pie'>['data']>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  });

  public pieChartType: ChartType = 'pie';

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public barChartData = signal<ChartConfiguration<'bar'>['data']>({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderRadius: 8
    }]
  });

  public barChartType: ChartType = 'bar';

  ngOnInit(): void {
    this.updateCharts();
  }

  ngOnChanges(): void {
    this.updateCharts();
  }

  private updateCharts(): void {
    if (this.candidates.length === 0) return;

    const labels = this.candidates.map(c => c.name);
    const data = this.candidates.map(c => c.percentage);
    const colors = this.candidates.map(c => c.color);

    this.pieChartData.set({
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    });

    this.barChartData.set({
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderRadius: 8
      }]
    });
  }
}
