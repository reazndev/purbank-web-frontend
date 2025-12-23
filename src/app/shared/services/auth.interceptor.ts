import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AdminLoginService } from './admin-login.service';
import { UserAuthService } from './user-auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const adminLoginService = inject(AdminLoginService);
  const userAuthService = inject(UserAuthService);
  
  // Skip auth endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') || 
                        req.url.includes('/auth/refresh-token') ||
                        req.url.includes('/auth/refreshtoken') ||
                        req.url.includes('/auth/register') ||
                        req.url.includes('/auth/status') ||
                        req.url.includes('/auth/cancel');
  
  if (isAuthEndpoint) {
    return next(req);
  }

  // Clone request to add headers
  let modifiedReq = req;

  // Add access token to request if available
  const userAccessToken = userAuthService.getAccessToken();
  const adminAccessToken = adminLoginService.getAccessToken();
  
  // Prefer admin token if user is logged in as admin (via password), otherwise prefer user token
  const isAdmin = adminLoginService.isAdmin();
  const accessToken = isAdmin ? (adminAccessToken || userAccessToken) : (userAccessToken || adminAccessToken);
  
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
    const bodyWithDeviceId = {
      ...req.body as object,
      deviceId
    };
    modifiedReq = modifiedReq.clone({
      body: bodyWithDeviceId
    });
  }

  return next(modifiedReq).pipe(
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
