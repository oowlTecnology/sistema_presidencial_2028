export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  EJECUTIVO = 'ejecutivo',
  PROVINCIAL = 'provincial',
  MUNICIPAL = 'municipal',
  CIRCUNSCRIPCION = 'circunscripcion',
  COLEGIO = 'colegio',
  RECINTO = 'recinto',
  FUNCIONARIOS = 'funcionarios'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  phoneNumber?: string;
  address?: string;
  provinciaId?: number;
  municipioId?: number;
  circunscripcionId?: number;
  colegioId?: number;
  recintoId?: number;
  createdByUserId?: number;
  provincia?: any;
  municipio?: any;
  circunscripcion?: any;
  colegio?: any;
  recinto?: any;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phoneNumber?: string;
  address?: string;
  provinciaId?: number;
  municipioId?: number;
  circunscripcionId?: number;
  colegioId?: number;
  recintoId?: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
