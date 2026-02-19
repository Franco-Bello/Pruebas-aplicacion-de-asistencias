import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Observamos el estado del usuario en Firebase
  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true; // Hay usuario, puede pasar
      } else {
        router.navigate(['/login']); // No hay usuario, a loguearse
        return false;
      }
    })
  );
};