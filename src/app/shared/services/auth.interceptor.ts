import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, map, from, of } from 'rxjs';
import { AdminLoginService } from './admin-login.service';
import { UserAuthService } from './user-auth.service';
import { MobileVerifyService } from './mobile-verify.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const adminLoginService = inject(AdminLoginService);
  const userAuthService = inject(UserAuthService);
  const mobileVerifyService = inject(MobileVerifyService);
  
  // Skip auth endpoints (including /auth/status for mobile verification polling)
  const isAuthEndpoint = req.url.includes('/auth/login') || 
                        req.url.includes('/auth/refresh-token') ||
                        req.url.includes('/auth/refreshtoken') ||
                        req.url.includes('/auth/register') ||
                        req.url.includes('/auth/cancel') ||
                        req.url.includes('/auth/status');
  
  if (isAuthEndpoint) {
    return next(req);
  }

  // Clone request to add headers
  let modifiedReq = req;

  // Add access token to request if available
  const userAccessToken = userAuthService.getAccessToken();
  const adminAccessToken = adminLoginService.getAccessToken();
  
  // Determine which token to use based on the URL and available tokens
  let accessToken: string | null = null;
  
  if (req.url.includes('/api/v1/admin/') || req.url.includes('/api/v1/users')) {
    // Admin endpoints prefer admin token
    accessToken = adminAccessToken || userAccessToken;
  } else {
    // User endpoints prefer user token
    accessToken = userAccessToken || adminAccessToken;
  }
  
  if (accessToken) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // For non-GET requests, add deviceId to the body as required by the API spec
  // This allows the server to request mobile verification for any action
  if (req.method !== 'GET' && req.body && typeof req.body === 'object') {
    const deviceId = userAuthService.getOrCreateDeviceId();
    const currentBody = req.body as any;
    
    // Only add deviceId if it's not already there
    if (!currentBody.deviceId) {
      const bodyWithDeviceId = {
        ...currentBody,
        deviceId
      };
      modifiedReq = modifiedReq.clone({
        body: bodyWithDeviceId
      });
    }
  }

  return next(modifiedReq).pipe(
    switchMap(event => {
      if (req.method !== 'GET' && event instanceof HttpResponse && event.body) {
        const body = event.body as any;
        const mobileVerify = body.mobileVerify || body.mobileVerifyCode || body.mobile_verify || body.code;
        if (mobileVerify && typeof mobileVerify === 'string' && mobileVerify.length > 0) {
          // Mobile verification required
          return from(mobileVerifyService.showVerifyModal(mobileVerify)).pipe(
            switchMap(success => {
              if (success) {
                // If verified, return the original event
                // The backend should have executed the action already
                return of(event);
              } else {
                return throwError(() => new Error('Mobile verification failed or rejected'));
              }
            })
          );
        }
      }
      return of(event);
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle 401 errors with token refresh
      if (error.status === 401 && !isRefreshing) {
        // Determine which service to use for refresh
        const hasUserRefreshToken = !!userAuthService.getStoredRefreshToken();
        const hasAdminRefreshToken = !!adminLoginService.getRefreshToken();
        const isAdmin = adminLoginService.isAdmin();

        // If user is admin, prefer admin refresh token
        if (isAdmin && hasAdminRefreshToken) {
          isRefreshing = true;
          return adminLoginService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              const newToken = adminLoginService.getAccessToken();
              const clonedRequest = modifiedReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(clonedRequest);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              adminLoginService.logout();
              return throwError(() => refreshError);
            })
          );
        } else if (hasUserRefreshToken) {
          isRefreshing = true;
          return userAuthService.refreshAccessToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              const newToken = userAuthService.getAccessToken();
              const clonedRequest = modifiedReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(clonedRequest);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              userAuthService.logout();
              return throwError(() => refreshError);
            })
          );
        } else if (hasAdminRefreshToken) {
          isRefreshing = true;
          return adminLoginService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              const newToken = adminLoginService.getAccessToken();
              const clonedRequest = modifiedReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(clonedRequest);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              adminLoginService.logout();
              return throwError(() => refreshError);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
