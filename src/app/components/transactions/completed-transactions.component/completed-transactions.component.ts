import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Transaction, Konto } from '../../../shared/services/konten.service';

interface TransactionDisplay {
  name: string;
  account: string;
  amount: number;
  date: string;
  fromIban: string;
  note: string;
}

@Component({
  selector: 'app-completed-transactions',
  imports: [CommonModule],
  templateUrl: './completed-transactions.component.html',
  styleUrl: './completed-transactions.component.css',
})
export class CompletedTransactionsComponent implements OnInit {
  transactions: TransactionDisplay[] = [];
  isLoading = true;

  // TODO: shocase date in german -> Sonntag, 30. November instead of in English
  // TODO: show transactions from accounts wiht multiple members with icon (public/icons/users.svg)
  // TODO: implement automated ftests

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService
  ) {}

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
    this.loadTransactions();
  }

  loadTransactions(): void {
    // Get all konten first
    this.kontenService.getKonten().subscribe({
      next: (konten: Konto[]) => {
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
            next: (data: Transaction[]) => {
              allTransactions.push(...data);
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                // Sort by timestamp (most recent first)
                allTransactions.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                
                // Transform API transactions to display format
                this.transactions = allTransactions.map(t => ({
                  name: t.message,
                  account: t.fromIban,
                  amount: t.amount,
                  date: t.timestamp.split('T')[0],
                  fromIban: t.fromIban,
                  note: t.note
                }));
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
