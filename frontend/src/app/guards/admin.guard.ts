import { inject } from '@angular/core'
import { Router, CanActivateFn } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { UserRole } from '../models/user.model'

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const currentUser = authService.getCurrentUser()

  if (!currentUser) {
    router.navigate(['/login'])
    return false
  }

  if (currentUser.role !== UserRole.SUPER_ADMIN) {
    router.navigate([`/dashboard/${currentUser.role}`])
    return false
  }

  return true
}
