import { Component, computed, inject, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LanguageService } from '../../shared/services/language.service';
import { LanguageToggleComponent } from '../../shared/language-toggle/language-toggle.component';
import { AdminLoginService } from '../../shared/services/admin-login.service';
import { UserAuthService, LoginState, AuthStatusResponse } from '../../shared/services/user-auth.service';
import { QrCodeComponent } from '../../components/qr-code/qr-code.component';
import { AdminLoginComponent } from '../../components/admin-login/admin-login.component';

type LoginMode = 'user' | 'admin';

interface LoginFormState {
  contractNumber: string;
  email: string;
  password: string;
  error: string;
  loading: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, FooterComponent, LanguageToggleComponent, QrCodeComponent, AdminLoginComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage implements OnDestroy {
  private readonly languageService = inject(LanguageService);
  private readonly adminLoginService = inject(AdminLoginService);
  private readonly userAuthService = inject(UserAuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  translations = computed(() => this.languageService.getTranslations());

  formState: LoginFormState = {
    contractNumber: '',
    email: '',
    password: '',
    error: '',
    loading: false
  };

  loginMode: LoginMode = 'user';
  showPassword = false;
  
  // Mobile verification state
  loginState: LoginState = 'idle';
  mobileVerifyCode: string | null = null;
  
  private pollingSubscription: Subscription | null = null;
  private loginStateSubscription: Subscription | null = null;

  constructor() {
    // Subscribe to login state changes
    this.loginStateSubscription = this.userAuthService.loginState$.subscribe(state => {
      this.loginState = state;
    });
    
    this.userAuthService.mobileVerifyCode$.subscribe(code => {
      this.mobileVerifyCode = code;
    });

    // Set login mode based on returnUrl
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    this.loginMode = returnUrl === '/management' ? 'admin' : 'user';
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.loginStateSubscription?.unsubscribe();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleLoginMode(): void {
    this.loginMode = this.loginMode === 'user' ? 'admin' : 'user';
    this.formState.error = '';
    this.resetUserLogin();
  }

  onSubmit(): void {
    if (this.loginMode === 'admin') {
      this.handleAdminLogin();
    } else {
      this.handleUserLogin();
    }
  }

  private handleAdminLogin(): void {
    this.formState.loading = true;
    this.formState.error = '';

    this.adminLoginService.login({
      email: this.formState.email,
      password: this.formState.password
    }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/management';
        this.formState.loading = false;
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.formState.loading = false;
        this.formState.error = this.getErrorMessage(error, 'admin');
      }
    });
  }

  private handleUserLogin(): void {
    if (!this.formState.contractNumber || this.formState.contractNumber.trim() === '') {
      this.formState.error = 'Please enter your contract number.';
      return;
    }

    this.formState.loading = true;
    this.formState.error = '';

    this.userAuthService.initiateLogin(this.formState.contractNumber.trim()).subscribe({
      next: (response) => {
        this.formState.loading = false;
        
        // Verify we have the mobile verify code before starting polling
        const mobileVerify = this.userAuthService.getMobileVerifyCode();
        if (!mobileVerify) {
          this.formState.error = 'Failed to initiate login. Please try again.';
          return;
        }
        
        // Start polling for status
        this.startPolling();
      },
      error: (error) => {
        this.formState.loading = false;
        this.formState.error = this.getErrorMessage(error, 'user');
      }
    });
  }

  private startPolling(): void {
    this.stopPolling();
    
    this.pollingSubscription = this.userAuthService.startPolling().subscribe({
      next: (response: AuthStatusResponse) => {
        if (response.status === 'APPROVED') {
          this.handleApproved();
        } else if (response.status === 'REJECTED') {
          this.handleRejected();
        } else if (response.status === 'INVALID') {
          this.handleInvalid();
        }
        // PENDING continues polling automatically
      },
      error: (error) => {
        if (error.message === 'Verification timeout') {
          this.formState.error = 'Verification timed out. Please try again.';
          this.loginState = 'timeout';
        } else if (error.status === 0) {
          this.formState.error = 'Cannot connect to server. Please check your connection.';
        } else if (error.status === 404) {
          this.formState.error = 'Verification session not found. Please try again.';
        } else if (error.userMessage) {
          this.formState.error = error.userMessage;
        } else {
          this.formState.error = 'Error checking verification status. Please try again.';
        }
        this.resetUserLogin();
      }
    });
  }

  private stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
    this.userAuthService.stopPolling();
  }

  private handleApproved(): void {
    this.stopPolling();
    
    // Get the refresh token
    this.userAuthService.getRefreshToken().subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.formState.error = 'Login approved but failed to get access token. Please try again.';
        this.loginState = 'error';
      }
    });
  }

  private handleRejected(): void {
    this.stopPolling();
    // Navigate to support page on rejection
    this.router.navigate(['/support'], { 
      queryParams: { reason: 'login_rejected' } 
    });
  }

  private handleInvalid(): void {
    this.stopPolling();
    this.formState.error = 'Login session invalidated. Please try again.';
  }

  cancelLogin(): void {
    this.userAuthService.cancelLogin().subscribe({
      next: () => {
        this.resetUserLogin();
      },
      error: () => {
        // Reset anyway
        this.resetUserLogin();
      }
    });
  }

  resetUserLogin(): void {
    this.stopPolling();
    this.userAuthService.resetLoginState();
    this.loginState = 'idle';
    this.mobileVerifyCode = null;
  }

  retryLogin(): void {
    this.resetUserLogin();
    this.formState.error = '';
  }

  private getErrorMessage(error: any, mode: LoginMode): string {
    if (error.status === 0) {
      return 'Cannot connect to server. Please ensure the backend is running.';
    }
    
    if (error.userMessage) {
      return error.userMessage;
    }
    
    if (mode === 'admin') {
      if (error.status === 401) {
        return 'Invalid email or password.';
      }
      if (error.status === 403) {
        return 'Account is locked or disabled.';
      }
    } else {
      if (error.status === 404) {
        return 'Contract number not found. Please check and try again.';
      }
      if (error.status === 429) {
        return 'Too many login attempts. Please try again later.';
      }
    }
    
    if (error.error?.message) {
      return error.error.message;
    }
    
    return 'Login failed. Please try again.';
  }

  // Helper getters for template
  get isAwaitingVerification(): boolean {
    return this.loginState === 'awaiting_mobile_verification';
  }

  get isApproved(): boolean {
    return this.loginState === 'approved';
  }

  get isRejected(): boolean {
    return this.loginState === 'rejected';
  }

  get isTimeout(): boolean {
    return this.loginState === 'timeout';
  }

  get showQrCode(): boolean {
    return this.isAwaitingVerification && !!this.mobileVerifyCode;
  }
}