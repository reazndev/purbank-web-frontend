
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WealthWealthDetailedComponent } from '../../components/wealth/wealth-detailed/wealth-detailed';
import { WealthSettingsComponent } from '../../components/wealth/settings/settings';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { WealthPieChartComponent } from '../../components/wealth/pie-chart/pie-chart';
import { WealthNegPosChartComponent } from '../../components/wealth/neg-pos-chart/neg-pos-chart';


@Component({
  selector: 'app-wealth',
  imports: [RouterModule, WealthWealthDetailedComponent, WealthSettingsComponent, FooterComponent, NavbarComponent, WealthPieChartComponent, WealthNegPosChartComponent],
  templateUrl: './wealth.page.html',
  styleUrls: ['./wealth.page.css'],
})
export class WealthPage {

}
