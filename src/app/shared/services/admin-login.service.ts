import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
}

export interface TokenPayload {
  sub: string; // email
  exp: number;
  iat: number;
  authorities?: string[];
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {
  private readonly BASE_URL = '/api/v1';
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly ADMIN_FLAG_KEY = 'is_admin_user';
  
  private currentUserSubject = new BehaviorSubject<TokenPayload | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize current user from stored token
    this.loadCurrentUser();
  }

  /**
   * Login with email and password (Admin only)
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<AuthResponse>(
      `${this.BASE_URL}/auth/login/password`,
      credentials,
      { headers }
    ).pipe(
      tap(response => {
        // Clear user tokens to avoid context mixing
        localStorage.removeItem('user_access_token');
        localStorage.removeItem('user_refresh_token');
        localStorage.removeItem('contract_number');
        
        this.setTokens(response.access_token, response.refresh_token);
        // Mark user as admin since they logged in via password endpoint (admin-only)
        localStorage.setItem(this.ADMIN_FLAG_KEY, 'true');
        this.loadCurrentUser();
      }),
      catchError(error => {
        // CORS or network error (status 0 means network error or CORS issue)
        if (error.status === 0) {
          return throwError(() => ({
            ...error,
            userMessage: 'Cannot connect to server. Please check if the backend is running and CORS is properly configured.'
          }));
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    return this.http.post<AuthResponse>(
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
   * Change password (Admin only)
   */
  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.patch<void>(
      `${this.BASE_URL}/auth/change-password`,
      request
    ).pipe(
      catchError(error => {
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
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
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
   * Check if user has admin role
   */
  isAdmin(): boolean {
    // Fallback: Check if user logged in via admin password endpoint 
    // -> normal users dont have passwords so only admin accounts could login via that 
    if (localStorage.getItem(this.ADMIN_FLAG_KEY) === 'true') {
      return true;
    }

    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }
    
    // Check if authorities array exists and contains ROLE_ADMIN or ADMIN
    if (user.authorities && Array.isArray(user.authorities)) {
      if (user.authorities.includes('ROLE_ADMIN') || user.authorities.includes('ADMIN')) {
        return true;
      }
    }
    
    // Check for roles claim as alternative
    if (user.roles && Array.isArray(user.roles)) {
      if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ADMIN')) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Logout user (clear tokens)
   */
  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_FLAG_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
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
      const decoded = JSON.parse(jsonPayload);
      return decoded;
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
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }
    
    // If user logged in via admin endpoint, ensure they have ADMIN role in the frontend object
    if (localStorage.getItem(this.ADMIN_FLAG_KEY) === 'true') {
      if (!decoded.authorities) {
        decoded.authorities = ['ADMIN'];
      } else if (Array.isArray(decoded.authorities) && !decoded.authorities.includes('ADMIN') && !decoded.authorities.includes('ROLE_ADMIN')) {
        decoded.authorities.push('ADMIN');
      }
    }
    
    return decoded;
  }

  /**
   * Load current user from stored token
   */
  private loadCurrentUser(): void {
    const user = this.getCurrentUser();
    this.currentUserSubject.next(user);
  }

  /**
   * Get user email from token
   */
  getUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user?.sub || null;
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): Date | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }
    
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  }
}
