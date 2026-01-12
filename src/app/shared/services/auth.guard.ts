import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AdminLoginService } from './admin-login.service';
import { UserAuthService } from './user-auth.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const adminLoginService = inject(AdminLoginService);
  const router = inject(Router);

  const isAuth = adminLoginService.isAuthenticated();
  const isAdminUser = adminLoginService.isAdmin();

  if (isAuth && isAdminUser) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

export const authGuard: CanActivateFn = (route, state) => {
  const adminLoginService = inject(AdminLoginService);
  const userAuthService = inject(UserAuthService);
  const router = inject(Router);

  // Check if user is authenticated via user auth service
  if (userAuthService.isAuthenticated()) {
    return true;
  }

  // Also check admin service for backwards compatibility
  if (adminLoginService.isAuthenticated()) {
    // Prevent admin users from accessing regular user pages
    if (adminLoginService.isAdmin()) {
      router.navigate(['/management']);
      return false;
    }
    return true;
  }

  // Not authenticated, redirect to login
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
  return false;
};
