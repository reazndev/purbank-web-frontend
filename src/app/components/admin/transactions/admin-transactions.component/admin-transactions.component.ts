import { Component, Input, OnChanges, SimpleChanges, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, TransactionDTO } from '../../../../shared/services/admin.service';
import { LanguageService } from '../../../../shared/services/language.service';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-transactions.component.html',
  styleUrls: ['./admin-transactions.component.css']
})
export class AdminTransactionsComponent implements OnChanges {
  @Input() kontoId: string | null = null;
  @Input() userId: string | null = null;
  
  private adminService: AdminService = inject(AdminService);
  public languageService: LanguageService = inject(LanguageService);
  translations = computed(() => this.languageService.getTranslations());
  
  transactions: TransactionDTO[] = [];
  isLoading = false;
  error: string | null = null;
  
  selectedTransaction: TransactionDTO | null = null;
  showDetailModal = false;
  
  isEditing = false;
  editForm: Partial<TransactionDTO> = {};
  groupedTransactions: { date: string; transactions: TransactionDTO[] }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['kontoId'] || changes['userId']) && (this.kontoId || this.userId)) {
      this.loadTransactions();
    } else if (!this.kontoId && !this.userId) {
      this.transactions = [];
      this.groupedTransactions = [];
    }
  }

  loadTransactions() {
    this.isLoading = true;
    
    if (this.kontoId) {
        this.adminService.getTransactionsForKonto(this.kontoId).subscribe({
            next: (data: TransactionDTO[]) => {
                this.processTransactions(data);
            },
            error: (err: any) => {
                this.error = 'Failed to load transactions';
                this.isLoading = false;
            }
        });
    } else if (this.userId) {
        // Fallback: Fetch all accounts, then fetch transactions for each
        this.adminService.getKontenForUser(this.userId).subscribe({
            next: (konten) => {
                if (konten.length === 0) {
                    this.processTransactions([]);
                    return;
                }
                
                const allTransactions: TransactionDTO[] = [];
                let completed = 0;
                
                konten.forEach(konto => {
                    this.adminService.getTransactionsForKonto(konto.kontoId).subscribe({
                        next: (data) => {
                            allTransactions.push(...data);
                            completed++;
                            if (completed === konten.length) {
                                this.processTransactions(allTransactions);
                            }
                        },
                        error: () => {
                            completed++;
                            if (completed === konten.length) {
                                this.processTransactions(allTransactions);
                            }
                        }
                    });
                });
            },
            error: (err) => {
                this.error = 'Failed to load user accounts';
                this.isLoading = false;
            }
        });
    }
  }

  processTransactions(data: TransactionDTO[]) {
    data.forEach(t => {
      if (t.transactionType === 'INTEREST') {
        t.message = t.message.replace(/ rate$/, '').replace(/ rate /, ' ');
      }
    });
    this.transactions = data.sort((a: TransactionDTO, b: TransactionDTO) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    this.groupTransactions();
    this.isLoading = false;
  }

  groupTransactions() {
    const groups: { date: string; transactions: TransactionDTO[] }[] = [];
    this.transactions.forEach(t => {
      const dateKey = t.timestamp.split('T')[0];
      const existingGroup = groups.find(g => g.date === dateKey);
      if (existingGroup) {
        existingGroup.transactions.push(t);
      } else {
        groups.push({ date: dateKey, transactions: [t] });
      }
    });
    this.groupedTransactions = groups;
  }

  showTransactionDetail(transaction: TransactionDTO) {
    this.selectedTransaction = transaction;
    this.showDetailModal = true;
    this.isEditing = false;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedTransaction = null;
    this.isEditing = false;
  }

  editTransaction(transaction: TransactionDTO) {
    this.selectedTransaction = transaction;
    this.editForm = { ...transaction };
    this.isEditing = true;
    this.showDetailModal = true;
  }

  startEdit() {
    if (this.selectedTransaction) {
      this.editForm = { ...this.selectedTransaction };
      this.isEditing = true;
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveTransaction() {
    if (!this.selectedTransaction) return;
    
    this.adminService.updateTransaction(this.selectedTransaction.transactionId, this.editForm).subscribe({
      next: () => {
        this.loadTransactions();
        this.isEditing = false;
        if (this.selectedTransaction) {
            // Update the selected transaction in place for the modal view
            Object.assign(this.selectedTransaction, this.editForm);
        }
      },
      error: (err: any) => {
        console.error('Failed to update transaction', err);
      }
    });
  }

  deleteTransaction() {
    if (!this.selectedTransaction) return;
    if (!confirm(this.languageService.translate('deletePayment') + '?')) return;

    this.adminService.deleteTransaction(this.selectedTransaction.transactionId).subscribe({
      next: () => {
        this.loadTransactions();
        this.closeDetailModal();
      },
      error: (err: any) => {
        console.error('Failed to delete transaction', err);
      }
    });
  }

  MathAbs(val: number): number {
    return Math.abs(val);
  }
}
