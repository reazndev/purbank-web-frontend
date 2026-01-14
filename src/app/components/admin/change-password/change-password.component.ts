import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLoginService } from '../../../shared/services/admin-login.service';
import { LanguageService } from '../../../shared/services/language.service';

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
  error: string;
  success: string;
  loading: boolean;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private readonly adminLoginService = inject(AdminLoginService);
  private readonly languageService = inject(LanguageService);
  translations = computed(() => this.languageService.getTranslations());

  formState: PasswordFormState = {
    currentPassword: '',
    newPassword: '',
    confirmationPassword: '',
    error: '',
    success: '',
    loading: false
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  showModal = false;

  openModal(): void {
    this.showModal = true;
    this.formState.error = '';
    this.formState.success = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.formState.currentPassword = '';
    this.formState.newPassword = '';
    this.formState.confirmationPassword = '';
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  validatePasswords(): boolean {
    if (this.formState.newPassword !== this.formState.confirmationPassword) {
      this.formState.error = 'New password and confirmation do not match.';
      return false;
    }

    return true;
  }

  onSubmit(): void {
    this.formState.error = '';
    this.formState.success = '';

    if (!this.validatePasswords()) {
      return;
    }

    this.formState.loading = true;

    this.adminLoginService.changePassword({
      currentPassword: this.formState.currentPassword,
      newPassword: this.formState.newPassword,
      confirmationPassword: this.formState.confirmationPassword
    }).subscribe({
      next: () => {
        this.formState = {
          currentPassword: '',
          newPassword: '',
          confirmationPassword: '',
          error: '',
          success: 'Password changed successfully!',
          loading: false
        };
        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
      },
      error: (error: any) => {
        this.formState.loading = false;

        let errorMessage = 'Failed to change password. Please try again.';

        if (error.status === 401) {
          errorMessage = 'Current password is incorrect.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.formState.error = errorMessage;
      }
    });
  }
}
