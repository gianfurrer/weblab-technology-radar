import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@shared/services/auth/auth.service";
import { Role, User } from "@shared/types/user";
import { firstValueFrom } from "rxjs";

export const isLoggedOut: CanActivateFn = async () => {
  const authService: AuthService = inject(AuthService);
  const user: User | null = await firstValueFrom(authService.getUser());
  return user === null;
};

export function hasRole(roles: Role[]): CanActivateFn {
  return async () => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    const user: User | null = await firstValueFrom(authService.getUser());
    if (user == null) {
      router.navigateByUrl("/login");
      return false;
    }

    if (!roles.includes(user.role)) {
      return false;
    }

    return true;
  };
}
