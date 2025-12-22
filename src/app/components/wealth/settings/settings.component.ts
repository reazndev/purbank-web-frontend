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
  accountName = '';
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  deletableAccounts: any[] = [];
  selectedAccountId: string | null = null;

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService
  ) {}

  openCreateModal(): void {
    this.showCreateModal = true;
    this.accountName = '';
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

    this.kontenService.createKonto(this.accountName).subscribe({
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
}
