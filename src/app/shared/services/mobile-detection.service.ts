import { Injectable, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {
  private isMobile = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Check initial state
    this.checkMobileDevice();
    
    // Listen for window resize events with debouncing
    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(300), // Debounce resize events by 300ms
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
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