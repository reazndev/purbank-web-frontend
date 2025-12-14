import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class DashboardTransactionsComponent {
  transactions = [
    { 
      name: 'Transaction 1', 
      amount: 12500,
      id: 'd1a85f64-5717-4562-b3fc-2c963f66afa6',
      account: 'Main Account',
      kontoId: 'd1a85f64-5717-4562-b3fc-2c963f66afa6', // TODO: Replace with real account name once backend is connected
      toIban: 'CH93 0076 2011 6238 5295 7',
      message: 'Payment for services',
      note: 'Monthly payment',
      executionType: 'INSTANT',
      executionDate: '2025-12-15',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 2', 
      amount: 50000,
      id: 'd2b85f64-5717-4562-b3fc-2c963f66afa7',
      account: 'Savings Account',
      kontoId: 'd2b85f64-5717-4562-b3fc-2c963f66afa7', // TODO: Replace with real account name once backend is connected
      toIban: 'CH12 0483 5012 3456 7800 9',
      message: 'Investment deposit',
      note: 'Quarterly investment',
      executionType: 'SCHEDULED',
      executionDate: '2025-12-20',
      status: 'PENDING',
      locked: true
    },
    { 
      name: 'Transaction 3', 
      amount: -5000,
      id: 'd3c85f64-5717-4562-b3fc-2c963f66afa8',
      account: 'Main Account',
      kontoId: 'd3c85f64-5717-4562-b3fc-2c963f66afa8', // TODO: Replace with real account name once backend is connected
      toIban: 'CH56 0483 5098 7654 3210 0',
      message: 'Rent payment',
      note: 'December rent',
      executionType: 'INSTANT',
      executionDate: '2025-12-14',
      status: 'COMPLETED',
      locked: false
    },
    { 
      name: 'Transaction 4', 
      amount: 20000,
      id: 'd4d85f64-5717-4562-b3fc-2c963f66afa9',
      account: 'Investment Account',
      kontoId: 'd4d85f64-5717-4562-b3fc-2c963f66afa9', // TODO: Replace with real account name once backend is connected
      toIban: 'CH89 3704 0044 0532 0130 0',
      message: 'Investment return',
      note: 'Quarterly dividend',
      executionType: 'SCHEDULED',
      executionDate: '2025-12-18',
      status: 'PENDING',
      locked: true
    },
    { 
      name: 'Transaction 5', 
      amount: 600000000000000,
      id: 'd5e85f64-5717-4562-b3fc-2c963f66afb0',
      account: 'Business Account',
      kontoId: 'd5e85f64-5717-4562-b3fc-2c963f66afb0', // TODO: Replace with real account name once backend is connected
      toIban: 'CH31 8123 9000 0012 4568 9',
      message: 'Large transaction',
      note: 'Business deal',
      executionType: 'INSTANT',
      executionDate: '2025-12-14',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 6', 
      amount: 2500,
      id: 'd6f85f64-5717-4562-b3fc-2c963f66afb1',
      account: 'Main Account',
      kontoId: 'd6f85f64-5717-4562-b3fc-2c963f66afb1', // TODO: Replace with real account name once backend is connected
      toIban: 'CH45 0900 0000 1234 5678 9',
      message: 'Freelance payment',
      note: 'Project milestone',
      executionType: 'INSTANT',
      executionDate: '2025-12-16',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 7', 
      amount: -2500,
      id: 'd7g85f64-5717-4562-b3fc-2c963f66afb2',
      account: 'Main Account',
      kontoId: 'd7g85f64-5717-4562-b3fc-2c963f66afb2', // TODO: Replace with real account name once backend is connected
      toIban: 'CH67 0023 3233 1234 5678 9',
      message: 'Insurance premium',
      note: 'Annual health insurance',
      executionType: 'SCHEDULED',
      executionDate: '2025-12-19',
      status: 'COMPLETED',
      locked: true
    },
    { 
      name: 'Longer name - cutoff 25chars  wowowowowwoo', 
      amount: 5,
      id: 'd8h85f64-5717-4562-b3fc-2c963f66afb3',
      account: 'Debit Card',
      kontoId: 'd8h85f64-5717-4562-b3fc-2c963f66afb3', // TODO: Replace with real account name once backend is connected
      toIban: 'CH10 0070 0110 0002 2200 5',
      message: 'Small payment',
      note: 'Coffee money',
      executionType: 'INSTANT',
      executionDate: '2025-12-14',
      status: 'COMPLETED',
      locked: false
    },
  ];
  // TODO: connect with backend once pushed

  selectedTransaction: any = null;
  showDetailModal: boolean = false;

  constructor(public languageService: LanguageService) {}

  showTransactionDetail(transaction: any) {
    this.selectedTransaction = transaction;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedTransaction = null;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.showDetailModal) {
      this.closeDetailModal();
    }
  }

  protected MathAbs(val: number): number {
    return Math.abs(val);
  }
}
