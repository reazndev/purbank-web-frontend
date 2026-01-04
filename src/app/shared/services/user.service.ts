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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  // Returns the authenticated user's data
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users`);
  }
}
