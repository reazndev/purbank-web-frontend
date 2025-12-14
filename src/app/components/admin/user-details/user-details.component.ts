import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contractNumber: string;
  status: string;
  createdAt: string;
}

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && this.userId) {
      this.loadUserDetails();
    }
  }

  loadUserDetails() {
    // TODO: Implement API call to fetch user details
    // GET /api/v1/admin/users/{userId}
    
    
    // Placeholder for when backend is implemented
    // this.http.get<UserDetails>(`/api/v1/admin/users/${this.userId}`).subscribe(...)
    
    this.isLoading = false;
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
