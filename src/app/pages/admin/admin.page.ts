import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserListComponent } from '../../components/admin/user-list/user-list.component';
import { UserDetailsComponent } from '../../components/admin/user-details/user-details.component';
import { RegistrationCodesComponent } from '../../components/admin/registration-codes/registration-codes.component';
import { CreateUserComponent } from '../../components/admin/create-user/create-user.component';
import { KontoManagementComponent } from '../../components/admin/konto-management/konto-management.component';
import { AuditLogsComponent } from '../../components/admin/audit-logs/audit-logs.component';
import { ChangePasswordComponent } from '../../components/admin/change-password/change-password.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    UserListComponent,
    UserDetailsComponent,
    RegistrationCodesComponent,
    CreateUserComponent,
    KontoManagementComponent,
    AuditLogsComponent,
    ChangePasswordComponent
  ],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.css']
})
export class AdminPage {
  @ViewChild(UserListComponent) userListComponent!: UserListComponent;
  
  selectedUserId: string | null = null;

  onUserSelected(userId: string) {
    this.selectedUserId = userId;
  }

  onUserCreated() {
    if (this.userListComponent) {
      this.userListComponent.loadUsers();
    }
  }
}
