import { Component, OnInit, effect, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Transaction, Konto } from '../../../shared/services/konten.service';
import { TransactionFilterService } from '../../../shared/services/transaction-filter.service';

interface TransactionDisplay {
  transactionId: string;
  name: string;
  account: string;
  accountId: string;
  amount: number;
  date: string;
  otherPartyIban: string;
  note: string;
  currency: string;
  transactionType: 'INCOMING' | 'OUTGOING' | 'INTEREST';
  locked?: boolean;
}

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions-list.component.html',
  styleUrl: './transactions-list.component.css',
})
export class TransactionsListComponent implements OnInit {
  transactions: TransactionDisplay[] = []; // Displayed (filtered)
  private allTransactions: TransactionDisplay[] = []; // All fetched
  isLoading = true;
  private filterService = inject(TransactionFilterService);
  
  selectedTransaction: any = null;
  showDetailModal: boolean = false;

  editingTransactionId: string | null = null;
  editNoteValue: string = '';

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService
  ) {
    effect(() => {
      const selectedId = this.filterService.getSelectedKontoId()();
      const selectedType = this.filterService.getSelectedTransactionType()();
      this.filterTransactions(selectedId, selectedType);
    });
  }

  groupedTransactions: { date: string; transactions: TransactionDisplay[] }[] = [];

  ngOnInit() {
    this.loadTransactions();
  }

  showTransactionDetail(transaction: any) {
    this.selectedTransaction = transaction;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedTransaction = null;
  }

  startEditNote(transaction: any) {
    this.editingTransactionId = transaction.transactionId;
    this.editNoteValue = transaction.note || '';
  }

  cancelEditNote() {
    this.editingTransactionId = null;
    this.editNoteValue = '';
  }

  saveNote(transaction: any) {
    this.kontenService.updateTransactionNote(transaction.accountId, transaction.transactionId, this.editNoteValue).subscribe({
      next: () => {
        transaction.note = this.editNoteValue;
        this.cancelEditNote();
        // Update allTransactions as well to keep it in sync
        const original = this.allTransactions.find(t => t.transactionId === transaction.transactionId);
        if (original) original.note = this.editNoteValue;
      },
      error: (err) => {
        console.error('Failed to update note', err);
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.showDetailModal) {
      this.closeDetailModal();
    }
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
              
              const mapped = data.map(t => {
                // Check if the IBAN belongs to one of our own accounts
                const ownAccount = konten.find(k => k.iban === t.iban);
                const displayIban = ownAccount ? ownAccount.kontoName : t.iban;

                let name = t.message || myKonto.kontoName;
                if (t.transactionType === 'INTEREST') {
                  name = name.replace(/ rate$/, '').replace(/ rate /, ' ');
                }

                return {
                  transactionId: t.transactionId,
                  name: name,
                  account: myKonto.kontoName,
                  accountId: myKonto.kontoId,
                  amount: t.amount,
                  date: t.timestamp,
                  otherPartyIban: displayIban,
                  note: t.note,
                  currency: t.currency || myKonto.currency || 'CHF',
                  transactionType: t.transactionType,
                  locked: false 
                };
              });
              
              allDisplayTransactions.push(...mapped);
              completedRequests++;
              
              if (completedRequests === transactionRequests.length) {
                // Sort by timestamp (most recent first)
                allDisplayTransactions.sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                
                this.allTransactions = allDisplayTransactions;
                // Filter initially based on current selection
                this.filterTransactions(
                  this.filterService.getSelectedKontoId()(),
                  this.filterService.getSelectedTransactionType()()
                );
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

  filterTransactions(selectedId: string, selectedType: 'all' | 'INCOMING' | 'OUTGOING' = 'all'): void {
    let filtered = this.allTransactions;

    if (selectedId !== 'all') {
      filtered = filtered.filter(t => t.accountId === selectedId);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.transactionType === selectedType);
    }

    this.transactions = filtered;
    this.groupTransactions();
  }

  groupTransactions(): void {
    const groups: { date: string; transactions: TransactionDisplay[] }[] = [];
    this.transactions.forEach(t => {
      // Extract date part from timestamp (YYYY-MM-DD)
      const dateKey = t.date.split('T')[0];
      const existingGroup = groups.find(g => g.date === dateKey);
      if (existingGroup) {
        existingGroup.transactions.push(t);
      } else {
        groups.push({ date: dateKey, transactions: [t] });
      }
    });
    this.groupedTransactions = groups;
  }

  protected MathAbs(val: number): number {
    return Math.abs(val);
  }
}
