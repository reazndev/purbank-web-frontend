import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionFilterService {
  // 'all' or a specific kontoId
  private selectedKontoId = signal<string>('all');

  getSelectedKontoId() {
    return this.selectedKontoId.asReadonly();
  }

  setSelectedKontoId(id: string) {
    this.selectedKontoId.set(id);
  }
}