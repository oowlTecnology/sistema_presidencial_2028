import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export interface PersonaPadron {
  cedula: string
  nombreCompleto: string
  nombres?: string
  apellido1?: string
  apellido2?: string
  colegioElectoral?: {
    codigo: string
    descripcion: string
  }
  foto?: string
  fidelizado: boolean
  fidelizadoPor?: {
    coordinador: string
    fecha: Date
  }
}

export interface PaginatedResponse {
  data: PersonaPadron[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface EstadisticasColegio {
  totalPersonas: number
  totalMasculinos: number
  totalFemeninos: number
  totalFidelizados: number
  metaFidelizacion: number
  porcentajeMeta: number
}

@Injectable({ providedIn: 'root' })
export class PadronService {
  private apiUrl = `${environment.apiUrl}/padron`

  constructor(private http: HttpClient) {}

  buscarPorCedula(cedula: string): Observable<PersonaPadron> {
    return this.http.get<PersonaPadron>(`${this.apiUrl}/buscar/${cedula}`)
  }

  getPersonasPorColegio(colegioId: number, page: number = 1, limit: number = 10): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(`${this.apiUrl}/colegio?colegioId=${colegioId}&page=${page}&limit=${limit}`)
  }

  getEstadisticas(colegioId: number): Observable<EstadisticasColegio> {
    return this.http.get<EstadisticasColegio>(`${this.apiUrl}/estadisticas?colegioId=${colegioId}`)
  }

  fidelizar(cedula: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/fidelizar`, { cedula })
  }
}
