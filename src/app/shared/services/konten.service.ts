import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthService } from './user-auth.service';
import { environment } from '../../../environments/environment';

export interface Konto {
  kontoId: string;
  kontoName: string;
  balance: number;
  role: string;
  iban: string;
  currency: string;
}

export interface Transaction {
  transactionId: string;
  amount: number;
  balanceAfter: number;
  timestamp: string;  
  fromIban: string;
  message: string;
  note: string;
}
// toIban will be added later in backend

export interface KontoMember {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'VIEWER';
}

export interface InviteMemberRequest {
  contractNumber: string;
  role: 'OWNER' | 'MANAGER' | 'VIEWER';
  deviceId: string;
}


@Injectable({
  providedIn: 'root'
})
export class KontenService {
  private apiUrl = environment.apiUrl;
  private userAuthService = inject(UserAuthService);

  constructor(private http: HttpClient) {}

  getKonten(): Observable<Konto[]> {
    return this.http.get<Konto[]>(`${this.apiUrl}/konten`);
  }

  createKonto(name: string, currency: string): Observable<any> {
    const deviceId = this.userAuthService.getOrCreateDeviceId();
    return this.http.post(`${this.apiUrl}/konten`, { 
      name,
      currency,
      deviceId 
    });
  }

  deleteKonto(kontoId: string): Observable<any> {
    const deviceId = this.userAuthService.getOrCreateDeviceId();
    return this.http.request('DELETE', `${this.apiUrl}/konten/${kontoId}`, {
      body: { deviceId }
    });
  }

  getTransactions(kontoId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/konten/${kontoId}/transactions`);
  }

  getKontoMembers(kontoId: string): Observable<KontoMember[]> {
    return this.http.get<KontoMember[]>(`${this.apiUrl}/konten/${kontoId}/members`);
  }

  inviteMember(kontoId: string, request: InviteMemberRequest): Observable<any> {
    const deviceId = this.userAuthService.getOrCreateDeviceId();
    return this.http.post(`${this.apiUrl}/konten/${kontoId}/members`, {
      ...request,
      deviceId
    });
  }

  removeMember(kontoId: string, memberId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/konten/${kontoId}/members/${memberId}`);
  }
}