import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, RegisterRequest } from '../models/user.model';

export interface MetaCoordinador {
  coordinador: string
  municipio?: string
  totalPersonasMunicipio?: number
  fidelizados: number
  meta: number
  porcentaje: number
}

export interface EstadisticasProvincial {
  totalMunicipales: number
  totalColegios: number
  totalRecintos: number
  metasMunicipales: MetaCoordinador[]
  metasColegios: MetaCoordinador[]
  metasRecintos: MetaCoordinador[]
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getEstadisticasProvincial(): Observable<EstadisticasProvincial> {
    return this.http.get<EstadisticasProvincial>(`${this.apiUrl}/users/estadisticas-provincial`);
  }

  createUser(userData: RegisterRequest): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(`${this.apiUrl}/users`, userData);
  }

  updateUser(id: number, userData: Partial<User>): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }
}







