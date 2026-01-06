import { Injectable, signal } from '@angular/core';

export type Language = 'de' | 'en';

export interface Translations {
  // General Page names
  dashboard: string;
  wealth: string;
  transactions: string;
  analytics: string;
  logout: string;
  createAccountContent: string;
  exchangeRates: string;
  // Language switcher
  viewInEnglish: string;
  viewInGerman: string;
  // Page: Login
  loginTitle: string;
  contractNumber: string;
  password: string;
  loginButton: string;
  newRegistration: string;
  createAccount: string;
  neuanmeldungTitle: string;
  // Login specific
  mobileVerification: string;
  scanQrCode: string;
  waitingForApproval: string;
  loginApproved: string;
  redirectingToDashboard: string;
  verificationTimeout: string;
  verificationTimeoutMessage: string;
  tryAgain: string;
  email: string;
  enterYourPassword: string;
  hidePassword: string;
  showPassword: string;
  initiatingLogin: string;
  loggingIn: string;
  adminLogin: string;
  userLogin: string;
  // Page: Support
  supportTitle: string;
  supportContent: string;
  phoneLabel: string;
  emailLabel: string;
  // Page: dashboard -> transactions (shared)
  current: string;
  seeMore: string;
  accountname: string;
  interestRate: string;
  balance: string;
  quickAction: string;
  openNewAccount: string;
  closeAccount: string;
  // Charts:
  positive: string;
  negative: string;
  // misc.
  scrollForMore: string;
  // Page: Transactions
  createTransaction: string;
  account: string;
  amount: string;
  ibanTo: string;
  reoccuring: string;
  instantTransaction: string;
  after: string; // used for balance after -> combine {balance} + {after}
  message: string;
  note: string;
  submit: string;
  completedTransactions: string;
  pendingTransactions: string;
  reoccuringTransactions: string;
  description: string;
  pendingTransactionsHint: string;
  totalPending: string;
  cancel: string;
  create: string;
  // Transaction Details
  transactionDetails: string;
  transactionName: string;
  toIban: string;
  fromIban: string;
  executionType: string;
  executionDate: string;
  status: string;
  locked: string;
  yes: string;
  no: string;
  deletePayment: string;
  apply: string;
  editTransaction: string;
  pendingPayments: string;
  deleteAccountWarning: string;
  inviteMember: string;
  role: string;
  currency: string;
  owner: string;
  manager: string;
  viewer: string;
  // Wealth Detailed
  myRole: string;
  // Mobile Verify
  actionExecutedAccordingToMobile: string;
  wealthConvertedToCHF: string;
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
      transactions: 'Überweisungen',
      analytics: 'Analyse',
      logout: 'Abmelden',
      createAccountContent: 'Kontaktieren Sie die nächste PurBank Filiale um ein Konto zu eröffnen.',
      exchangeRates: 'Wechselkurse',
      viewInEnglish: 'View this page in English', 
      viewInGerman: 'Diese Seite auf Deutsch anzeigen', 
      loginTitle: 'Login',
      contractNumber: 'Vertragsnummer',
      password: 'Passwort',
      loginButton: 'Anmelden',
      newRegistration: 'Neu? Erstanmeldung',
      createAccount: 'Konto erstellen', // ORIGINAL USECASE: landing page: options | now merged with createAccountTitle as this has the same content and will likely stay that way 
      neuanmeldungTitle: 'Neuanmeldung',
      mobileVerification: 'Mobile Verifizierung',
      scanQrCode: 'Scannen Sie diesen QR-Code mit Ihrer Purbank Mobile-App, um die Anmeldung zu genehmigen',
      waitingForApproval: 'Warten auf Genehmigung...',
      loginApproved: 'Anmeldung genehmigt',
      redirectingToDashboard: 'Weiterleitung zum Dashboard...',
      verificationTimeout: 'Verifizierungs-Timeout',
      verificationTimeoutMessage: 'Die Verifizierungsanfrage ist abgelaufen. Bitte versuchen Sie es erneut.',
      tryAgain: 'Erneut versuchen',
      email: 'E-Mail',
      enterYourPassword: 'Geben Sie Ihr Passwort ein',
      hidePassword: 'Passwort ausblenden',
      showPassword: 'Passwort anzeigen',
      initiatingLogin: 'Anmeldung wird eingeleitet...',
      loggingIn: 'Anmeldung läuft...',
      adminLogin: 'Admin-Anmeldung',
      userLogin: 'Benutzer-Anmeldung',
      supportTitle: 'Support',
      supportContent: 'Benötigen Sie Hilfe? Kontaktieren Sie unser Support-Team für alle Fragen rund um Ihr PurBank Konto. Wir sind gerne für Sie da.',
      phoneLabel: 'Telefon:',
      emailLabel: 'Email:',
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
      createTransaction: "Überweisung erfassen",
      account: "Konto",
      amount: "Betrag",
      ibanTo: "IBAN des Empfängers",
      reoccuring: "Forlaufend",
      instantTransaction: "Sofort",
      after: "danach", // NOT CAPITALISED ON PURPOSE
      message: "Nachricht",
      note: "Notiz",
      submit: "Absenden",
      completedTransactions: "Ausgeführte Überweisungen",
      pendingTransactions: "Überweisungen in Verarbeitung",
      reoccuringTransactions: "Fortlaufende Überweisungen",
      description: "Beschreibung",
      pendingTransactionsHint: "Alle Transaktionen werden um 01:00 Uhr Züricher Zeit ausgeführt.",
      totalPending: "Total ausstehend",
      cancel: "Abbrechen",
      create: "Erstellen",
      transactionDetails: "Transaktionsdetails",
      transactionName: "Transaktionsname",
      toIban: "Empfänger IBAN",
      fromIban: "Absender IBAN",
      executionType: "Ausführungsart",
      executionDate: "Ausführungsdatum",
      status: "Status",
      locked: "Gesperrt",
      yes: "Ja",
      no: "Nein",
      deletePayment: "Zahlung löschen",
      apply: "Bestätigen",
      editTransaction: "Überweisung bearbeiten",
      pendingPayments: "Überweisungen in Verarbeitung",
      deleteAccountWarning: "Nur Konten mit einem Kontostand von 0 können gelöscht werden.",
      inviteMember: "Mitglied einladen",
      role: "Rolle",
      currency: "Währung",
      owner: "Inhaber",
      manager: "Verwalter",
      viewer: "Betrachter",
      myRole: "Meine Rolle",
      actionExecutedAccordingToMobile: "Aktion ausgeführt gemäss Mobile App",
      wealthConvertedToCHF: "Alle Konten werden in CHF umgerechnet und angezeigt"
    },
    en: {
      dashboard: 'Dashboard',
      wealth: 'Wealth',
      transactions: 'Transactions',
      analytics: 'Analytics',
      logout: 'Logout',
      createAccountContent: 'Please contact your nearest PurBank branch to open an account.',      
      exchangeRates: 'Exchange Rates',      // yes these two are redundant but their values wont change in the future and this just makes it easier to work with
      viewInEnglish: 'View this page in English',
      viewInGerman: 'Diese Seite auf Deutsch anzeigen',
      loginTitle: 'Login',
      contractNumber: 'Account Number',
      password: 'Password',
      loginButton: 'Sign In',
      newRegistration: 'New? Initial Registration',
      createAccount: 'Create Account', // ORIGINAL USECASE: landing page: options | now merged with createAccountTitle as this has the same content and will likely stay that way 
      neuanmeldungTitle: 'Initial Registration',
      mobileVerification: 'Mobile Verification',
      scanQrCode: 'Scan this QR code with your Purbank mobile app to approve the login',
      waitingForApproval: 'Waiting for approval...',
      loginApproved: 'Login Approved',
      redirectingToDashboard: 'Redirecting to dashboard...',
      verificationTimeout: 'Verification Timeout',
      verificationTimeoutMessage: 'The verification request has timed out. Please try again.',
      tryAgain: 'Try Again',
      email: 'Email',
      enterYourPassword: 'Enter your password',
      hidePassword: 'Hide password',
      showPassword: 'Show password',
      initiatingLogin: 'Initiating login...',
      loggingIn: 'Logging in...',
      adminLogin: 'Admin Login',
      userLogin: 'User Login',
      supportTitle: 'Support',
      supportContent: 'Need help? Contact our support team for all questions regarding your PurBank account. We are here to assist you.',
      phoneLabel: 'Phone:',
      emailLabel: 'Email:',
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
      createTransaction: "Create transaction",
      account: "Account",
      amount: "Amount",
      ibanTo: "IBAN of receiver",
      reoccuring: "Reoccuring",
      instantTransaction: "Instant",
      after: "after", // NOT CAPITALISED ON PURPOSE
      message: "Message",
      note: "Note",
      submit: "Send",
      completedTransactions: "Completed Transactions",
      pendingTransactions: "Pending Transactions",
      reoccuringTransactions: "Reoccuring Transactions",
      description: "Description",
      pendingTransactionsHint: "All transactions will go through at 01:00 AM Zurich time.",
      totalPending: "Total pending",
      cancel: "Cancel",
      create: "Create",
      transactionDetails: "Transaction Details",
      transactionName: "Transaction Name",
      toIban: "Recipient IBAN",
      fromIban: "Sender IBAN",
      executionType: "Execution Type",
      executionDate: "Execution Date",
      status: "Status",
      locked: "Locked",
      yes: "Yes",
      no: "No",
      deletePayment: "Delete Payment",
      apply: "Apply",
      editTransaction: "Edit Transaction",
      pendingPayments: "Pending Payments",
      deleteAccountWarning: "Only accounts with a balance of 0 can be deleted.",
      inviteMember: "Invite Member",
      role: "Role",
      currency: "Currency",
      owner: "Owner",
      manager: "Manager",
      viewer: "Viewer",
      myRole: "My Role",
      actionExecutedAccordingToMobile: "Action executed according to mobile app",
      wealthConvertedToCHF: "All accounts are converted to CHF for the total"
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