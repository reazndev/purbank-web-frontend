import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, timer, Subject } from 'rxjs';
import { tap, catchError, switchMap, takeUntil, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface UserLoginRequest {
  contractNumber: string;
  deviceId: string;
  ip?: string;
}

// The API might return the field as 'mobileVerifyCode', 'mobileVerify', 'mobile_verify' or just the code directly
export interface UserLoginResponse {
  mobileVerifyCode?: string;
  mobileVerify?: string;
  mobile_verify?: string;
  code?: string;
  status?: string;
}

export interface AuthStatusRequest {
  mobileVerify: string;
  deviceId: string;
}

export interface AuthStatusResponse {
  status: 'APPROVED' | 'REJECTED' | 'INVALID' | 'PENDING';
}

export interface RefreshTokenRequest {
  mobileVerify: string;
  deviceId: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface TokenPayload {
  sub: string;
  exp: number;
  iat: number;
  authorities?: string[];
  contractNumber?: string;
}

export type LoginState = 
  | 'idle'
  | 'awaiting_mobile_verification'
  | 'approved'
  | 'rejected'
  | 'invalid'
  | 'error'
  | 'timeout';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private readonly BASE_URL = 'http://localhost:8080/api/v1';
  private readonly ACCESS_TOKEN_KEY = 'user_access_token';
  private readonly REFRESH_TOKEN_KEY = 'user_refresh_token';
  private readonly DEVICE_ID_KEY = 'device_id';
  private readonly CONTRACT_NUMBER_KEY = 'contract_number';
  
  private readonly POLLING_INTERVAL_MS = 2000;
  private readonly POLLING_TIMEOUT_MS = 300000; // 5 minutes
  
  private currentUserSubject = new BehaviorSubject<TokenPayload | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private loginStateSubject = new BehaviorSubject<LoginState>('idle');
  public loginState$ = this.loginStateSubject.asObservable();
  
  private mobileVerifyCodeSubject = new BehaviorSubject<string | null>(null);
  public mobileVerifyCode$ = this.mobileVerifyCodeSubject.asObservable();
  
  private stopPolling$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  /**
   * Get or generate a device ID for this browser session.
   * The device ID is stored in localStorage and persists across sessions.
   */
  getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  /**
   * Generate a new device ID (UUID v4)
   */
  private generateDeviceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Start the user login flow with contract number.
   * This initiates mobile verification and returns the mobile-verify code.
   */
  initiateLogin(contractNumber: string): Observable<UserLoginResponse> {
    const deviceId = this.getOrCreateDeviceId();
    
    const request: UserLoginRequest = {
      contractNumber,
      deviceId
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<UserLoginResponse>(
      `${this.BASE_URL}/auth/login`,
      request,
      { headers }
    ).pipe(
      tap(response => {
        // Clear admin flag to avoid context mixing
        localStorage.removeItem('is_admin_user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Handle different possible response formats
        const mobileVerifyCode = response.mobileVerifyCode || response.mobileVerify || response.mobile_verify || response.code;
        
        if (!mobileVerifyCode) {
          throw new Error('Server did not return a mobile-verify code');
        }
        localStorage.setItem(this.CONTRACT_NUMBER_KEY, contractNumber);
        this.mobileVerifyCodeSubject.next(mobileVerifyCode);
        this.loginStateSubject.next('awaiting_mobile_verification');
      }),
      catchError(error => {
        this.loginStateSubject.next('error');
        return this.handleError(error);
      })
    );
  }

  /**
   * Poll the server for the status of the mobile verification.
   * Returns an observable that emits status updates until completed or timed out.
   */
  pollAuthStatus(): Observable<AuthStatusResponse> {
    const mobileVerify = this.mobileVerifyCodeSubject.getValue();
    const deviceId = this.getOrCreateDeviceId();

    if (!mobileVerify) {
      return throwError(() => new Error('No mobile-verify code available'));
    }

    const request: AuthStatusRequest = {
      mobileVerify,
      deviceId
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<AuthStatusResponse>(
      `${this.BASE_URL}/auth/status`,
      request,
      { headers }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Start continuous polling for auth status.
   * Automatically stops when status is APPROVED, REJECTED, INVALID, or on timeout.
   */
  startPolling(): Observable<AuthStatusResponse> {
    const mobileVerify = this.mobileVerifyCodeSubject.getValue();
    if (!mobileVerify) {
      return throwError(() => new Error('No mobile-verify code available'));
    }
    return this.startPollingForCode(mobileVerify);
  }

  /**
   * Start continuous polling for a specific mobile-verify code.
   */
  startPollingForCode(mobileVerify: string): Observable<AuthStatusResponse> {
    this.stopPolling$.next(); // Stop any existing polling
    
    const startTime = Date.now();
    const deviceId = this.getOrCreateDeviceId();
    
    return timer(0, this.POLLING_INTERVAL_MS).pipe(
      takeUntil(this.stopPolling$),
      switchMap(() => {
        // Check for timeout
        if (Date.now() - startTime > this.POLLING_TIMEOUT_MS) {
          this.loginStateSubject.next('timeout');
          this.stopPolling();
          return throwError(() => new Error('Verification timeout'));
        }

        const request: AuthStatusRequest = {
          mobileVerify,
          deviceId
        };

        return this.http.post<AuthStatusResponse>(
          `${this.BASE_URL}/auth/status`,
          request
        ).pipe(
          tap(response => {
            if (response.status === 'APPROVED') {
              this.loginStateSubject.next('approved');
              this.stopPolling();
            } else if (response.status === 'REJECTED') {
              this.loginStateSubject.next('rejected');
              this.stopPolling();
            } else if (response.status === 'INVALID') {
              this.loginStateSubject.next('invalid');
              this.stopPolling();
            }
          }),
          catchError(error => {
            // Don't stop polling on transient errors
            console.error('Polling error:', error);
            return throwError(() => error);
          })
        );
      })
    );
  }

  /**
   * Stop the polling process
   */
  stopPolling(): void {
    this.stopPolling$.next();
  }

  /**
   * Cancel the current login request
   */
  cancelLogin(): Observable<any> {
    const mobileVerify = this.mobileVerifyCodeSubject.getValue();
    const deviceId = this.getOrCreateDeviceId();

    if (!mobileVerify) {
      return throwError(() => new Error('No mobile-verify code available'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(
      `${this.BASE_URL}/auth/cancel`,
      { mobileVerify, deviceId },
      { headers }
    ).pipe(
      tap(() => {
        this.resetLoginState();
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Get the refresh token after successful mobile approval
   */
  getRefreshToken(): Observable<RefreshTokenResponse> {
    const mobileVerify = this.mobileVerifyCodeSubject.getValue();
    const deviceId = this.getOrCreateDeviceId();

    if (!mobileVerify) {
      return throwError(() => new Error('No mobile-verify code available'));
    }

    const request: RefreshTokenRequest = {
      mobileVerify,
      deviceId
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<RefreshTokenResponse>(
      `${this.BASE_URL}/auth/refreshtoken`,
      request,
      { headers }
    ).pipe(
      tap(response => {
        this.setTokens(response.access_token, response.refresh_token);
        this.loadCurrentUser();
        this.resetLoginState();
      }),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Refresh access token using the stored refresh token
   */
  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    return this.http.post<RefreshTokenResponse>(
      `${this.BASE_URL}/auth/refresh-token`,
      {},
      { headers }
    ).pipe(
      tap(response => {
        this.setTokens(response.access_token, response.refresh_token);
        this.loadCurrentUser();
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Store tokens in localStorage
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get the current mobile-verify code
   */
  getMobileVerifyCode(): string | null {
    return this.mobileVerifyCodeSubject.getValue();
  }

  /**
   * Get current login state
   */
  getLoginState(): LoginState {
    return this.loginStateSubject.getValue();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.CONTRACT_NUMBER_KEY);
    this.currentUserSubject.next(null);
    this.resetLoginState();
    this.router.navigate(['/login']);
  }

  /**
   * Reset login state to idle
   */
  resetLoginState(): void {
    this.stopPolling();
    this.loginStateSubject.next('idle');
    this.mobileVerifyCodeSubject.next(null);
  }

  /**
   * Get stored contract number
   */
  getContractNumber(): string | null {
    return localStorage.getItem(this.CONTRACT_NUMBER_KEY);
  }

  /**
   * Decode JWT token to extract user info
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return true;
    }
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  /**
   * Get current user info from access token
   */
  getCurrentUser(): TokenPayload | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    return this.decodeToken(token);
  }

  /**
   * Load current user from stored token
   */
  private loadCurrentUser(): void {
    const user = this.getCurrentUser();
    this.currentUserSubject.next(user);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    if (error.status === 0) {
      return throwError(() => ({
        ...error,
        userMessage: 'Cannot connect to server. Please check your internet connection.'
      }));
    }
    
    if (error.status === 429) {
      return throwError(() => ({
        ...error,
        userMessage: 'Too many login attempts. Please try again later.'
      }));
    }

    if (error.status === 404) {
      return throwError(() => ({
        ...error,
        userMessage: 'Contract number not found. Please check and try again.'
      }));
    }

    return throwError(() => error);
  }
}
