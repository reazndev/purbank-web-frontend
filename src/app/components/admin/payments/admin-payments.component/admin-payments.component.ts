import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, PaymentDTO } from '../../../../shared/services/admin.service';
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
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Create Payment Form
  newPayment: Partial<PaymentDTO> = {
    kontoId: '',
    toIban: '',
    amount: undefined,
    message: '',
    note: '',
    executionDate: '',
    executionType: 'NORMAL'
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
    } else if (!this.kontoId && !this.userId) {
      this.payments = [];
    }
  }

  loadPayments() {
    this.isLoading = true;
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
    if (!this.kontoId) return;
    this.newPayment.kontoId = this.kontoId;
    
    this.adminService.createPayment(this.newPayment).subscribe({
      next: () => {
        this.successMessage = 'Payment created successfully';
        this.loadPayments();
        this.resetCreateForm();
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err: any) => {
        this.error = 'Failed to create payment';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  resetCreateForm() {
    this.newPayment = {
      kontoId: this.kontoId || '',
      toIban: '',
      amount: undefined,
      message: '',
      note: '',
      executionDate: '',
      executionType: 'NORMAL'
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
