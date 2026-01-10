import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, PaymentDTO, AdminKontoDetails } from '../../../../shared/services/admin.service';
import { LanguageService } from '../../../../shared/services/language.service';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-payments.component.html',
  styleUrls: ['./admin-payments.component.css']
})
export class AdminPaymentsComponent implements OnChanges {
  @Input() kontoId: string | null = null;
  @Input() userId: string | null = null;
  
  private adminService: AdminService = inject(AdminService);
  public languageService: LanguageService = inject(LanguageService);
  
  payments: PaymentDTO[] = [];
  userAccounts: AdminKontoDetails[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Create Payment Form
  newPayment: any = {
    kontoId: '',
    toIban: '',
    amount: undefined,
    message: '',
    note: '',
    executionDate: '',
    executionType: 'NORMAL',
    paymentCurrency: ''
  };

  // Edit Payment
  selectedPayment: PaymentDTO | null = null;
  showEditModal = false;
  editPaymentData: Partial<PaymentDTO> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kontoId'] && this.kontoId) {
      this.newPayment.kontoId = this.kontoId;
      this.loadPayments();
    } else if (changes['userId'] && this.userId) {
      this.loadPayments();
      this.loadUserAccounts();
    } else if (!this.kontoId && !this.userId) {
      this.payments = [];
    }
  }

  loadUserAccounts() {
    if (!this.userId) return;
    this.adminService.getKontenForUser(this.userId).subscribe({
      next: (konten) => {
        this.userAccounts = konten;
        // If there's only one account, select it automatically
        if (konten.length === 1 && !this.newPayment.kontoId) {
          this.newPayment.kontoId = konten[0].kontoId;
          this.newPayment.paymentCurrency = konten[0].currency;
        }
      },
      error: (err) => {
        console.error('Failed to load user accounts', err);
      }
    });
  }

  updateCurrency() {
    if (this.newPayment.kontoId) {
      const account = this.userAccounts.find(a => a.kontoId === this.newPayment.kontoId);
      if (account) {
        this.newPayment.paymentCurrency = account.currency;
      }
    }
  }

  loadPayments() {
    this.isLoading = true;
    
    // If we have a kontoId input, we might need to fetch its details to get the currency
    if (this.kontoId && !this.newPayment.paymentCurrency && this.userId) {
        this.adminService.getKontoDetails(this.kontoId, this.userId).subscribe({
            next: (details) => {
                this.newPayment.paymentCurrency = details.currency;
            }
        });
    }

    const request = this.kontoId 
      ? this.adminService.getPaymentsForKonto(this.kontoId)
      : this.adminService.getPaymentsForUser(this.userId!);

    request.subscribe({
      next: (data: PaymentDTO[]) => {
        this.payments = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load payments';
        this.isLoading = false;
      }
    });
  }

  createPayment() {
    // If kontoId input is set, enforce it. Otherwise, require it to be selected.
    if (this.kontoId) {
      this.newPayment.kontoId = this.kontoId;
    }

    if (!this.newPayment.kontoId) {
      this.error = 'Please select an account';
      return;
    }

    // Ensure currency is set if possible (should be set by selection or load)
    if (!this.newPayment.paymentCurrency && this.userAccounts.length > 0) {
        this.updateCurrency();
    }
    
    // Use the Create Transaction endpoint as per requirements
    // Params: kontoId (path), iban, amount, message, note, transactionType, currency
    this.adminService.createTransaction(
      this.newPayment.kontoId,
      this.newPayment.toIban,
      this.newPayment.amount,
      this.newPayment.message,
      this.newPayment.note,
      'OUTGOING', // Assuming creating a payment is an OUTGOING transaction
      this.newPayment.paymentCurrency || 'CHF' // Default to CHF if missing
    ).subscribe({
      next: () => {
        this.successMessage = 'Transaction created successfully';
        // Note: This creates a transaction, so it won't appear in "Pending Payments"
        // We still reload payments just in case, or we might want to emit an event
        this.loadPayments(); 
        this.resetCreateForm();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err: any) => {
        this.error = 'Failed to create transaction';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  resetCreateForm() {
    // Keep the selected kontoId and currency
    const currentKontoId = this.newPayment.kontoId;
    const currentCurrency = this.newPayment.paymentCurrency;
    
    this.newPayment = {
      kontoId: this.kontoId || currentKontoId || '',
      toIban: '',
      amount: undefined,
      message: '',
      note: '',
      executionDate: '',
      executionType: 'NORMAL',
      paymentCurrency: this.kontoId ? currentCurrency : (currentKontoId ? currentCurrency : '')
    };
  }

  openEditModal(payment: any) {
    this.selectedPayment = payment;
    this.editPaymentData = { ...payment };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPayment = null;
  }

  updatePayment() {
    if (!this.selectedPayment) return;
    this.adminService.updatePayment(this.selectedPayment.id, this.editPaymentData).subscribe({
      next: () => {
        this.successMessage = 'Payment updated successfully';
        this.loadPayments();
        this.closeEditModal();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err: any) => {
        this.error = 'Failed to update payment';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  deletePayment(paymentId: string) {
    if (!confirm(this.languageService.translate('deletePayment') + '?')) return;
    
    this.adminService.deletePayment(paymentId).subscribe({
      next: () => {
        this.successMessage = 'Payment deleted';
        this.loadPayments();
        if (this.showEditModal && this.selectedPayment?.id === paymentId) {
            this.closeEditModal();
        }
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err: any) => {
        this.error = 'Failed to delete payment';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  MathAbs(val: number): number {
    return Math.abs(val || 0);
  }
}
