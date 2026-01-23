import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ElectoralService } from '../../../services/electoral.service';
import { Voter, Candidate } from '../../../models/electoral.model';

@Component({
  selector: 'app-mobile-voting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-voting.component.html',
  styleUrls: ['./mobile-voting.component.scss']
})
export class MobileVotingComponent implements OnInit {
  voters = signal<Voter[]>([]);
  candidates = signal<Candidate[]>([]);
  selectedVoter = signal<Voter | null>(null);
  selectedCandidate = signal<Candidate | null>(null);
  mesa = signal<string>('');
  currentView = signal<'voters' | 'candidates' | 'confirm'>('voters');
  loading = signal<boolean>(true);

  constructor(
    private electoralService: ElectoralService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.mesa.set(params['mesa'] || 'Mesa 15');
      this.loadVoters();
    });
    this.loadCandidates();
  }

  loadVoters(): void {
    this.electoralService.getVoters(this.mesa()).subscribe({
      next: (voters) => {
        this.voters.set(voters);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading voters:', err);
        this.loading.set(false);
      }
    });
  }

  loadCandidates(): void {
    this.electoralService.getCandidates().subscribe({
      next: (candidates) => {
        this.candidates.set(candidates);
      },
      error: (err) => console.error('Error loading candidates:', err)
    });
  }

  selectVoter(voter: Voter): void {
    this.selectedVoter.set(voter);
    this.currentView.set('candidates');
  }

  selectCandidate(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
    this.currentView.set('confirm');
  }

  confirmVote(): void {
    if (this.selectedVoter() && this.selectedCandidate()) {
      this.electoralService.confirmVote(
        this.selectedVoter()!.id,
        this.selectedCandidate()!.id
      ).subscribe({
        next: () => {
          alert('Voto confirmado exitosamente');
          this.resetVoting();
        },
        error: (err) => {
          console.error('Error confirming vote:', err);
          alert('Error al confirmar el voto');
        }
      });
    }
  }

  resetVoting(): void {
    this.selectedVoter.set(null);
    this.selectedCandidate.set(null);
    this.currentView.set('voters');
    this.loadVoters();
  }

  goBack(): void {
    if (this.currentView() === 'confirm') {
      this.currentView.set('candidates');
    } else if (this.currentView() === 'candidates') {
      this.currentView.set('voters');
      this.selectedVoter.set(null);
    }
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  getConfirmedCount(): number {
    return this.voters().filter(v => v.status === 'confirmed').length;
  }

  getVotedCount(): number {
    return this.voters().filter(v => v.status === 'voted').length;
  }

  getPendingCount(): number {
    return this.voters().filter(v => v.status === 'pending').length;
  }
}
