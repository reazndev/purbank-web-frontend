import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionFilterService {
  // 'all' or a specific kontoId
  private selectedKontoId = signal<string>('all');
  // 'all', 'INCOMING', or 'OUTGOING'
  private selectedTransactionType = signal<'all' | 'INCOMING' | 'OUTGOING'>('all');

  getSelectedKontoId() {
    return this.selectedKontoId.asReadonly();
  }

  setSelectedKontoId(id: string) {
    this.selectedKontoId.set(id);
  }

  getSelectedTransactionType() {
    return this.selectedTransactionType.asReadonly();
  }

  setSelectedTransactionType(type: 'all' | 'INCOMING' | 'OUTGOING') {
    this.selectedTransactionType.set(type);
  }
}