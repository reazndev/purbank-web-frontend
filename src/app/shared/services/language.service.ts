import { Injectable, signal } from '@angular/core';

export type Language = 'de' | 'en';

export interface Translations {
  dashboard: string;
  wealth: string;
  transactions: string;
  analytics: string;
  logout: string;
  dark: string;
  light: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = signal<Language>('de');
  
  private translations: Record<Language, Translations> = {
    de: {
      dashboard: 'Dashboard',
      wealth: 'Vermögen',
      transactions: 'Transaktionen',
      analytics: 'Analyse',
      logout: 'Abmelden',
      dark: 'Dunkel',
      light: 'Hell'
    },
    en: {
      dashboard: 'Dashboard',
      wealth: 'Wealth',
      transactions: 'Transactions',
      analytics: 'Analytics',
      logout: 'Logout',
      dark: 'Dark',
      light: 'Light'
    }
  };

  constructor() {
    // Load language from localStorage or default to German
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      this.currentLanguage.set(savedLanguage);
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage.asReadonly();
  }

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
    localStorage.setItem('language', language);
  }

  getTranslations(): Translations {
    return this.translations[this.currentLanguage()];
  }

  translate(key: keyof Translations): string {
    return this.translations[this.currentLanguage()][key];
  }
}