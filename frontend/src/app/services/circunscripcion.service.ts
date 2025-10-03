import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface Circunscripcion {
  ID: number
  IDProvincia: number
  CodigoCircunscripcion: string
  Descripcion: string
}

@Injectable({ providedIn: 'root' })
export class CircunscripcionService {
  private apiUrl = 'http://localhost:3000/api/circunscripciones'

  constructor(private http: HttpClient) {}

  getCircunscripcionesByProvincia(provinciaId: number): Observable<Circunscripcion[]> {
    return this.http.get<Circunscripcion[]>(
      `${this.apiUrl}?provinciaId=${provinciaId}`
    )
  }
}
