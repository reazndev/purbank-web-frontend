import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contractNumber: string;
  status: string;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  contractNumber?: string; // Optional - auto-generated if not provided
}

export interface UserDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contractNumber: string;
  status: string;
  createdAt: string;
}

export interface RegistrationCode {
  id: string;
  registrationCode: string;
  status: 'OPEN' | 'USED' | 'EXPIRED';
  title: string;
  description: string;
  createdAt: string;
  usedAt: string | null;
}

export interface CreateRegistrationCodeDto {
  title: string;
  description: string;
}

export interface AdminKontoDetails {
  kontoId: string;
  kontoName: string;
  balance: number;
  role: string;
  zinssatz: number;
  iban: string;
  currency: string;
  status: string;
  createdAt: string;
  closedAt: string;
  accruedInterest: number;
  lastInterestCalcDate: string;
}

export interface AdminKontoMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // User Management Endpoints
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/admin/users`, userData);
  }

  getUserDetails(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.baseUrl}/admin/users/${userId}`);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/users/${userId}`);
  }

  // Registration Code Endpoints
  getUserRegistrationCodes(userId: string): Observable<RegistrationCode[]> {
    return this.http.get<RegistrationCode[]>(`${this.baseUrl}/admin/users/${userId}/registration`);
  }

  createRegistrationCode(userId: string, codeData: CreateRegistrationCodeDto): Observable<RegistrationCode> {
    const params: any = { title: codeData.title };
    if (codeData.description) {
      params.description = codeData.description;
    }
    return this.http.post<RegistrationCode>(`${this.baseUrl}/admin/users/${userId}/registration`, null, { params });
  }

  deleteRegistrationCode(userId: string, codeId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/users/${userId}/registration/${codeId}`);
  }

  // Konto Management Endpoints
  getKontenForUser(userId: string): Observable<AdminKontoDetails[]> {
    return this.http.get<AdminKontoDetails[]>(`${this.baseUrl}/admin/konten/user/${userId}`);
  }

  createKontoForUser(userId: string, name: string, currency: string): Observable<AdminKontoDetails> {
    return this.http.post<AdminKontoDetails>(`${this.baseUrl}/admin/konten/user/${userId}`, { name, currency });
  }

  processAbrechnung(): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.baseUrl}/admin/konten/abrechnung`, {});
  }

  getKontoDetails(kontoId: string, userId: string): Observable<AdminKontoDetails> {
    const params = { userId };
    return this.http.get<AdminKontoDetails>(`${this.baseUrl}/admin/konten/${kontoId}`, { params });
  }

  closeKonto(kontoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/konten/${kontoId}`);
  }

  updateKonto(kontoId: string, name: string, zinssatz: number, balanceAdjustment?: number): Observable<AdminKontoDetails> {
    const params: any = {};
    if (balanceAdjustment !== undefined && balanceAdjustment !== null) {
      params.balanceAdjustment = balanceAdjustment;
    }
    return this.http.patch<AdminKontoDetails>(`${this.baseUrl}/admin/konten/${kontoId}`, { name, zinssatz }, { params });
  }

  getKontoMembers(kontoId: string): Observable<AdminKontoMember[]> {
    return this.http.get<AdminKontoMember[]>(`${this.baseUrl}/admin/konten/${kontoId}/members`);
  }
}
