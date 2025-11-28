import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-wealth',
  standalone: true,
  templateUrl: './wealth.html',
  styleUrls: ['./wealth.css'],
})
export class DashboardWealthComponent {
  constructor(public languageService: LanguageService) {}
}
