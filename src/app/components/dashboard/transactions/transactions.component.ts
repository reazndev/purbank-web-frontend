import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Transaction, Konto } from '../../../shared/services/konten.service';
import { PaymentsService, Payment } from '../../../shared/services/payments.service';
import { forkJoin } from 'rxjs';

interface TransactionDisplay {
  message: string;
  amount: number;
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
    // Load both konten and payments
    forkJoin({
      konten: this.kontenService.getKonten(),
      payments: this.paymentsService.getAllPayments()
    }).subscribe({
      next: ({ konten, payments }) => {
        if (konten.length === 0) {
          this.isLoading = false;
          return;
        }

        // Fetch transactions from all konten
        const transactionRequests = konten.map(konto => 
          this.kontenService.getTransactions(konto.kontoId)
        );

        // Wait for all requests to complete
        let completedRequests = 0;
        const allTransactions: Transaction[] = [];

        transactionRequests.forEach((request, index) => {
          request.subscribe({
            next: (data) => {
              allTransactions.push(...data);
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                // Convert payments to TransactionDisplay format (pending)
                const pendingPayments: TransactionDisplay[] = payments.map(p => ({
                  message: p.message,
                  amount: -p.amount, // negative since it's outgoing
                  timestamp: p.executionDate || p.execution_date || new Date().toISOString(),
                  isPending: true
                }));

                // Convert transactions to TransactionDisplay format
                const completedTransactions: TransactionDisplay[] = allTransactions.map(t => ({
                  message: t.message,
                  amount: t.amount,
                  timestamp: t.timestamp,
                  isPending: false
                }));

                // Sort pending payments by execution date (most recent first)
                pendingPayments.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );

                // Sort completed transactions by timestamp (most recent first)
                completedTransactions.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                
                // Combine: pending payments first, then completed transactions
                this.transactions = [...pendingPayments, ...completedTransactions];
                // Show only the first 8 items for the dashboard
                this.displayedTransactions = this.transactions.slice(0, 8);
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

  showTransactionDetail(transaction: TransactionDisplay): void {
    this.selectedTransaction = transaction;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedTransaction = null;
  }
}
