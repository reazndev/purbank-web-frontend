import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserAuthService } from './user-auth.service';
import { AdminLoginService } from './admin-login.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly router = inject(Router);
  private readonly userAuthService = inject(UserAuthService);
  private readonly adminLoginService = inject(AdminLoginService);

  private readonly INACTIVITY_LIMIT_SECONDS = 8 * 60; // 8 minutes
  private readonly SESSION_LIMIT_SECONDS = 10 * 60; // 10 minutes

  // Seconds since last navigation
  private inactivitySeconds = signal<number>(0);
  // Seconds since last token refresh/login
  private sessionSeconds = signal<number>(0);
  
  isWarningVisible = signal<boolean>(false);
  private timerInterval?: any;

  // Time remaining until total session timeout (10 mins)
  totalTimeRemaining = computed(() => Math.max(0, this.SESSION_LIMIT_SECONDS - this.sessionSeconds()));
  
  // Time remaining until inactivity warning (8 mins)
  inactivityTimeRemaining = computed(() => Math.max(0, this.INACTIVITY_LIMIT_SECONDS - this.inactivitySeconds()));

  constructor() {
    this.setupNavigationListener();
    this.startTimers();
  }

  private setupNavigationListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.resetInactivity();
    });
  }

  private startTimers(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      // Only track if someone is logged in
      const isAdmin = this.adminLoginService.isAuthenticated();
      const isUser = this.userAuthService.isAuthenticated();
      
      if (!isAdmin && !isUser) {
        this.resetAll();
        return;
      }

      this.inactivitySeconds.update(s => s + 1);
      this.sessionSeconds.update(s => s + 1);

      this.checkSessionStatus();
    }, 1000);
  }

  private checkSessionStatus(): void {
    const inactivity = this.inactivitySeconds();
    const session = this.sessionSeconds();

    // 1. Inactivity Warning
    if (inactivity >= this.INACTIVITY_LIMIT_SECONDS && !this.isWarningVisible()) {
      this.isWarningVisible.set(true);
    }

    // 2. Session Limit Logic
    if (session >= this.SESSION_LIMIT_SECONDS) {
      if (inactivity < this.INACTIVITY_LIMIT_SECONDS) {
        // Active user, but session is old -> Refresh Token
        this.refreshTokens();
      } else {
        // Inactive user and session is old -> Force Logout
        this.forceLogout();
      }
    }
  }

  private refreshTokens(): void {
    console.log('Session Service: Total session reached 10m but user is active. Refreshing tokens.');
    const isAdmin = this.adminLoginService.isAuthenticated();
    
    if (isAdmin) {
      this.adminLoginService.refreshToken().subscribe({
        next: () => this.sessionSeconds.set(0),
        error: () => this.forceLogout()
      });
    } else {
      this.userAuthService.refreshAccessToken().subscribe({
        next: () => this.sessionSeconds.set(0),
        error: () => this.forceLogout()
      });
    }
  }

  private forceLogout(): void {
    this.isWarningVisible.set(false);
    this.adminLoginService.logout();
    this.userAuthService.logout();
    this.router.navigate(['/session-timeout']);
  }

  resetInactivity(): void {
    this.inactivitySeconds.set(0);
    this.isWarningVisible.set(false);
  }

  private resetAll(): void {
    this.inactivitySeconds.set(0);
    this.sessionSeconds.set(0);
    this.isWarningVisible.set(false);
  }

  stayLoggedIn(): void {
    this.resetInactivity();
  }

  logoutNow(): void {
    this.forceLogout();
  }
}
