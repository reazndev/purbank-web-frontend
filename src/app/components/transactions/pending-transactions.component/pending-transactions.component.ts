import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-pending-transactions',
  imports: [CommonModule],
  templateUrl: './pending-transactions.component.html',
  styleUrl: './pending-transactions.component.css',
})
export class PendingTransactionsComponent {
  transactions = [
    { 
      name: 'Transaction 1', 
      account: 'Mock Account 1', 
      amount: 12500,
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      kontoId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
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
      account: 'Mock Account 2', 
      amount: 50000,
      id: '4fb85f64-5717-4562-b3fc-2c963f66afa7',
      kontoId: '4fb85f64-5717-4562-b3fc-2c963f66afa7',
      toIban: 'CH12 0483 5012 3456 7800 9',
      message: 'Salary transfer',
      note: 'December salary',
      executionType: 'SCHEDULED',
      executionDate: '2025-12-20',
      status: 'PENDING',
      locked: true
    },
    { 
      name: 'Transaction 3', 
      account: 'Mock Account 3', 
      amount: -5000,
      id: '5fc85f64-5717-4562-b3fc-2c963f66afa8',
      kontoId: '5fc85f64-5717-4562-b3fc-2c963f66afa8',
      toIban: 'CH56 0483 5098 7654 3210 0',
      message: 'Rent payment',
      note: 'December rent',
      executionType: 'INSTANT',
      executionDate: '2025-12-14',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 4', 
      account: 'Mock Account 4', 
      amount: 20000,
      id: '6fd85f64-5717-4562-b3fc-2c963f66afa9',
      kontoId: '6fd85f64-5717-4562-b3fc-2c963f66afa9',
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
      account: 'Mock Account 5', 
      amount: 500,
      id: '7fe85f64-5717-4562-b3fc-2c963f66afb0',
      kontoId: '7fe85f64-5717-4562-b3fc-2c963f66afb0',
      toIban: 'CH31 8123 9000 0012 4568 9',
      message: 'Refund',
      note: 'Product return refund',
      executionType: 'INSTANT',
      executionDate: '2025-12-14',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 6', 
      account: 'Mock Account 6', 
      amount: 2500,
      id: '8ff85f64-5717-4562-b3fc-2c963f66afb1',
      kontoId: '8ff85f64-5717-4562-b3fc-2c963f66afb1',
      toIban: 'CH45 0900 0000 1234 5678 9',
      message: 'Freelance payment',
      note: 'Project milestone 2',
      executionType: 'INSTANT',
      executionDate: '2025-12-16',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 7', 
      account: 'Mock Account 7', 
      amount: -2500,
      id: '9fg85f64-5717-4562-b3fc-2c963f66afb2',
      kontoId: '9fg85f64-5717-4562-b3fc-2c963f66afb2',
      toIban: 'CH67 0023 3233 1234 5678 9',
      message: 'Insurance premium',
      note: 'Annual health insurance',
      executionType: 'SCHEDULED',
      executionDate: '2025-12-19',
      status: 'PENDING',
      locked: true
    },
    { 
      name: 'Transaction 8', 
      account: 'Mock Account 8', 
      amount: 5,
      id: 'afh85f64-5717-4562-b3fc-2c963f66afb3',
      kontoId: 'afh85f64-5717-4562-b3fc-2c963f66afb3',
      toIban: 'CH10 0070 0110 0002 2200 5',
      message: 'Coffee money',
      note: 'Thanks for help',
      executionType: 'INSTANT',
      executionDate: '2025-12-14',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 9', 
      account: 'Mock Account 9', 
      amount: 100,
      id: 'bfi85f64-5717-4562-b3fc-2c963f66afb4',
      kontoId: 'bfi85f64-5717-4562-b3fc-2c963f66afb4',
      toIban: 'CH82 0023 5235 8529 1234 5',
      message: 'Gift',
      note: 'Birthday present',
      executionType: 'INSTANT',
      executionDate: '2025-12-15',
      status: 'PENDING',
      locked: false
    },
    { 
      name: 'Transaction 10', 
      account: 'Mock Account 10', 
      amount: 200,
      id: 'cfj85f64-5717-4562-b3fc-2c963f66afb5',
      kontoId: 'cfj85f64-5717-4562-b3fc-2c963f66afb5',
      toIban: 'CH44 3199 9123 0008 8901 2',
      message: 'Utilities payment',
      note: 'Water and electricity',
      executionType: 'SCHEDULED',
      executionDate: '2025-12-17',
      status: 'PENDING',
      locked: false
    },
  ];
  // TODO: connect with backend once pushed
  // TODO: show transactions from accounts with multiple members with icon (public/icons/users.svg)

  constructor(public languageService: LanguageService) {}

  isExpanded: boolean = false;
  selectedTransaction: any = null;
  showDetailModal: boolean = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

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
    } else if (this.isExpanded) {
      this.toggleExpand();
    }
  }

  get totalAmount(): number {
    return this.transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  protected MathAbs(val: number): number {
    return Math.abs(val);
  }
}
