import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, UserDetails } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnChanges {
  @Input() userId: string | null = null;
  
  userDetails: UserDetails | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.loadUserDetails();
    } else if (changes['userId'] && !this.userId) {
      this.userDetails = null;
      this.errorMessage = null;
    }
  }

  loadUserDetails() {
    if (!this.userId) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getUserDetails(this.userId).subscribe({
      next: (details) => {
        this.userDetails = details;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
