import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PaymentsService, CreatePaymentRequest, Payment } from './payments.service';
import { UserAuthService } from './user-auth.service';
import { environment } from '../../../environments/environment';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<UserAuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('UserAuthService', ['getOrCreateDeviceId']);
    authSpy.getOrCreateDeviceId.and.returnValue('test-device-id');

    TestBed.configureTestingModule({
      providers: [
        PaymentsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserAuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(PaymentsService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(UserAuthService) as jasmine.SpyObj<UserAuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all payments', () => {
    const mockPayments: Payment[] = [
      {
        id: '1',
        kontoId: '100',
        toIban: 'CH123',
        amount: 50,
        message: 'Test',
        note: 'Note',
        executionType: 'NORMAL',
        executionDate: '2023-01-01',
        locked: false
      }
    ];

    service.getAllPayments().subscribe(payments => {
      expect(payments.length).toBe(1);
      expect(payments).toEqual(mockPayments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/payments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPayments);
  });

  it('should create payment with device ID', () => {
    const paymentRequest: CreatePaymentRequest = {
      kontoId: '100',
      toIban: 'CH123',
      amount: 100,
      paymentCurrency: 'CHF',
      note: 'Test Payment',
      executionType: 'NORMAL'
    };

    service.createPayment(paymentRequest).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/payments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      ...paymentRequest,
      deviceId: 'test-device-id'
    });
    req.flush({});
  });
});
