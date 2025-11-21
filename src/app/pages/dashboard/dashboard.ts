import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../shared/services/language.service';
import { ComponentDashboardWealth } from '../../components/dashboard/wealth/wealth';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, ComponentDashboardWealth, FooterComponent, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {

}
