import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RegistrationCode {
  id: string;
  registrationCode: string;
  status: 'OPEN' | 'USED';
  title: string;
  description: string;
  createdAt: string;
  usedAt: string | null;
}

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
  
  newCodeTitle = '';
  newCodeDescription = '';
  isCreating = false;
  showCopiedToast = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.loadRegistrationCodes();
      this.showCreateForm = false;
    }
  }

  loadRegistrationCodes() {
    // TODO: Implement API call to fetch registration codes
    // GET /api/v1/admin/users/{userId}/registration
    
    
    // Placeholder for when backend is implemented
    // this.http.get<RegistrationCode[]>(`/api/v1/admin/users/${this.userId}/registration`).subscribe(...)
    
    this.isLoading = false;
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

    // TODO: Implement API call to create registration code
    // POST /api/v1/admin/users/{userId}/registration
    this.isCreating = true;
    
    // Placeholder for when backend is implemented
    // this.http.post(`/api/v1/admin/users/${this.userId}/registration`, {
    //   title: this.newCodeTitle,
    //   description: this.newCodeDescription
    // }).subscribe(...)
    
    this.isCreating = false;
    this.resetForm();
    this.showCreateForm = false;
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
