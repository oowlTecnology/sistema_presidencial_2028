import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectoralData } from '../../../models/electoral.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
  @Input() data: ElectoralData | null = null;

  get progressPercentage(): number {
    if (!this.data) return 0;
    return (this.data.totalVotes / this.data.goalVotes) * 100;
  }

  get remainingVotes(): number {
    if (!this.data) return 0;
    return this.data.goalVotes - this.data.totalVotes;
  }
}
