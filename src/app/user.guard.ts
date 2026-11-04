import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const userGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.role$.value;

  if (role === 'user' || role === 'manager') {
    return true;
  }
  router.navigate(['/']);
  return false;
};
