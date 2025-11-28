import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-wealth-detailed',
  standalone: true,
  templateUrl: './wealth-detailed.html',
  styleUrls: ['./wealth-detailed.css'],
})
export class WealthWealthDetailedComponent {
  constructor(public languageService: LanguageService) {}
}