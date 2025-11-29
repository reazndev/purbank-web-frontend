import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardWealthComponent } from '../../components/dashboard/wealth/wealth';
import { DashboardTransactionsComponent } from '../../components/dashboard/transactions/transactions';
import { DashboardChartComponent } from '../../components/dashboard/chart/chart';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, DashboardWealthComponent, FooterComponent, NavbarComponent, DashboardTransactionsComponent, DashboardChartComponent],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
})
export class DashboardPage {

}
