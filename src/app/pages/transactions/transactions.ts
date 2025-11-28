
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentWealthDetailed } from '../../components/wealth/wealth-detailed/wealth-detailed';
import { SettingsComponent } from '../../components/wealth/settings/settings';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PieChartComponent } from '../../components/wealth/pie-chart/pie-chart';
import { NegPosChartComponent } from '../../components/wealth/neg-pos-chart/neg-pos-chart';


@Component({
  selector: 'app-wealth',
  imports: [RouterModule, ComponentWealthDetailed, SettingsComponent, FooterComponent, NavbarComponent, PieChartComponent, NegPosChartComponent],
  templateUrl: './wealth.html',
  styleUrls: ['./wealth.css'],
})
export class WealthComponent {

}
