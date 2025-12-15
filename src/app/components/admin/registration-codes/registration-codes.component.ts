import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, RegistrationCode } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-registration-codes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration-codes.component.html',
  styleUrls: ['./registration-codes.component.css']
})
export class RegistrationCodesComponent implements OnChanges {
  @Input() userId: string | null = null;
  
  registrationCodes: RegistrationCode[] = [];
  isLoading = false;
  showCreateForm = false;
  errorMessage: string | null = null;
  
  newCodeTitle = '';
  newCodeDescription = '';
  isCreating = false;
  showCopiedToast = false;

  constructor(readonly adminService: AdminService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.loadRegistrationCodes();
      this.showCreateForm = false;
    } else if (changes['userId'] && !this.userId) {
      this.registrationCodes = [];
      this.errorMessage = null;
    }
  }

  loadRegistrationCodes() {
    if (!this.userId) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getUserRegistrationCodes(this.userId).subscribe({
      next: (codes) => {
        this.registrationCodes = codes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading registration codes:', error);
        this.errorMessage = 'Failed to load registration codes. Please try again.';
        this.isLoading = false;
      }
    });
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  createRegistrationCode() {
    if (!this.userId || !this.newCodeTitle.trim()) {
      return;
    }

    this.isCreating = true;
    this.errorMessage = null;

    this.adminService.createRegistrationCode(this.userId, {
      title: this.newCodeTitle,
      description: this.newCodeDescription
    }).subscribe({
      next: (newCode) => {
        this.registrationCodes = [...this.registrationCodes, newCode];
        this.isCreating = false;
        this.resetForm();
        this.showCreateForm = false;
      },
      error: (error) => {
        console.error('Error creating registration code:', error);
        this.errorMessage = 'Failed to create registration code. Please try again.';
        this.isCreating = false;
      }
    });
  }

  resetForm() {
    this.newCodeTitle = '';
    this.newCodeDescription = '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  copyToClipboard(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.showCopiedToast = true;
      setTimeout(() => {
        this.showCopiedToast = false;
      }, 2000);
    });
  }
}
