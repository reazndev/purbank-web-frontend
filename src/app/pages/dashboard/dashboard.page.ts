import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardWealthComponent } from '../../components/dashboard/wealth/wealth.component';
import { DashboardTransactionsComponent } from '../../components/dashboard/transactions/transactions.component';
import { DashboardChartComponent } from '../../components/dashboard/chart/chart.component';
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
