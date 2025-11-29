import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-analytics',
  imports: [RouterModule, FooterComponent, NavbarComponent],
  templateUrl: './analytics.page.html',
  styleUrl: './analytics.page.css',
})
export class AnalyticsPage {

}
