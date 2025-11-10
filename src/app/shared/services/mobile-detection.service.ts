import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  private isMobile = signal<boolean>(false);

  constructor() {
    // Check initial state
    this.checkMobileDevice();
    
    // Listen for window resize events
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.checkMobileDevice();
      });
    }
  }

  private checkMobileDevice(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Check screen width (mobile phones typically have width <= 768px)
    const isMobileWidth = window.innerWidth <= 768;
    
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Consider it mobile if either condition is true
    this.isMobile.set(isMobileWidth || isMobileUserAgent);
  }

  getIsMobile() {
    return this.isMobile.asReadonly();
  }
}