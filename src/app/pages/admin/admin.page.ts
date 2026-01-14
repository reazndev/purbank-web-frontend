import { Component, ViewChild, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { LanguageToggleComponent } from '../../shared/language-toggle/language-toggle.component';
import { LanguageService } from '../../shared/services/language.service';
import { UserListComponent } from '../../components/admin/user-list/user-list.component';
import { UserDetailsComponent } from '../../components/admin/user-details/user-details.component';
import { RegistrationCodesComponent } from '../../components/admin/registration-codes/registration-codes.component';
import { CreateUserComponent } from '../../components/admin/create-user/create-user.component';
import { KontoManagementComponent } from '../../components/admin/konto-management/konto-management.component';
import { AuditLogsComponent } from '../../components/admin/audit-logs/audit-logs.component';
import { ChangePasswordComponent } from '../../components/admin/change-password/change-password.component';
import { AdminTransactionsComponent } from '../../components/admin/transactions/admin-transactions.component/admin-transactions.component';
import { AdminPaymentsComponent } from '../../components/admin/payments/admin-payments.component/admin-payments.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    LanguageToggleComponent,
    UserListComponent,
    UserDetailsComponent,
    RegistrationCodesComponent,
    CreateUserComponent,
    KontoManagementComponent,
    AuditLogsComponent,
    ChangePasswordComponent,
    AdminTransactionsComponent,
    AdminPaymentsComponent
  ],
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.css']
})
export class AdminPage {
  @ViewChild(UserListComponent) userListComponent!: UserListComponent;
  
  private readonly languageService = inject(LanguageService);
  translations = computed(() => this.languageService.getTranslations());

  selectedUserId: string | null = null;
  selectedKontoId: string | null = null;

  onUserSelected(userId: string) {
    this.selectedUserId = userId;
    this.selectedKontoId = null;
  }

  onKontoSelected(kontoId: string | null) {
    this.selectedKontoId = kontoId;
  }

  onUserCreated() {
    if (this.userListComponent) {
      this.userListComponent.loadUsers();
    }
  }
}
