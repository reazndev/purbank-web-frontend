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
  createAccountContent: string;
  viewInEnglish: string;
  viewInGerman: string;
  loginTitle: string;
  contractNumber: string;
  password: string;
  loginButton: string;
  newRegistration: string;
  createAccount: string;
  neuanmeldungTitle: string;
  supportTitle: string;
  supportContent: string;
  phoneLabel: string;
  emailLabel: string;
  provisional: string;
  current: string;
  seeMore: string;
  accountname: string;
  interestRate: string;
  balance: string;
  quickAction: string;
  openNewAccount: string;
  closeAccount: string;
  positive: string;
  negative: string;
  scrollForMore: string;
  provisionalWealthTooltip: string;
  currentWealthTooltip: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly currentLanguage = signal<Language>('de');

  private readonly translations: Record<Language, Translations> = {
    de: {
      dashboard: 'Dashboard',
      wealth: 'Vermögen',
      transactions: 'Transaktionen',
      analytics: 'Analyse',
      logout: 'Abmelden',
      dark: 'Dunkel',
      light: 'Hell',
      createAccountContent: 'Kontaktieren Sie die nächste PurBank Filiale um ein Konto zu eröffnen.',
      viewInEnglish: 'View this page in English', 
      viewInGerman: 'Diese Seite auf Deutsch anzeigen', 
      loginTitle: 'Login',
      contractNumber: 'Vertragsnummer',
      password: 'Passwort',
      loginButton: 'Anmelden',
      newRegistration: 'Neu? Erstanmeldung',
      createAccount: 'Konto erstellen', // ORIGINAL USECASE: landing page: options | now merged with createAccountTitle as this has the same content and will likely stay that way 
      neuanmeldungTitle: 'Neuanmeldung',
      supportTitle: 'Support',
      supportContent: 'Benötigen Sie Hilfe? Kontaktieren Sie unser Support-Team für alle Fragen rund um Ihr PurBank Konto. Wir sind gerne für Sie da.',
      phoneLabel: 'Telefon:',
      emailLabel: 'Email:',
      provisional: 'Provisorisches',
      current: 'Aktuelles',
      seeMore: 'Siehe mehr',
      accountname: 'Kontoname',
      interestRate: 'Zinssatz',
      balance: 'Kontostand',
      quickAction: 'Schnellaktion',
      openNewAccount: 'Neues Konto eröffnen',
      closeAccount: 'Konto schliessen',
      positive: 'Positiv',
      negative: 'Negativ',
      scrollForMore: 'Scrollen für mehr',
      provisionalWealthTooltip: 'Das provisorische Vermögen zeigt den erwarteten Kontostand basierend auf ausstehenden Transaktionen und geplanten Zahlungen.',
      currentWealthTooltip: 'Das aktuelle Vermögen zeigt den tatsächlichen, bestätigten Kontostand über alle Ihre Konten.'
    },
    en: {
      dashboard: 'Dashboard',
      wealth: 'Wealth',
      transactions: 'Transactions',
      analytics: 'Analytics',
      logout: 'Logout',
      dark: 'Dark',
      light: 'Light',
      createAccountContent: 'Please contact your nearest PurBank branch to open an account.',
      // yes these two are redundant but their values wont change in the future and this just makes it easier to work with
      viewInEnglish: 'View this page in English',
      viewInGerman: 'Diese Seite auf Deutsch anzeigen',
      loginTitle: 'Login',
      contractNumber: 'Account Number',
      password: 'Password',
      loginButton: 'Sign In',
      newRegistration: 'New? Initial Registration',
      createAccount: 'Create Account', // ORIGINAL USECASE: landing page: options | now merged with createAccountTitle as this has the same content and will likely stay that way 
      neuanmeldungTitle: 'Initial Registration',
      supportTitle: 'Support',
      supportContent: 'Need help? Contact our support team for all questions regarding your PurBank account. We are here to assist you.',
      phoneLabel: 'Phone:',
      emailLabel: 'Email:',
      provisional: 'Provisional',
      current: 'Current',
      seeMore: 'See more',
      accountname: 'Account Name',
      interestRate: 'Interest Rate',
      balance: 'Balance',
      quickAction: 'Quick action',
      openNewAccount: 'Open New Account',
      closeAccount: 'Close Account',
      positive: 'Positive',
      negative: 'Negative',
      scrollForMore: 'Scroll for more',
      provisionalWealthTooltip: 'Provisional wealth shows the expected account balance based on pending transactions and scheduled payments.',
      currentWealthTooltip: 'Current wealth shows the actual, confirmed account balance across all your accounts.'
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