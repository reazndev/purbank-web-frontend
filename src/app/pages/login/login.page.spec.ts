import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { UserAuthService } from '../../shared/services/user-auth.service';
import { AdminLoginService } from '../../shared/services/admin-login.service';
import { LanguageService } from '../../shared/services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let userAuthServiceSpy: jasmine.SpyObj<UserAuthService>;
  let adminLoginServiceSpy: jasmine.SpyObj<AdminLoginService>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let router: Router;

  const loginStateSubject = new BehaviorSubject<any>('idle');
  const mobileVerifyCodeSubject = new BehaviorSubject<string | null>(null);

  beforeEach(async () => {
    userAuthServiceSpy = jasmine.createSpyObj('UserAuthService', [
      'initiateLogin',
      'startPolling',
      'stopPolling',
      'getMobileVerifyCode',
      'resetLoginState',
      'cancelLogin',
      'getRefreshToken'
    ]);

    // Setup observables for UserAuthService
    Object.defineProperty(userAuthServiceSpy, 'loginState$', { value: loginStateSubject.asObservable() });
    Object.defineProperty(userAuthServiceSpy, 'mobileVerifyCode$', { value: mobileVerifyCodeSubject.asObservable() });

    adminLoginServiceSpy = jasmine.createSpyObj('AdminLoginService', ['login']);
    
    languageServiceSpy = jasmine.createSpyObj('LanguageService', ['getTranslations', 'getCurrentLanguage']);
    languageServiceSpy.getTranslations.and.returnValue({
      login: {
        title: 'Login',
        subtitle: 'Subtitle'
      }
    } as any);
    languageServiceSpy.getCurrentLanguage.and.returnValue((() => 'de') as any); // Mock signal

    await TestBed.configureTestingModule({
      imports: [LoginPage, RouterTestingModule],
      providers: [
        { provide: UserAuthService, useValue: userAuthServiceSpy },
        { provide: AdminLoginService, useValue: adminLoginServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { returnUrl: '/dashboard' }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // Spy on the real router's navigate method
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('User Login', () => {
    beforeEach(() => {
      component.loginMode = 'user';
    });

    it('should validate empty contract number', () => {
      component.formState.contractNumber = '';
      component.onSubmit();
      expect(component.formState.error).toContain('Please enter your contract number');
      expect(userAuthServiceSpy.initiateLogin).not.toHaveBeenCalled();
    });

    it('should initiate login successfully', () => {
      component.formState.contractNumber = '123456';
      userAuthServiceSpy.initiateLogin.and.returnValue(of({ mobileVerifyCode: 'ABC' }));
      userAuthServiceSpy.getMobileVerifyCode.and.returnValue('ABC');
      userAuthServiceSpy.startPolling.and.returnValue(of({ status: 'PENDING' }));

      component.onSubmit();

      expect(userAuthServiceSpy.initiateLogin).toHaveBeenCalledWith('123456');
      expect(userAuthServiceSpy.startPolling).toHaveBeenCalled();
    });

    it('should handle login error', () => {
      component.formState.contractNumber = '123456';
      userAuthServiceSpy.initiateLogin.and.returnValue(throwError(() => ({ status: 404 })));

      component.onSubmit();

      expect(component.formState.error).toContain('Contract number not found');
      expect(component.formState.loading).toBeFalse();
    });

    it('should handle successful polling and approval', () => {
       component.formState.contractNumber = '123456';
       userAuthServiceSpy.initiateLogin.and.returnValue(of({ mobileVerifyCode: 'ABC' }));
       userAuthServiceSpy.getMobileVerifyCode.and.returnValue('ABC');
       userAuthServiceSpy.startPolling.and.returnValue(of({ status: 'APPROVED' }));
       userAuthServiceSpy.getRefreshToken.and.returnValue(of({ access_token: 'token', refresh_token: 'refresh' }));

       component.onSubmit();

       expect(userAuthServiceSpy.getRefreshToken).toHaveBeenCalled();
       expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Admin Login', () => {
    beforeEach(() => {
      component.loginMode = 'admin';
    });

    it('should submit admin login', () => {
      component.formState.email = 'admin@test.com';
      component.formState.password = 'password';
      adminLoginServiceSpy.login.and.returnValue(of({ access_token: 'token', refresh_token: 'refresh_token' }));

      component.onSubmit();

      expect(adminLoginServiceSpy.login).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password'
      });
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should handle admin login error', () => {
      component.formState.email = 'admin@test.com';
      component.formState.password = 'password';
      adminLoginServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

      component.onSubmit();

      expect(component.formState.error).toContain('Invalid email or password');
    });
  });

  describe('UI Interactions', () => {
    it('should toggle login mode', () => {
      component.loginMode = 'user';
      component.toggleLoginMode();
      expect(component.loginMode).toBe('admin');
      
      component.toggleLoginMode();
      expect(component.loginMode).toBe('user');
    });

    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalse();
      component.togglePasswordVisibility();
      expect(component.showPassword).toBeTrue();
    });
  });
});
