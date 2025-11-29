import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class DashboardChartComponent {
  constructor(public languageService: LanguageService) {}
}
