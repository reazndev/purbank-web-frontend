import { Component, computed, inject } from '@angular/core';
import { LanguageService, Language } from '../services/language.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [],
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.css'
})
export class LanguageToggleComponent {
  private readonly languageService = inject(LanguageService);
  
  currentLanguage = this.languageService.getCurrentLanguage();
  translations = computed(() => this.languageService.getTranslations());

  toggleLanguage(): void {
    const newLanguage: Language = this.currentLanguage() === 'de' ? 'en' : 'de';
    this.languageService.setLanguage(newLanguage);
  }

  getToggleText(): string {
    return this.currentLanguage() === 'de' 
      ? this.translations().viewInEnglish 
      : this.translations().viewInGerman;
  }
}