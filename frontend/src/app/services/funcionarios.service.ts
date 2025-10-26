import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Funcionario {
  id: number;
  cargo: string;
  nombre: string;
  cedula: string;
  telefono: string;
  municipio: string;
  municipioId: number;
  fotoBase64: string | null;
  nombreCompleto: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FuncionariosResponse {
  success: boolean;
  data: Funcionario[];
  count: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {
  private apiUrl = `${environment.apiUrl}/funcionarios`;

  constructor(private http: HttpClient) { }

  getFuncionarios(): Observable<FuncionariosResponse> {
    return this.http.get<FuncionariosResponse>(this.apiUrl);
  }

  getFuncionariosByProvincia(provinciaId: number): Observable<FuncionariosResponse> {
    return this.http.get<FuncionariosResponse>(`${this.apiUrl}/provincia/${provinciaId}`);
  }

  getFuncionariosByMunicipio(municipioId: number): Observable<FuncionariosResponse> {
    return this.http.get<FuncionariosResponse>(`${this.apiUrl}/municipio/${municipioId}`);
  }

  getFuncionarioById(id: number): Observable<{ success: boolean; data: Funcionario }> {
    return this.http.get<{ success: boolean; data: Funcionario }>(`${this.apiUrl}/${id}`);
  }

  createFuncionario(funcionario: Partial<Funcionario>): Observable<{ success: boolean; data: Funcionario; message: string }> {
    return this.http.post<{ success: boolean; data: Funcionario; message: string }>(this.apiUrl, funcionario);
  }

  updateFuncionario(id: number, funcionario: Partial<Funcionario>): Observable<{ success: boolean; data: Funcionario; message: string }> {
    return this.http.put<{ success: boolean; data: Funcionario; message: string }>(`${this.apiUrl}/${id}`, funcionario);
  }

  deleteFuncionario(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
