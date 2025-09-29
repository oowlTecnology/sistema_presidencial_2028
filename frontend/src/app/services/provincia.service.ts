import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface Provincia {
  ID: number
  Descripcion: string
}

@Injectable({ providedIn: 'root' })
export class ProvinciaService {
  private apiUrl = 'http://localhost:3000/api/provincias'

  constructor(private http: HttpClient) {}

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.apiUrl)
  }
}
