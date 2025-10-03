import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../models/user.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
  }

  // Cambiar contraseña de un usuario
  changeUserPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, {
      userId,
      newPassword
    })
  }

  // Cambiar rol de un usuario
  changeUserRole(userId: number, newRole: string, hierarchyData?: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-role`, {
      userId,
      newRole,
      ...hierarchyData
    })
  }

  // Activar/Desactivar usuario
  toggleUserStatus(userId: number, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/status`, {
      isActive
    })
  }

  // Eliminar usuario
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`)
  }
}
