import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MobileDetectionService } from '../services/mobile-detection.service';

export const mobileRedirectGuard: CanActivateFn = (route, state) => {
  const mobileService = inject(MobileDetectionService);
  const router = inject(Router);

  // Check if it's mobile
  if (mobileService.getIsMobile()()) {
    router.navigate(['/showcase']);
    return false;
  }
  
  return true;
};
