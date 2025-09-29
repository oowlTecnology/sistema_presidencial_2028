import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

export interface Recinto {
  ID: number
  CodigoRecinto?: string
  Descripcion?: string
}

@Injectable({ providedIn: 'root' })
export class RecintoService {
  private apiUrl = `${environment.apiUrl}/recintos`

  constructor(private http: HttpClient) {}

  getRecintosByColegio(colegioId: number): Observable<Recinto[]> {
    return this.http.get<Recinto[]>(`${this.apiUrl}?colegioId=${colegioId}`)
  }
}
