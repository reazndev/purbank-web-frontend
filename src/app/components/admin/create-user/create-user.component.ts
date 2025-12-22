import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  @Output() userCreated = new EventEmitter<void>();

  showCreateForm = false;
  isCreating = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  newUser = {
    email: '',
    firstName: '',
    lastName: ''
  };

  constructor(readonly adminService: AdminService) {}

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  createUser() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.adminService.createUser(this.newUser).subscribe({
      next: (createdUser) => {
        this.successMessage = `User ${createdUser.firstName} ${createdUser.lastName} created successfully!`;
        this.isCreating = false;
        this.resetForm();
        this.userCreated.emit();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
          this.showCreateForm = false;
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create user. Please try again.';
        this.isCreating = false;
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.newUser.email.trim() &&
      this.newUser.firstName.trim() &&
      this.newUser.lastName.trim()
    );
  }

  resetForm() {
    this.newUser = {
      email: '',
      firstName: '',
      lastName: ''
    };
    this.errorMessage = null;
    this.successMessage = null;
  }
}
