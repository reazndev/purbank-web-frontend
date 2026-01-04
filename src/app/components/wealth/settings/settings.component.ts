import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService } from '../../../shared/services/konten.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class WealthSettingsComponent {
  showCreateModal = false;
  showDeleteModal = false;
  showInviteModal = false;
  accountName = '';
  currency = 'CHF';
  currencies = ['CHF', 'EUR', 'USD'];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  deletableAccounts: any[] = [];
  invitableAccounts: any[] = [];
  selectedAccountId: string | null = null;
  inviteContractNumber = '';
  inviteRole: 'OWNER' | 'MANAGER' | 'VIEWER' = 'VIEWER';

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService
  ) {}

  openCreateModal(): void {
    this.showCreateModal = true;
    this.accountName = '';
    this.currency = 'CHF';
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.accountName = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  createAccount(): void {
    if (!this.accountName.trim()) {
      this.errorMessage = 'Account name is required';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.kontenService.createKonto(this.accountName, this.currency).subscribe({
      next: (response) => {
        this.successMessage = `Account "${this.accountName}" created successfully!`;
        this.isSubmitting = false;
        setTimeout(() => {
          this.closeCreateModal();
          window.location.reload(); // Reload to show new account
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to create account. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedAccountId = null;
    this.loadDeletableAccounts();
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deletableAccounts = [];
    this.selectedAccountId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  loadDeletableAccounts(): void {
    this.kontenService.getKonten().subscribe({
      next: (konten) => {
        this.deletableAccounts = konten.filter(konto => konto.balance === 0);
        if (this.deletableAccounts.length === 0) {
          this.errorMessage = 'No accounts available for deletion. Only accounts with 0 balance can be deleted.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load accounts. Please try again.';
      }
    });
  }

  selectAccount(kontoId: string): void {
    this.selectedAccountId = kontoId;
  }

  deleteAccount(): void {
    if (!this.selectedAccountId) {
      this.errorMessage = 'Please select an account to delete';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.kontenService.deleteKonto(this.selectedAccountId).subscribe({
      next: (response) => {
        this.successMessage = 'Account deleted successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.closeDeleteModal();
          window.location.reload(); // Reload to show updated accounts
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete account. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  openInviteModal(): void {
    this.showInviteModal = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedAccountId = null;
    this.inviteContractNumber = '';
    this.inviteRole = 'VIEWER';
    this.loadInvitableAccounts();
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
    this.invitableAccounts = [];
    this.selectedAccountId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  loadInvitableAccounts(): void {
    this.kontenService.getKonten().subscribe({
      next: (konten) => {
        // Only OWNER can invite
        this.invitableAccounts = konten.filter(konto => konto.role === 'OWNER');
        if (this.invitableAccounts.length === 0) {
          this.errorMessage = 'No accounts available. You must be the OWNER of an account to invite members.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load accounts. Please try again.';
      }
    });
  }

  inviteMember(): void {
    if (!this.selectedAccountId) {
      this.errorMessage = 'Please select an account';
      return;
    }
    if (!this.inviteContractNumber.trim()) {
      this.errorMessage = 'Contract number is required';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.kontenService.inviteMember(this.selectedAccountId, {
      contractNumber: this.inviteContractNumber,
      role: this.inviteRole,
      deviceId: '' // Will be filled by service
    }).subscribe({
      next: (response) => {
        this.successMessage = 'Invitation sent successfully!';
        this.isSubmitting = false;
        setTimeout(() => {
          this.closeInviteModal();
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to invite member. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
