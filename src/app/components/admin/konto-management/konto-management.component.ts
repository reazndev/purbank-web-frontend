import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminKontoDetails, AdminKontoMember, TransactionDTO } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-konto-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './konto-management.component.html',
  styleUrls: ['./konto-management.component.css']
})
export class KontoManagementComponent implements OnChanges {
  @Input() userId: string | null = null;
  
  private adminService = inject(AdminService);
  
  konten: AdminKontoDetails[] = [];
  selectedKonto: AdminKontoDetails | null = null;
  members: AdminKontoMember[] = [];
  transactions: TransactionDTO[] = [];
  
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;

  // Create Konto Form
  showCreateModal = false;
  newKontoName = '';
  newKontoCurrency = 'CHF';

  // Update Konto Form
  showEditModal = false;
  editKontoId = '';
  editKontoName = '';
  editKontoZinssatz = 0;
  editBalanceAdjustment = 0;

  // Transaction Edit Form
  editingTransactionId: string | null = null;
  editTransactionNote = '';

  // Details Modal
  showDetailsModal = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.loadKonten();
    } else if (!this.userId) {
      this.konten = [];
    }
  }

  loadKonten() {
    if (!this.userId) return;
    this.isLoading = true;
    this.adminService.getKontenForUser(this.userId).subscribe({
      next: (data) => {
        this.konten = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load accounts';
        this.isLoading = false;
      }
    });
  }

  triggerAbrechnung() {
    this.isLoading = true;
    this.adminService.processAbrechnung().subscribe({
      next: (res) => {
        this.successMessage = 'Abrechnung processed successfully';
        this.isLoading = false;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to process Abrechnung';
        this.isLoading = false;
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.newKontoName = '';
    this.newKontoCurrency = 'CHF';
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createKonto() {
    if (!this.userId) return;
    this.adminService.createKontoForUser(this.userId, this.newKontoName, this.newKontoCurrency).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadKonten();
        this.successMessage = 'Account created successfully';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to create account';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  openEditModal(konto: AdminKontoDetails) {
    this.editKontoId = konto.kontoId;
    this.editKontoName = konto.kontoName;
    this.editKontoZinssatz = (konto.zinssatz || 0) * 100;
    this.editBalanceAdjustment = 0;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateKonto() {
    this.adminService.updateKonto(
      this.editKontoId, 
      this.editKontoName, 
      this.editKontoZinssatz / 100, 
      this.editBalanceAdjustment !== 0 ? this.editBalanceAdjustment : undefined
    ).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadKonten(); // Reload list to see updates
        if (this.selectedKonto?.kontoId === this.editKontoId) {
            this.viewDetails(this.editKontoId); // Refresh details if open
        }
        this.successMessage = 'Account updated successfully';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to update account';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  viewDetails(kontoId: string) {
    if (!this.userId) return;
    this.isLoading = true;
    this.adminService.getKontoDetails(kontoId, this.userId).subscribe({
      next: (details) => {
        this.selectedKonto = details;
        this.loadMembers(kontoId);
        this.loadTransactions(kontoId);
        this.showDetailsModal = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load details';
        this.isLoading = false;
      }
    });
  }

  loadMembers(kontoId: string) {
    this.adminService.getKontoMembers(kontoId).subscribe({
      next: (members) => {
        this.members = members;
      },
      error: (err) => console.error(err)
    });
  }

  loadTransactions(kontoId: string) {
    this.adminService.getTransactionsForKonto(kontoId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (err) => console.error(err)
    });
  }

  startEditTransaction(transaction: TransactionDTO) {
    this.editingTransactionId = transaction.transactionId;
    this.editTransactionNote = transaction.note || '';
  }

  cancelEditTransaction() {
    this.editingTransactionId = null;
    this.editTransactionNote = '';
  }

  saveTransactionNote(transactionId: string) {
    this.adminService.updateTransaction(transactionId, { note: this.editTransactionNote }).subscribe({
      next: () => {
        this.successMessage = 'Transaction note updated';
        this.editingTransactionId = null;
        if (this.selectedKonto) {
            this.loadTransactions(this.selectedKonto.kontoId);
        }
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to update transaction note';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedKonto = null;
    this.members = [];
    this.transactions = [];
  }

  closeAccount(konto: AdminKontoDetails) {
    if (!confirm(`Are you sure you want to close account ${konto.kontoName}? This cannot be undone.`)) return;
    
    this.adminService.closeKonto(konto.kontoId).subscribe({
      next: () => {
        this.loadKonten();
        this.successMessage = 'Account closed';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to close account';
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      const originalSuccess = this.successMessage;
      this.successMessage = 'Copied to clipboard';
      setTimeout(() => this.successMessage = originalSuccess, 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}
