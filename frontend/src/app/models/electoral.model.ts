export interface Candidate {
  id: string;
  name: string;
  photo: string;
  party: string;
  percentage: number;
  votes: number;
  status: 'confirmed' | 'pending' | 'rejected';
  color: string;
}

export interface Region {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  color: string;
  coordinates: [number, number];
}

export interface ElectoralData {
  totalVotes: number;
  goalVotes: number;
  currentPercentage: number;
  regions: Region[];
  candidates: Candidate[];
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  count: number;
}

export interface Voter {
  id: string;
  name: string;
  status: 'confirmed' | 'pending' | 'voted';
  photo: string;
  mesa: string;
}

export interface VotingSession {
  id: string;
  mesa: string;
  totalVoters: number;
  confirmedVotes: number;
  percentage: number;
}
