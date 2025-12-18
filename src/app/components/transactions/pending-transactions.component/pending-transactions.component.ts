import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../shared/services/language.service';
import { PaymentsService, Payment } from '../../../shared/services/payments.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';
import { forkJoin } from 'rxjs';

interface PaymentDisplay {
  id: string;
  name: string;
  account: string;
  amount: number;
  toIban: string;
  message: string;
  note: string;
  executionType: string;
  executionDate: string;
  locked: boolean;
}

@Component({
  selector: 'app-pending-transactions',
  imports: [CommonModule, FormsModule],
  templateUrl: './pending-transactions.component.html',
  styleUrl: './pending-transactions.component.css',
})
export class PendingTransactionsComponent implements OnInit {
  transactions: PaymentDisplay[] = [];
  isLoading = true;
  konten: Konto[] = [];
  // TODO: show transactions from accounts wiht multiple members with icon (public/icons/users.svg)

  constructor(
    public languageService: LanguageService,
    private paymentsService: PaymentsService,
    private kontenService: KontenService
  ) {}

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
        
        this.transactions = sortedPayments.map(p => {
          const konto = this.konten.find(k => k.kontoId === p.kontoId);
          return {
            id: p.id,
            name: konto?.kontoName || 'Unknown Account',
            account: p.kontoId,
            amount: p.amount,
            toIban: p.toIban,
            message: p.message,
            note: p.note,
            executionType: p.executionType,
            executionDate: p.executionDate,
            locked: p.locked
          };
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.isLoading = false;
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
        console.error('Error updating payment:', error);
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
        console.error('Error deleting payment:', error);
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

  get totalAmount(): number {
    return this.transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  protected MathAbs(val: number): number {
    return Math.abs(val);
  }
}
