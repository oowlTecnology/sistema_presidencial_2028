import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { environment } from '../../environments/environment'
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/user.model'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    // Verificar si hay un token guardado al inicializar el servicio
    const token = localStorage.getItem('token')
    if (token) {
      this.getProfile().subscribe()
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token)
          this.currentUserSubject.next(response.user)
        })
      )
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token)
          this.currentUserSubject.next(response.user)
        })
      )
  }

  getProfile(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/profile`)
      .pipe(tap((user) => this.currentUserSubject.next(user)))
  }

  logout(): void {
    localStorage.removeItem('token')
    this.currentUserSubject.next(null)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser()
    return user ? user.role === role : false
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser()
    return user ? roles.includes(user.role) : false
  }
}

