import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { CanActivateFn } from '@angular/router'
import { AuthService } from '../services/auth.service'

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService)
    const router = inject(Router)

    if (!authService.isAuthenticated()) {
      router.navigate(['/login'])
      return false
    }

    if (authService.hasAnyRole(allowedRoles)) {
      return true
    }

    // Redirigir al dashboard correspondiente si no tiene permisos
    const user = authService.getCurrentUser()
    if (user) {
      router.navigate([`/dashboard/${user.role}`])
    } else {
      router.navigate(['/login'])
    }

    return false
  }
}

