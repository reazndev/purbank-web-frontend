import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  contractNumber: string;
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

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/admin';

  constructor(private readonly http: HttpClient) {}

  // User Management Endpoints
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  createUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, userData);
  }

  getUserDetails(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.baseUrl}/users/${userId}`);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  // Registration Code Endpoints
  getUserRegistrationCodes(userId: string): Observable<RegistrationCode[]> {
    return this.http.get<RegistrationCode[]>(`${this.baseUrl}/users/${userId}/registration`);
  }

  createRegistrationCode(userId: string, codeData: CreateRegistrationCodeDto): Observable<RegistrationCode> {
    return this.http.post<RegistrationCode>(`${this.baseUrl}/users/${userId}/registration`, codeData);
  }

  deleteRegistrationCode(userId: string, codeId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}/registration/${codeId}`);
  }
}
