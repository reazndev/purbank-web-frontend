import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { CreateAccountPage } from './pages/create-account/create-account.page';
import { NeuanmeldungPage } from './pages/neuanmeldung/neuanmeldung.page';
import { SupportPage } from './pages/support/support.page';
import { DevelopmentPage } from './pages/development/development.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { WealthPage } from './pages/wealth/wealth.page';
import { TransactionsPage } from './pages/transactions/transactions.page';

export const routes: Routes = [
  { path: '', component: LoginPage },
  { path: 'login', component: LoginPage },
  { path: 'create-account', component: CreateAccountPage },
  { path: 'registration', component: NeuanmeldungPage },
  { path: 'support', component: SupportPage },
  { path: 'development', component: DevelopmentPage },
  { path: 'dashboard', component: DashboardPage },
  { path: 'wealth', component: WealthPage },
  { path: 'transactions', component: TransactionsPage }
];
