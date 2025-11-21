import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.html',
  styleUrls: ['./chart.css'],
})
export class ComponentDashboardChart {
  constructor(public languageService: LanguageService) {}
}
