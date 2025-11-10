import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-mobile-warning',
  standalone: true,
  templateUrl: './mobile-warning.component.html',
  styleUrls: ['./mobile-warning.component.css']
})
export class MobileWarningComponent {
  private languageService = inject(LanguageService);
  
  getCurrentLanguage() {
    return this.languageService.getCurrentLanguage();
  }
}