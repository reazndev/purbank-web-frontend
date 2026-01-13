import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MobileDetectionService } from './shared/services/mobile-detection.service';
import { MobileWarningComponent } from './shared/mobile-warning/mobile-warning.component';
import { MobileVerifyModalComponent } from './components/mobile-verify-modal/mobile-verify-modal.component';
import { MobileVerifyService } from './shared/services/mobile-verify.service';
import { SessionService } from './shared/services/session.service';
import { SessionTimeoutModalComponent } from './components/session-timeout-modal/session-timeout-modal.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MobileWarningComponent, MobileVerifyModalComponent, SessionTimeoutModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly mobileDetectionService = inject(MobileDetectionService);
  private readonly mobileVerifyService = inject(MobileVerifyService);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService); // Initialize service
  
  mobileVerifyCode = signal<string | null>(null);
  currentUrl = signal<string>('');

  shouldShowMobileWarning = computed(() => {
    const isMobile = this.mobileDetectionService.getIsMobile()();
    const url = this.currentUrl();
    if (!isMobile) return false;
    // Allow support, create-account and showcase on mobile
    if (url.includes('/support') || url.includes('/create-account') || url.includes('/showcase')) {
      return false;
    }
    return true;
  });

  constructor() {
    this.mobileVerifyService.verifyRequest$.subscribe(code => {
      this.mobileVerifyCode.set(code);
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.url);
    });
  }

  onVerified() {
    this.mobileVerifyCode.set(null);
    this.mobileVerifyService.completeVerification(true);
  }

  onRejected() {
    this.mobileVerifyCode.set(null);
    this.mobileVerifyService.completeVerification(false);
  }

  onClosed() {
    this.mobileVerifyCode.set(null);
    this.mobileVerifyService.completeVerification(false);
  }
}
