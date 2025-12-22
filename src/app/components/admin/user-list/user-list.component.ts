import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, User } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Output() userSelected = new EventEmitter<string>();
  
  users: User[] = [];
  selectedUserId: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(readonly adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage = 'Access denied. Your account does not have admin privileges. Please ensure the JWT token includes the ADMIN role.';
        } else {
          this.errorMessage = 'Failed to load users. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  selectUser(userId: string) {
    this.selectedUserId = userId;
    this.userSelected.emit(userId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
