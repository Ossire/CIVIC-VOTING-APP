import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const errorService = inject(ErrorService);

  const expectedRole = route.data['expectedRole'];
  const user = authService.currentUser();

  if (user && user.role === expectedRole) {
    return true;
  }

  let fallback = '/login';

  if (user?.role === 'admin') {
    fallback = '/admin/dashboard';
  } else if (user?.role === 'user') {
    fallback = '/polls';
  }

  if (state.url === fallback) {
    return router.parseUrl('/login');
  }

  errorService.handleError({
    message: 'ACCESS_DENIED: Your account role does not permit access to this terminal path.',
  });

  return router.parseUrl(fallback);
};
