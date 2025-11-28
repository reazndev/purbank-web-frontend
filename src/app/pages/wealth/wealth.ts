
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentWealthWealthDetailed } from '../../components/wealth/wealth-detailed/wealth-detailed';
import { SettingsComponent } from '../../components/wealth/settings/settings';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { ComponentWealthPieChart } from '../../components/wealth/pie-chart/pie-chart';
import { ComponentWealthNegPosChart } from '../../components/wealth/neg-pos-chart/neg-pos-chart';


@Component({
  selector: 'app-wealth',
  imports: [RouterModule, ComponentWealthWealthDetailed, SettingsComponent, FooterComponent, NavbarComponent, ComponentWealthPieChart, ComponentWealthNegPosChart],
  templateUrl: './wealth.html',
  styleUrls: ['./wealth.css'],
})
export class WealthComponent {

}
