import { Component, HostListener, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../shared/services/language.service';
import { PaymentsService, Payment } from '../../../shared/services/payments.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { TransactionFilterService } from '../../../shared/services/transaction-filter.service';
import { forkJoin } from 'rxjs';

interface PaymentDisplay {
  id: string;
  name: string;
  account: string; // accountId in reality? No, looks like name based on usage in template {{transaction.name}}
  accountId: string; // Add this
  amount: number;
  toIban: string;
  fromIban: string;
  message: string;
  note: string;
  executionType: string;
  executionDate: string;
  locked: boolean;
  currency: string;
}

@Component({
  selector: 'app-pending-transactions',
  imports: [CommonModule, FormsModule],
  templateUrl: './pending-transactions.component.html',
  styleUrl: './pending-transactions.component.css',
})
export class PendingTransactionsComponent implements OnInit {
  transactions: PaymentDisplay[] = []; // Displayed
  private allTransactions: PaymentDisplay[] = []; // All fetched
  isLoading = true;
  konten: Konto[] = [];
  totalAmountCHF: number = 0;
  private filterService = inject(TransactionFilterService);
  
  // TODO: show transactions from accounts wiht multiple members with icon (public/icons/users.svg)

  constructor(
    public languageService: LanguageService,
    private paymentsService: PaymentsService,
    private kontenService: KontenService,
    private currencyService: CurrencyService
  ) {
    effect(() => {
      const selectedId = this.filterService.getSelectedKontoId()();
      this.filterTransactions(selectedId);
    });
  }

  isExpanded: boolean = false;
  selectedTransaction: any = null;
  showDetailModal: boolean = false;
  showEditModal: boolean = false;
  editingPayment: PaymentDisplay | null = null;
  editForm = {
    toIban: '',
    amount: 0,
    message: '',
    note: '',
    executionDate: ''
  };

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments(): void {
    forkJoin({
      konten: this.kontenService.getKonten(),
      payments: this.paymentsService.getAllPayments()
    }).subscribe({
      next: ({ konten, payments }) => {
        this.konten = konten;
        
        // most recent first
        const sortedPayments = payments.sort((a, b) => {
          const dateA = a.executionDate || '';
          const dateB = b.executionDate || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        
        this.allTransactions = sortedPayments.map(p => {
          const konto = this.konten.find(k => k.kontoId === p.kontoId);
          return {
            id: p.id,
            name: konto?.kontoName || 'Unknown Account',
            account: p.kontoId, // This seems to be the ID in the original code, confusing naming in interface but okay
            accountId: p.kontoId,
            amount: p.amount,
            toIban: p.toIban,
            fromIban: konto?.iban || '',
            message: p.message,
            note: p.note,
            executionType: p.executionType,
            executionDate: p.executionDate,
            locked: p.locked,
            currency: konto?.currency || 'CHF'
          };
        });
        
        this.filterTransactions(this.filterService.getSelectedKontoId()());
        this.isLoading = false;
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
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    // Convert all transaction amounts to CHF and sum them
    const transactionAmounts = this.transactions.map(t => ({
      amount: t.amount,
      currency: t.currency
    }));

    if (transactionAmounts.length === 0) {
      this.totalAmountCHF = 0;
      return;
    }

    this.currencyService.convertAndSum(transactionAmounts, 'CHF').subscribe({
      next: (total) => {
        this.totalAmountCHF = Math.round(total * 100) / 100;
      },
      error: (error) => {
        console.error('Failed to calculate total amount:', error);
        // Fallback: just sum CHF transactions
        this.totalAmountCHF = this.transactions
          .filter(t => t.currency === 'CHF')
          .reduce((sum, t) => sum + t.amount, 0);
      }
    });
  }

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

  showEditModal_func(transaction: PaymentDisplay) {
    if (transaction.locked) {
      alert('This payment is locked and cannot be edited.');
      return;
    }
    this.editingPayment = transaction;
    this.editForm = {
      toIban: transaction.toIban,
      amount: transaction.amount,
      message: transaction.message,
      note: transaction.note,
      executionDate: transaction.executionDate
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingPayment = null;
  }

  savePayment() {
    if (!this.editingPayment) return;

    this.paymentsService.updatePayment(this.editingPayment.id, this.editForm).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadPayments();
      },
      error: (error) => {
        alert('Failed to update payment. Please try again.');
      }
    });
  }

  deletePayment(paymentId: string) {
    if (!confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    this.paymentsService.deletePayment(paymentId).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadPayments();
      },
      error: (error) => {
        alert('Failed to delete payment. Please try again.');
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.showEditModal) {
      this.closeEditModal();
    } else if (this.showDetailModal) {
      this.closeDetailModal();
    } else if (this.isExpanded) {
      this.toggleExpand();
    }
  }

  MathAbs(val: number): number {
    return Math.abs(val);
  }
}
