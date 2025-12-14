import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-completed-transactions',
  imports: [CommonModule],
  templateUrl: './completed-transactions.component.html',
  styleUrl: './completed-transactions.component.css',
})
export class CompletedTransactionsComponent implements OnInit {
  transactions = [
    { name: 'Rent', account: 'Main Account', amount: -1500, date: '2025-12-01', id: 'c1', kontoId: 'k1', toIban: 'CH93 0076 2011 6238 5295 7', message: 'Monthly rent', note: 'December rent payment', executionType: 'INSTANT', executionDate: '2025-12-01', status: 'COMPLETED', locked: false },
    { name: 'Salary', account: 'Main Account', amount: 5000, date: '2025-12-01', id: 'c2', kontoId: 'k1', toIban: 'CH12 0483 5012 3456 7800 9', message: 'Salary deposit', note: 'Monthly salary', executionType: 'SCHEDULED', executionDate: '2025-12-01', status: 'COMPLETED', locked: false },
    { name: 'Groceries', account: 'Debit Card', amount: -120, date: '2025-11-30', id: 'c3', kontoId: 'k2', toIban: 'CH56 0483 5098 7654 3210 0', message: 'Grocery shopping', note: 'Weekly groceries', executionType: 'INSTANT', executionDate: '2025-11-30', status: 'COMPLETED', locked: false },
    { name: 'Restaurant', account: 'Credit Card', amount: -85, date: '2025-11-30', id: 'c4', kontoId: 'k3', toIban: 'CH89 3704 0044 0532 0130 0', message: 'Dinner payment', note: 'Restaurant La Bella', executionType: 'INSTANT', executionDate: '2025-11-30', status: 'COMPLETED', locked: false },
    { name: 'Utilities', account: 'Main Account', amount: -200, date: '2025-11-29', id: 'c5', kontoId: 'k1', toIban: 'CH31 8123 9000 0012 4568 9', message: 'Utilities payment', note: 'Gas and water', executionType: 'SCHEDULED', executionDate: '2025-11-29', status: 'COMPLETED', locked: false },
    { name: 'Internet', account: 'Main Account', amount: -60, date: '2025-11-29', id: 'c6', kontoId: 'k1', toIban: 'CH45 0900 0000 1234 5678 9', message: 'Internet bill', note: 'Monthly internet', executionType: 'INSTANT', executionDate: '2025-11-29', status: 'COMPLETED', locked: false },
    { name: 'Insurance', account: 'Main Account', amount: -300, date: '2025-11-28', id: 'c7', kontoId: 'k1', toIban: 'CH67 0023 3233 1234 5678 9', message: 'Insurance premium', note: 'Monthly insurance', executionType: 'SCHEDULED', executionDate: '2025-11-28', status: 'COMPLETED', locked: false },
    { name: 'Cinema', account: 'Debit Card', amount: -30, date: '2025-11-28', id: 'c8', kontoId: 'k2', toIban: 'CH10 0070 0110 0002 2200 5', message: 'Movie tickets', note: 'Cinema Pathé', executionType: 'INSTANT', executionDate: '2025-11-28', status: 'COMPLETED', locked: false },
    { name: 'Gym', account: 'Debit Card', amount: -50, date: '2025-11-28', id: 'c9', kontoId: 'k2', toIban: 'CH82 0023 5235 8529 1234 5', message: 'Gym membership', note: 'Monthly gym fee', executionType: 'SCHEDULED', executionDate: '2025-11-28', status: 'COMPLETED', locked: false },
    { name: 'Transfer', account: 'Savings', amount: -1000, date: '2025-11-25', id: 'c10', kontoId: 'k4', toIban: 'CH44 3199 9123 0008 8901 2', message: 'Savings transfer', note: 'Monthly savings', executionType: 'INSTANT', executionDate: '2025-11-25', status: 'COMPLETED', locked: false },
    { name: 'Coffee', account: 'Debit Card', amount: -5, date: '2025-11-24', id: 'c11', kontoId: 'k2', toIban: 'CH93 0076 2011 6238 5295 8', message: 'Coffee purchase', note: 'Morning coffee', executionType: 'INSTANT', executionDate: '2025-11-24', status: 'COMPLETED', locked: false },
    { name: 'Lunch', account: 'Main Account', amount: -25, date: '2025-11-24', id: 'c12', kontoId: 'k1', toIban: 'CH12 0483 5012 3456 7800 1', message: 'Lunch payment', note: 'Cafeteria', executionType: 'INSTANT', executionDate: '2025-11-24', status: 'COMPLETED', locked: false },
    { name: 'Book Store', account: 'Credit Card', amount: -45, date: '2025-11-23', id: 'c13', kontoId: 'k3', toIban: 'CH56 0483 5098 7654 3210 1', message: 'Book purchase', note: 'Programming books', executionType: 'INSTANT', executionDate: '2025-11-23', status: 'COMPLETED', locked: false },
    { name: 'Online Course', account: 'Credit Card', amount: -199, date: '2025-11-22', id: 'c14', kontoId: 'k3', toIban: 'CH89 3704 0044 0532 0130 1', message: 'Course payment', note: 'Udemy Angular course', executionType: 'INSTANT', executionDate: '2025-11-22', status: 'COMPLETED', locked: false },
    { name: 'Gas Station', account: 'Debit Card', amount: -80, date: '2025-11-21', id: 'c15', kontoId: 'k2', toIban: 'CH31 8123 9000 0012 4568 1', message: 'Fuel purchase', note: 'Shell station', executionType: 'INSTANT', executionDate: '2025-11-21', status: 'COMPLETED', locked: false },
    { name: 'Supermarket', account: 'Main Account', amount: -150, date: '2025-11-20', id: 'c16', kontoId: 'k1', toIban: 'CH45 0900 0000 1234 5679 0', message: 'Shopping', note: 'Migros', executionType: 'INSTANT', executionDate: '2025-11-20', status: 'COMPLETED', locked: false },
    { name: 'Streaming Svc', account: 'Credit Card', amount: -15, date: '2025-11-19', id: 'c17', kontoId: 'k3', toIban: 'CH67 0023 3233 1234 5679 0', message: 'Netflix subscription', note: 'Monthly fee', executionType: 'SCHEDULED', executionDate: '2025-11-19', status: 'COMPLETED', locked: false },
    { name: 'Mobile Bill', account: 'Main Account', amount: -45, date: '2025-11-18', id: 'c18', kontoId: 'k1', toIban: 'CH10 0070 0110 0002 2201 6', message: 'Mobile phone bill', note: 'Swisscom', executionType: 'SCHEDULED', executionDate: '2025-11-18', status: 'COMPLETED', locked: false },
    { name: 'Electricity', account: 'Main Account', amount: -90, date: '2025-11-17', id: 'c19', kontoId: 'k1', toIban: 'CH82 0023 5235 8529 1235 6', message: 'Electricity bill', note: 'Monthly electricity', executionType: 'SCHEDULED', executionDate: '2025-11-17', status: 'COMPLETED', locked: false },
    { name: 'Water Bill', account: 'Main Account', amount: -30, date: '2025-11-17', id: 'c20', kontoId: 'k1', toIban: 'CH44 3199 9123 0008 8902 3', message: 'Water bill', note: 'Monthly water', executionType: 'SCHEDULED', executionDate: '2025-11-17', status: 'COMPLETED', locked: false },
    { name: 'Train Ticket', account: 'Debit Card', amount: -120, date: '2025-11-16', id: 'c21', kontoId: 'k2', toIban: 'CH93 0076 2011 6238 5296 8', message: 'Train tickets', note: 'SBB Zurich-Bern', executionType: 'INSTANT', executionDate: '2025-11-16', status: 'COMPLETED', locked: false },
    { name: 'Gift Shop', account: 'Debit Card', amount: -40, date: '2025-11-15', id: 'c22', kontoId: 'k2', toIban: 'CH12 0483 5012 3456 7801 2', message: 'Gift purchase', note: 'Birthday gift', executionType: 'INSTANT', executionDate: '2025-11-15', status: 'COMPLETED', locked: false },
    { name: 'Pharmacy', account: 'Main Account', amount: -25, date: '2025-11-14', id: 'c23', kontoId: 'k1', toIban: 'CH56 0483 5098 7654 3211 2', message: 'Medication', note: 'Pharmacy Coop', executionType: 'INSTANT', executionDate: '2025-11-14', status: 'COMPLETED', locked: false },
    { name: 'Bakery', account: 'Cash', amount: -10, date: '2025-11-13', id: 'c24', kontoId: 'k5', toIban: 'CH89 3704 0044 0532 0131 2', message: 'Bread purchase', note: 'Local bakery', executionType: 'INSTANT', executionDate: '2025-11-13', status: 'COMPLETED', locked: false },
    { name: 'Hardware Store', account: 'Credit Card', amount: -230, date: '2025-11-12', id: 'c25', kontoId: 'k3', toIban: 'CH31 8123 9000 0012 4569 2', message: 'Hardware purchase', note: 'Tools and supplies', executionType: 'INSTANT', executionDate: '2025-11-12', status: 'COMPLETED', locked: false },
  ];

  // TODO: connect with backend once pushed
  // TODO: shocase date in german -> Sonntag, 30. November instead of in English
  // TODO: show transactions from accounts wiht multiple members with icon (public/icons/users.svg)

  // TODO: implement automated ftests

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

  groupedTransactions: { date: string; transactions: any[] }[] = [];

  ngOnInit() {
    const groups: { date: string; transactions: any[] }[] = [];
    this.transactions.forEach(t => {
      const existingGroup = groups.find(g => g.date === t.date);
      if (existingGroup) {
        existingGroup.transactions.push(t);
      } else {
        groups.push({ date: t.date, transactions: [t] });
      }
    });
    this.groupedTransactions = groups;
  }

  protected MathAbs(val: number): number {
    return Math.abs(val);
  }
}
