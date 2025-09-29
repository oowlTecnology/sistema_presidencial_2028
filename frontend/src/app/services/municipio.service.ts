import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface Municipio {
  ID: number
  Descripcion: string
  IDProvincia: number
}

@Injectable({ providedIn: 'root' })
export class MunicipioService {
  getMunicipios(): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(this.apiUrl)
  }
  private apiUrl = 'http://localhost:3000/api/municipios'

  constructor(private http: HttpClient) {}

  getMunicipiosByProvincia(provinciaId: number): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(
      `${this.apiUrl}?provinciaId=${provinciaId}`
    )
  }
}
