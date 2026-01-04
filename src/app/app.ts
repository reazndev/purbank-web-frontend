import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileDetectionService } from './shared/services/mobile-detection.service';
import { MobileWarningComponent } from './shared/mobile-warning/mobile-warning.component';
import { MobileVerifyModalComponent } from './components/mobile-verify-modal/mobile-verify-modal.component';
import { MobileVerifyService } from './shared/services/mobile-verify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MobileWarningComponent, MobileVerifyModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly mobileDetectionService = inject(MobileDetectionService);
  private readonly mobileVerifyService = inject(MobileVerifyService);
  
  mobileVerifyCode = signal<string | null>(null);

  constructor() {
    this.mobileVerifyService.verifyRequest$.subscribe(code => {
      this.mobileVerifyCode.set(code);
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
  
  getIsMobile() {
    return this.mobileDetectionService.getIsMobile();
  }
}
