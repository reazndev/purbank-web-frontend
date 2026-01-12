import { Component, Input, Output, EventEmitter, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { UserAuthService, AuthStatusResponse } from '../../shared/services/user-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobile-verify-modal',
  standalone: true,
  imports: [CommonModule, QrCodeComponent],
  templateUrl: './mobile-verify-modal.component.html',
  styleUrls: ['./mobile-verify-modal.component.css']
})
export class MobileVerifyModalComponent implements OnInit, OnDestroy {
  @Input() mobileVerifyCode: string = '';
  @Output() verified = new EventEmitter<void>();
  @Output() rejected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  private userAuthService = inject(UserAuthService);
  private pollingSubscription?: Subscription;
  
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INVALID' | 'EXPIRED' | 'ERROR' = 'PENDING';
  errorMessage: string = '';

  ngOnInit() {
    if (this.mobileVerifyCode) {
      this.startPolling();
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  startPolling() {
    this.status = 'PENDING';    
    this.pollingSubscription = this.userAuthService.startPollingForCode(this.mobileVerifyCode).subscribe({
      next: (response: AuthStatusResponse) => {
        this.status = response.status as any;
        if (this.status === 'APPROVED') {
          this.stopPolling();
          this.verified.emit();
        } else if (this.status === 'REJECTED' || this.status === 'INVALID' || this.status === 'EXPIRED') {
          this.stopPolling();
          this.rejected.emit(this.status);
        }
      },
      error: (err: any) => {
        this.status = 'ERROR';
        this.errorMessage = 'Connection error. Please try again.';
        this.stopPolling();
      }
    });
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  close() {
    this.stopPolling();
    this.closed.emit();
  }
}
