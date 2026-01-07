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
  fromIban: string;
  amount: number;
  message: string;
  note: string;
  executionType: string;
  executionDate: string;
  locked: boolean;
  timestamp: string;
  isPending: boolean;
  currency: string;
  transactionType?: 'INCOMING' | 'OUTGOING';
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
        const allTransactions: { transaction: Transaction, konto: Konto }[] = [];

        transactionRequests.forEach((request, index) => {
          request.subscribe({
            next: (data) => {
              // Store transaction with its source account context
              data.forEach(t => {
                allTransactions.push({ transaction: t, konto: konten[index] });
              });
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                const pendingPayments: TransactionDisplay[] = payments.map(p => {
                  const konto = konten.find(k => k.kontoId === p.kontoId);
                  
                  // Check if target IBAN is one of our own accounts
                  const targetOwnAccount = konten.find(k => k.iban === p.toIban);
                  const displayToIban = targetOwnAccount ? targetOwnAccount.kontoName : p.toIban;

                  return {
                    name: p.message || konto?.kontoName || '',
                    account: konto?.kontoName || '',
                    toIban: displayToIban,
                    fromIban: konto?.iban || '',
                    amount: -p.amount, // negative since it's outgoing
                    message: p.message,
                    note: p.note || '',
                    executionType: p.executionType || 'NORMAL',
                    executionDate: p.executionDate || new Date().toISOString(),
                    locked: p.locked !== undefined ? p.locked : false,
                    timestamp: p.executionDate || new Date().toISOString(),
                    isPending: true,
                    currency: konto?.currency || 'CHF'
                  };
                });

                const completedTransactions: TransactionDisplay[] = allTransactions.map(item => {
                  const t = item.transaction;
                  const sourceKonto = item.konto;
                  
                  // For outgoing, t.iban is the receiver. For incoming, it's the sender.
                  const otherPartyOwnAccount = konten.find(k => k.iban === t.iban);
                  const displayIban = otherPartyOwnAccount ? otherPartyOwnAccount.kontoName : t.iban;

                  return {
                    name: t.message || sourceKonto.kontoName,
                    account: sourceKonto.kontoName,
                    toIban: t.transactionType === 'OUTGOING' ? displayIban : '',
                    fromIban: t.transactionType === 'INCOMING' ? displayIban : '',
                    amount: t.amount,
                    message: t.message,
                    note: t.note || '',
                    executionType: 'INSTANT',
                    executionDate: t.timestamp,
                    status: 'Completed',
                    locked: false,
                    timestamp: t.timestamp,
                    isPending: false,
                    currency: t.currency || sourceKonto.currency || 'CHF',
                    transactionType: t.transactionType
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
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                this.isLoading = false;
              }
            }
          });
        });
      },
      error: (error) => {
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
