import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Konto {
  kontoId: string;
  kontoName: string;
  balance: number;
  role: string;
  iban: string;
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

@Injectable({
  providedIn: 'root'
})
export class KontenService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getKonten(): Observable<Konto[]> {
    return this.http.get<Konto[]>(`${this.apiUrl}/konten`);
  }

  createKonto(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/konten`, { name });
  }

  deleteKonto(kontoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/konten/${kontoId}`);
  }

  getTransactions(kontoId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/konten/${kontoId}/transactions`);
  }
}