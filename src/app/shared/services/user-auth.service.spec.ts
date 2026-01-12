import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserAuthService, UserLoginResponse, AuthStatusResponse } from './user-auth.service';
import { environment } from '../../../environments/environment';

describe('UserAuthService', () => {
  let service: UserAuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        UserAuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(UserAuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear local storage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrCreateDeviceId', () => {
    it('should generate a new device ID if none exists', () => {
      const deviceId = service.getOrCreateDeviceId();
      expect(deviceId).toBeTruthy();
      expect(localStorage.getItem('device_id')).toBe(deviceId);
    });

    it('should return existing device ID if it exists', () => {
      const existingId = 'test-device-id';
      localStorage.setItem('device_id', existingId);
      const deviceId = service.getOrCreateDeviceId();
      expect(deviceId).toBe(existingId);
    });
  });

  describe('initiateLogin', () => {
    it('should initiate login and return mobile verify code', () => {
      const contractNumber = '123456';
      const mockResponse: UserLoginResponse = { mobileVerifyCode: 'ABC-123' };

      service.initiateLogin(contractNumber).subscribe(response => {
        expect(response.mobileVerifyCode).toBe('ABC-123');
        expect(service.getMobileVerifyCode()).toBe('ABC-123');
        expect(service.getLoginState()).toBe('awaiting_mobile_verification');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.contractNumber).toBe(contractNumber);
      req.flush(mockResponse);
    });

    it('should handle error during login initiation', () => {
      const contractNumber = '123456';

      service.initiateLogin(contractNumber).subscribe({
        error: (error) => {
          expect(service.getLoginState()).toBe('error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('pollAuthStatus', () => {
    it('should poll status successfully', () => {
      // Setup state
      const code = 'ABC-123';
      (service as any).mobileVerifyCodeSubject.next(code);
      
      service.pollAuthStatus().subscribe(response => {
        expect(response.status).toBe('PENDING');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/status`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.mobileVerify).toBe(code);
      req.flush({ status: 'PENDING' });
    });

    it('should error if no mobile verify code', () => {
      service.pollAuthStatus().subscribe({
        error: (err) => {
          expect(err.message).toBe('No mobile-verify code available');
        }
      });
    });
  });

  describe('startPolling', () => {
    it('should update state on APPROVED status', fakeAsync(() => {
      const code = 'ABC-123';
      (service as any).mobileVerifyCodeSubject.next(code);

      let statusResult: string | undefined;
      service.startPolling().subscribe({
        next: (res) => statusResult = res.status
      });
      
      // Fast-forward initial timer
      tick(0);
      
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/status`);
      req.flush({ status: 'APPROVED' });
      
      expect(service.getLoginState()).toBe('approved');
      discardPeriodicTasks(); // Clean up remaining timer
    }));
  });

  describe('logout', () => {
    it('should clear storage and navigate to login', () => {
      localStorage.setItem('user_access_token', 'token');
      service.logout();
      
      expect(localStorage.getItem('user_access_token')).toBeNull();
      expect(service.getLoginState()).toBe('idle');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
