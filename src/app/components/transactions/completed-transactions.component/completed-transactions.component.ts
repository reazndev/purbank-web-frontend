import { Component, HostListener, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Transaction, Konto } from '../../../shared/services/konten.service';
import { TransactionFilterService } from '../../../shared/services/transaction-filter.service';

interface TransactionDisplay {
  name: string;
  account: string;
  accountId: string;
  amount: number;
  date: string;
  otherPartyIban: string;
  note: string;
  currency: string;
  transactionType: 'INCOMING' | 'OUTGOING';
  locked?: boolean;
}

@Component({
  selector: 'app-completed-transactions',
  imports: [CommonModule],
  templateUrl: './completed-transactions.component.html',
  styleUrl: './completed-transactions.component.css',
})
export class CompletedTransactionsComponent implements OnInit {
  transactions: TransactionDisplay[] = []; // Displayed (filtered)
  private allTransactions: TransactionDisplay[] = []; // All fetched
  isLoading = true;
  private filterService = inject(TransactionFilterService);

  // TODO: shocase date in german -> Sonntag, 30. November instead of in English
  // TODO: show transactions from accounts wiht multiple members with icon (public/icons/users.svg)
  // TODO: implement automated ftests

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService
  ) {
    effect(() => {
      const selectedId = this.filterService.getSelectedKontoId()();
      this.filterTransactions(selectedId);
    });
  }

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
        const allDisplayTransactions: TransactionDisplay[] = [];

        transactionRequests.forEach((request, index) => {
          request.subscribe({
            next: (data: Transaction[]) => {
              const myKonto = konten[index];
              
              const mapped = data.map(t => ({
                name: t.message,
                account: myKonto.kontoName,
                accountId: myKonto.kontoId,
                amount: t.amount,
                date: t.timestamp,
                otherPartyIban: t.iban,
                note: t.note,
                currency: t.currency || myKonto.currency || 'CHF',
                transactionType: t.transactionType,
                locked: false 
              }));
              
              allDisplayTransactions.push(...mapped);
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                // Sort by timestamp (most recent first)
                allDisplayTransactions.sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                
                this.allTransactions = allDisplayTransactions;
                // Filter initially based on current selection
                this.filterTransactions(this.filterService.getSelectedKontoId()());
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

  filterTransactions(selectedId: string): void {
    if (selectedId === 'all') {
      this.transactions = [...this.allTransactions];
    } else {
      this.transactions = this.allTransactions.filter(t => t.accountId === selectedId);
    }
    this.groupTransactions();
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
