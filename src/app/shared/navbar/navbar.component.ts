import { Component, computed, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LanguageService, Language } from '../services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  
  currentLanguage = this.languageService.getCurrentLanguage();
  translations = computed(() => this.languageService.getTranslations());

  setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  isLanguageActive(language: Language): boolean {
    return this.currentLanguage() === language;
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}