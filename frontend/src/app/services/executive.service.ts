import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export interface EstadisticasEjecutivas {
  resumen: {
    totalSuperAdmins: number
    totalEjecutivos: number
    totalProvinciales: number
    totalMunicipales: number
    totalCircunscripciones: number
    totalColegios: number
    totalRecintos: number
    totalUsuariosActivos: number
    totalUsuariosInactivos: number
    totalFidelizaciones: number
    totalPadron: number
    porcentajeFidelizacion: number
  }
  estadisticasPorProvincia: any[]
  topCoordinadores: any[]
  tendencias: {
    fidelizacionesUltimos7Dias: number
    usuariosNuevosUltimos7Dias: number
  }
  sugerencias: any[]
}

@Injectable({
  providedIn: 'root'
})
export class ExecutiveService {
  private apiUrl = `${environment.apiUrl}/executive`

  constructor(private http: HttpClient) {}

  getEstadisticasEjecutivas(): Observable<EstadisticasEjecutivas> {
    return this.http.get<EstadisticasEjecutivas>(`${this.apiUrl}/estadisticas`)
  }
}
