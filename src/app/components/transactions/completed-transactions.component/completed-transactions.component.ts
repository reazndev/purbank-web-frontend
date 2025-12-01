import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-completed-transactions',
  imports: [CommonModule],
  templateUrl: './completed-transactions.component.html',
  styleUrl: './completed-transactions.component.css',
})
export class CompletedTransactionsComponent {
  transactions = [
    { name: 'Rent', account: 'Main Account', amount: -1500, date: '2025-12-01' },
    { name: 'Salary', account: 'Main Account', amount: 5000, date: '2025-12-01' },
    { name: 'Groceries', account: 'Debit Card', amount: -120, date: '2025-11-30' },
    { name: 'Restaurant', account: 'Credit Card', amount: -85, date: '2025-11-30' },
    { name: 'Utilities', account: 'Main Account', amount: -200, date: '2025-11-29' },
    { name: 'Internet', account: 'Main Account', amount: -60, date: '2025-11-29' },
    { name: 'Insurance', account: 'Main Account', amount: -300, date: '2025-11-28' },
    { name: 'Cinema', account: 'Debit Card', amount: -30, date: '2025-11-28' },
    { name: 'Gym', account: 'Debit Card', amount: -50, date: '2025-11-28' },
    { name: 'Transfer', account: 'Savings', amount: -1000, date: '2025-11-25' },
    { name: 'Coffee', account: 'Debit Card', amount: -5, date: '2025-11-24' },
    { name: 'Lunch', account: 'Main Account', amount: -25, date: '2025-11-24' },
    { name: 'Book Store', account: 'Credit Card', amount: -45, date: '2025-11-23' },
    { name: 'Online Course', account: 'Credit Card', amount: -199, date: '2025-11-22' },
    { name: 'Gas Station', account: 'Debit Card', amount: -80, date: '2025-11-21' },
    { name: 'Supermarket', account: 'Main Account', amount: -150, date: '2025-11-20' },
    { name: 'Streaming Svc', account: 'Credit Card', amount: -15, date: '2025-11-19' },
    { name: 'Mobile Bill', account: 'Main Account', amount: -45, date: '2025-11-18' },
    { name: 'Electricity', account: 'Main Account', amount: -90, date: '2025-11-17' },
    { name: 'Water Bill', account: 'Main Account', amount: -30, date: '2025-11-17' },
    { name: 'Train Ticket', account: 'Debit Card', amount: -120, date: '2025-11-16' },
    { name: 'Gift Shop', account: 'Debit Card', amount: -40, date: '2025-11-15' },
    { name: 'Pharmacy', account: 'Main Account', amount: -25, date: '2025-11-14' },
    { name: 'Bakery', account: 'Cash', amount: -10, date: '2025-11-13' },
    { name: 'Hardware Store', account: 'Credit Card', amount: -230, date: '2025-11-12' },
  ];

  // TODO: connect with backend once pushed
  // TODO: shocase date in german -> Sonntag, 30. November instead of in English
  // TODO: show transactions from accounts wiht multiple members with icon (public/icons/users.svg)

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

  get groupedTransactions() {
    const groups: { date: string; transactions: any[] }[] = [];
    this.transactions.forEach(t => {
      const existingGroup = groups.find(g => g.date === t.date);
      if (existingGroup) {
        existingGroup.transactions.push(t);
      } else {
        groups.push({ date: t.date, transactions: [t] });
      }
    });
    return groups;
  }

  protected MathAbs(val: number): number {
    return Math.abs(val);
  }
}
