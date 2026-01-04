import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';

export interface Payment {
  id: string;
  kontoId: string;
  toIban: string;
  amount: number;
  message: string;
  note: string;
  executionType: 'INSTANT' | 'NORMAL';
  executionDate: string;
  locked: boolean;
}

export interface CreatePaymentRequest {
  kontoId: string;
  toIban: string;
  amount: number;
  message: string;
  note: string;
  executionType: 'INSTANT' | 'NORMAL';
  executionDate?: string;
}

export interface UpdatePaymentRequest {
  toIban?: string;
  amount?: number;
  message?: string;
  note?: string;
  executionType?: 'INSTANT' | 'NORMAL';
  executionDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private apiUrl = 'http://localhost:8080/api/v1';
  private userAuthService = inject(UserAuthService);

  constructor(private http: HttpClient) {}

  getPayments(kontoId?: string): Observable<Payment[]> {
    const url = kontoId 
      ? `${this.apiUrl}/payments?kontoId=${kontoId}`
      : `${this.apiUrl}/payments`;
    return this.http.get<Payment[]>(url);
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments`);
  }

  createPayment(payment: CreatePaymentRequest): Observable<any> {
    const deviceId = this.userAuthService.getOrCreateDeviceId();
    return this.http.post(`${this.apiUrl}/payments`, {
      ...payment,
      deviceId
    });
  }

  updatePayment(paymentId: string, payment: UpdatePaymentRequest): Observable<any> {
    const deviceId = this.userAuthService.getOrCreateDeviceId();
    return this.http.patch(`${this.apiUrl}/payments/${paymentId}`, {
      ...payment,
      deviceId
    });
  }

  deletePayment(paymentId: string): Observable<any> {
    const deviceId = this.userAuthService.getOrCreateDeviceId();
    return this.http.request('DELETE', `${this.apiUrl}/payments/${paymentId}`, {
      body: { deviceId }
    });
  }
}