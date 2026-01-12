
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WealthWealthDetailedComponent } from '../../components/wealth/wealth-detailed/wealth-detailed.component';
import { WealthSettingsComponent } from '../../components/wealth/settings/settings.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { WealthPieChartComponent } from '../../components/wealth/pie-chart/pie-chart.component';
import { WealthBalanceHistoryChartComponent } from '../../components/wealth/balance-history-chart/balance-history-chart.component';


@Component({
  selector: 'app-wealth',
  imports: [RouterModule, WealthWealthDetailedComponent, WealthSettingsComponent, FooterComponent, NavbarComponent, WealthPieChartComponent, WealthBalanceHistoryChartComponent],
  templateUrl: './wealth.page.html',
  styleUrls: ['./wealth.page.css'],
})
export class WealthPage {

}
