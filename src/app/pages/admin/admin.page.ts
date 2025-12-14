import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserListComponent } from '../../components/admin/user-list/user-list.component';
import { UserDetailsComponent } from '../../components/admin/user-details/user-details.component';
import { RegistrationCodesComponent } from '../../components/admin/registration-codes/registration-codes.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    UserListComponent,
    UserDetailsComponent,
    RegistrationCodesComponent
  ],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.css']
})
export class AdminPage {
  selectedUserId: string | null = null;

  onUserSelected(userId: string) {
    this.selectedUserId = userId;
  }
}
