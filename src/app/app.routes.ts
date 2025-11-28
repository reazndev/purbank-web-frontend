import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { NeuanmeldungComponent } from './pages/neuanmeldung/neuanmeldung.component';
import { SupportComponent } from './pages/support/support.component';
import { DevelopmentComponent } from './pages/development/development.component';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { WealthComponent } from './pages/wealth/wealth';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'registration', component: NeuanmeldungComponent },
  { path: 'support', component: SupportComponent },
  { path: 'development', component: DevelopmentComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'wealth', component: WealthComponent }
];
