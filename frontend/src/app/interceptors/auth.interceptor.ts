import { HttpInterceptorFn } from '@angular/common/http'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Evitar dependencia circular con AuthService leyendo el token directamente
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    })
    return next(authReq)
  }

  return next(req)
}


