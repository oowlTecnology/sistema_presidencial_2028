import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElectoralData, Candidate, Voter, VotingSession } from '../models/electoral.model';

@Injectable({
  providedIn: 'root'
})
export class ElectoralService {
  private apiUrl = 'http://localhost:3000/api';
  
  electoralData = signal<ElectoralData | null>(null);
  selectedCandidate = signal<Candidate | null>(null);
  darkMode = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadElectoralData();
  }

  loadElectoralData(): void {
    this.http.get<ElectoralData>(`${this.apiUrl}/electoral-data`).subscribe({
      next: (data) => this.electoralData.set(data),
      error: (err) => console.error('Error loading electoral data:', err)
    });
  }

  getElectoralData(): Observable<ElectoralData> {
    return this.http.get<ElectoralData>(`${this.apiUrl}/electoral-data`);
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/candidates`);
  }

  getVoters(mesa: string): Observable<Voter[]> {
    return this.http.get<Voter[]>(`${this.apiUrl}/voters/${mesa}`);
  }

  confirmVote(voterId: string, candidateId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/vote`, { voterId, candidateId });
  }

  getVotingSession(sessionId: string): Observable<VotingSession> {
    return this.http.get<VotingSession>(`${this.apiUrl}/session/${sessionId}`);
  }

  toggleDarkMode(): void {
    this.darkMode.set(!this.darkMode());
  }
}
