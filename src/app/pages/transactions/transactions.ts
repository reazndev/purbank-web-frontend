
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentWealthDetailed } from '../../components/wealth/wealth-detailed/wealth-detailed';
import { SettingsComponent } from '../../components/wealth/settings/settings';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-transactions',
  imports: [RouterModule, ComponentWealthDetailed, SettingsComponent, FooterComponent, NavbarComponent],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css'],
})
export class TransactionsComponent {

}
