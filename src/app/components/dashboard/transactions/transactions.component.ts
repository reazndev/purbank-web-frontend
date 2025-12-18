import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Transaction, Konto } from '../../../shared/services/konten.service';
import { PaymentsService, Payment } from '../../../shared/services/payments.service';
import { forkJoin } from 'rxjs';

interface TransactionDisplay {
  name: string;
  account: string;
  toIban: string;
  amount: number;
  message: string;
  note: string;
  executionType: string;
  executionDate: string;
  locked: boolean;
  timestamp: string;
  isPending: boolean;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class DashboardTransactionsComponent implements OnInit {
  transactions: TransactionDisplay[] = [];
  displayedTransactions: TransactionDisplay[] = [];
  groupedTransactions: { date: string; isPending: boolean; transactions: TransactionDisplay[] }[] = [];
  isLoading = true;
  Math = Math;
  showDetailModal = false;
  selectedTransaction: TransactionDisplay | null = null;

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    forkJoin({
      konten: this.kontenService.getKonten(),
      payments: this.paymentsService.getAllPayments()
    }).subscribe({
      next: ({ konten, payments }) => {
        if (konten.length === 0) {
          this.isLoading = false;
          return;
        }

        const transactionRequests = konten.map(konto => 
          this.kontenService.getTransactions(konto.kontoId)
        );

        let completedRequests = 0;
        const allTransactions: Transaction[] = [];

        transactionRequests.forEach((request, index) => {
          request.subscribe({
            next: (data) => {
              allTransactions.push(...data);
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                const pendingPayments: TransactionDisplay[] = payments.map(p => {
                  const konto = konten.find(k => k.kontoId === p.kontoId);
                  return {
                    name: p.message || '',
                    account: konto?.kontoName || '',
                    toIban: p.toIban,
                    amount: -p.amount, // negative since it's outgoing
                    message: p.message,
                    note: p.note || '',
                    executionType: p.executionType || p.executionType || 'NORMAL',
                    executionDate: p.executionDate || p.executionDate || new Date().toISOString(),
                    locked: p.locked !== undefined ? p.locked : false,
                    timestamp: p.executionDate || p.executionDate || new Date().toISOString(),
                    isPending: true
                  };
                });

                const completedTransactions: TransactionDisplay[] = allTransactions.map(t => {
                  const konto = konten.find(k => k.iban === t.fromIban);
                  return {
                    name: t.message || '',
                    account: konto?.kontoName || '',
                    toIban: t.fromIban || '',
                    amount: t.amount,
                    message: t.message,
                    note: t.note || '',
                    executionType: 'INSTANT',
                    executionDate: t.timestamp,
                    status: 'Completed',
                    locked: false,
                    timestamp: t.timestamp,
                    isPending: false
                  };
                });

                pendingPayments.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                completedTransactions.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                
                this.transactions = [...pendingPayments, ...completedTransactions];
                this.displayedTransactions = this.transactions.slice(0, 50);
                this.groupTransactions();
                this.isLoading = false;
              }
            },
            error: (error) => {
              console.error('Error loading transactions for konto:', error);
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                this.isLoading = false;
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading konten:', error);
        this.isLoading = false;
      }
    });
  }

  groupTransactions(): void {
    const groups: { date: string; isPending: boolean; transactions: TransactionDisplay[] }[] = [];
    
    // Group pending transactions together
    const pendingTransactions = this.displayedTransactions.filter(t => t.isPending);
    if (pendingTransactions.length > 0) {
      groups.push({ 
        date: 'pending', 
        isPending: true, 
        transactions: pendingTransactions 
      });
    }
    
    // Group completed transactions by date
    const completedTransactions = this.displayedTransactions.filter(t => !t.isPending);
    completedTransactions.forEach(t => {
      const date = t.timestamp.split('T')[0];
      const existingGroup = groups.find(g => g.date === date && !g.isPending);
      if (existingGroup) {
        existingGroup.transactions.push(t);
      } else {
        groups.push({ date, isPending: false, transactions: [t] });
      }
    });
    
    this.groupedTransactions = groups;
  }

  showTransactionDetail(transaction: TransactionDisplay): void {
    this.selectedTransaction = transaction;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedTransaction = null;
  }
}
