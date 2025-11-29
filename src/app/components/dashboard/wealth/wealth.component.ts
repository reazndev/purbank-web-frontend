import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-wealth',
  standalone: true,
  templateUrl: './wealth.component.html',
  styleUrls: ['./wealth.component.css'],
})
export class DashboardWealthComponent {
  constructor(public languageService: LanguageService) {}
}
