import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export interface Colegio {
  IDColegio: number
  Descripcion: string
  IDMunicipio: number
}

@Injectable({ providedIn: 'root' })
export class ColegioService {
  private apiUrl = `${environment.apiUrl}/colegios`

  constructor(private http: HttpClient) {}

  getColegiosByMunicipio(municipioId: number): Observable<Colegio[]> {
    return this.http.get<Colegio[]>(`${this.apiUrl}?municipioId=${municipioId}`)
  }
}
