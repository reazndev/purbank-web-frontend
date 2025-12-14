import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contractNumber: string;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Output() userSelected = new EventEmitter<string>();
  
  users: User[] = [];
  selectedUserId: string | null = null;
  isLoading = false;

  selectUser(userId: string) {
    this.selectedUserId = userId;
    this.userSelected.emit(userId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
