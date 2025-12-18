import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post(`${this.apiUrl}/payments`, payment);
  }

  updatePayment(paymentId: string, payment: UpdatePaymentRequest): Observable<any> {
    return this.http.patch(`${this.apiUrl}/payments/${paymentId}`, payment);
  }

  deletePayment(paymentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/payments/${paymentId}`);
  }
}