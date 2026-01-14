import { Component, Input, OnChanges, SimpleChanges, inject, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminKontoDetails, AdminKontoMember, TransactionDTO } from '../../../shared/services/admin.service';
import { LanguageService } from '../../../shared/services/language.service';
import { AdminTransactionsComponent } from '../transactions/admin-transactions.component/admin-transactions.component';
import { AdminPaymentsComponent } from '../payments/admin-payments.component/admin-payments.component';

@Component({
  selector: 'app-konto-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminTransactionsComponent, AdminPaymentsComponent],
  templateUrl: './konto-management.component.html',
  styleUrls: ['./konto-management.component.css']
})
export class KontoManagementComponent implements OnChanges {
  @Input() userId: string | null = null;
  @Output() kontoSelected = new EventEmitter<string | null>();
  
  private adminService = inject(AdminService);
  private languageService = inject(LanguageService);
  translations = computed(() => this.languageService.getTranslations());
  
  konten: AdminKontoDetails[] = [];
  selectedKonto: AdminKontoDetails | null = null;
  members: AdminKontoMember[] = [];
  
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

  // Details Modal
  showDetailsModal = false;
  activeTab: 'details' | 'transactions' | 'payments' = 'details';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.loadKonten();
      this.kontoSelected.emit(null);
    } else if (!this.userId) {
      this.konten = [];
      this.kontoSelected.emit(null);
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

  triggerDailyCalculation() {
    this.isLoading = true;
    this.adminService.forceDailyCalculation().subscribe({
      next: (res) => {
        this.successMessage = 'Daily calculation triggered successfully';
        this.isLoading = false;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to trigger daily calculation';
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
        this.activeTab = 'details'; // Default to details tab
        this.showDetailsModal = true;
        this.isLoading = false;
        this.kontoSelected.emit(kontoId);
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

  selectKonto(kontoId: string) {
    this.kontoSelected.emit(kontoId);
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedKonto = null;
    this.members = [];
    this.activeTab = 'details';
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

  setActiveTab(tab: 'details' | 'transactions' | 'payments') {
    this.activeTab = tab;
  }
}