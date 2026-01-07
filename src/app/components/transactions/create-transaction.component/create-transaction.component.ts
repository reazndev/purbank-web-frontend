import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { KontenService, Konto } from '../../../shared/services/konten.service';
import { PaymentsService, CreatePaymentRequest } from '../../../shared/services/payments.service';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent implements OnInit {
  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService,
    private paymentsService: PaymentsService
  ) {}

  accounts: Konto[] = []; // Source accounts (Owner/Manager)
  allAccounts: Konto[] = []; // All accounts for internal transfer destination
  selectedAccount: string = '';
  isInstant: boolean = false;
  isReoccuring: boolean = false;
  isInternalTransfer: boolean = false;
  ibanReceiver: string = '';
  selectedDestinationAccount: string = ''; // ID of selected destination account
  amount: number = 0;
  message: string = '';
  note: string = '';
  executionDate: string = '';
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.loadAccounts();
    // Set execution date to next day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.executionDate = tomorrow.toISOString().split('T')[0];
  }

  getMinDate(): string {
    // Return tomorrow's date as the minimum selectable date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.kontenService.getKonten().subscribe({
      next: (konten) => {
        this.allAccounts = konten;
        // Filter accounts to only include OWNER and MANAGER roles for source
        this.accounts = konten.filter(konto => 
          konto.role === 'OWNER' || konto.role === 'MANAGER'
        );
        if (this.accounts.length > 0) {
          this.selectedAccount = this.accounts[0].kontoId;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load accounts';
        this.isLoading = false;
      }
    });
  }

  getAvailableDestinationAccounts(): Konto[] {
    return this.allAccounts.filter(a => a.kontoId !== this.selectedAccount);
  }

  onDestinationAccountChange(): void {
    const account = this.allAccounts.find(a => a.kontoId === this.selectedDestinationAccount);
    if (account) {
      this.ibanReceiver = account.iban;
    }
  }

  onInternalTransferToggle(): void {
    this.ibanReceiver = '';
    this.selectedDestinationAccount = '';
  }

  getSelectedAccountBalance(): number {
    const account = this.accounts.find(a => a.kontoId === this.selectedAccount);
    return account ? account.balance : 0;
  }

  getSelectedAccountCurrency(): string {
    const account = this.accounts.find(a => a.kontoId === this.selectedAccount);
    return account ? account.currency : 'CHF';
  }

  calculateBalanceAfter(): string {
    const currentBalance = this.getSelectedAccountBalance();
    const balanceAfter = currentBalance - this.amount;
    return balanceAfter.toFixed(2);
  }

  createPayment(): void {
    // Validation
    if (!this.selectedAccount) {
      this.errorMessage = 'Please select an account';
      return;
    }
    if (!this.ibanReceiver || this.ibanReceiver.trim() === '') {
      this.errorMessage = 'Please enter receiver IBAN';
      return;
    }
    if (this.amount <= 0) {
      this.errorMessage = 'Amount must be greater than 0';
      return;
    }

    // Validate execution date for non-instant payments
    if (!this.isInstant) {
      const selectedDate = new Date(this.executionDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < tomorrow) {
        this.errorMessage = 'Execution date must be tomorrow or later';
        return;
      }
    }

    // Check balance for instant payments
    if (this.isInstant) {
      const balance = this.getSelectedAccountBalance();
      if (balance < this.amount) {
        this.errorMessage = 'Insufficient funds for instant payment';
        return;
      }
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payment: CreatePaymentRequest = {
      kontoId: this.selectedAccount,
      toIban: this.ibanReceiver,
      amount: this.amount,
      paymentCurrency: this.getSelectedAccountCurrency(),
      message: this.message,
      note: this.note,
      executionType: this.isInstant ? 'INSTANT' : 'NORMAL',
      executionDate: this.isInstant ? new Date().toISOString().split('T')[0] : this.executionDate
    };

    this.paymentsService.createPayment(payment).subscribe({
      next: (response) => {
        this.successMessage = `Payment created successfully! ${this.isInstant ? 'Executing immediately...' : 'Will be processed at 1:00 AM Zurich time.'}`;
        this.isSubmitting = false;
        
        // Refresh page after 2 seconds to update all components
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create payment. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.ibanReceiver = '';
    this.selectedDestinationAccount = '';
    this.amount = 0;
    this.message = '';
    this.note = '';
    // Set execution date to next day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.executionDate = tomorrow.toISOString().split('T')[0];
    this.isInstant = false;
    this.isReoccuring = false;
    this.isInternalTransfer = false;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
