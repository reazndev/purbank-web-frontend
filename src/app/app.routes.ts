import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { CreateAccountPage } from './pages/create-account/create-account.page';
import { SupportPage } from './pages/support/support.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { WealthPage } from './pages/wealth/wealth.page';
import { TransactionsPage } from './pages/transactions/transactions.page';
import { PaymentsPage } from './pages/payments/payments.page';
import { AdminPage } from './pages/admin/admin.page';
import { ShowcasePage } from './pages/showcase/showcase.page';
import { SessionTimeoutPage } from './pages/session-timeout/session-timeout.page';
import { adminAuthGuard, authGuard } from './shared/services/auth.guard';
import { mobileRedirectGuard } from './shared/guards/mobile-redirect.guard';

export const routes: Routes = [
  { path: '', component: LoginPage, canActivate: [mobileRedirectGuard] },
  { path: 'login', component: LoginPage },
  { path: 'showcase', component: ShowcasePage },
  { path: 'session-timeout', component: SessionTimeoutPage },
  { path: 'create-account', component: CreateAccountPage },
  { path: 'support', component: SupportPage },
  {
    path: 'dashboard',
    component: DashboardPage,
    canActivate: [authGuard]
  },
  {
    path: 'wealth',
    component: WealthPage,
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    component: TransactionsPage,
    canActivate: [authGuard]
  },
  {
    path: 'payments',
    component: PaymentsPage,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminPage,
    canActivate: [adminAuthGuard]
  },
  {
    path: 'management',
    component: AdminPage,
    canActivate: [adminAuthGuard]
  }
];
