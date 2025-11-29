import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class WealthSettingsComponent {
  constructor(public languageService: LanguageService) {}
}
