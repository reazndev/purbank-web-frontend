import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.css'],
})
export class PieChartComponent {
  constructor(public languageService: LanguageService) {}
}