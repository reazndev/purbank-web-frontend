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
    { name: 'Transaction 1', account: 'Mock Account 1', amount: 12500 },
    { name: 'Transaction 2', account: 'Mock Account 2', amount: 50000 },
    { name: 'Transaction 3', account: 'Mock Account 3', amount: -5000 },
    { name: 'Transaction 4', account: 'Mock Account 4', amount: 20000 },
    { name: 'Transaction 5', account: 'Mock Account 5', amount: 500 },
    { name: 'Transaction 6', account: 'Mock Account 6', amount: 2500 },
    { name: 'Transaction 7', account: 'Mock Account 7', amount: -2500 },
    { name: 'Transaction 8', account: 'Mock Account 8', amount: 5 },
     { name: 'Transaction 9', account: 'Mock Account 9', amount: 100 },
     { name: 'Transaction 10', account: 'Mock Account 10', amount: 200 },
  ];
  // TODO: connect with backend once pushed
  // TODO: show transactions from accounts with multiple members with icon (public/icons/users.svg)

  constructor(public languageService: LanguageService) {}

  isExpanded: boolean = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.isExpanded) {
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
