import { Injectable, signal } from '@angular/core';

export type Language = 'de' | 'en';

export interface Translations {
  // General Page names
  dashboard: string;
  wealth: string;
  transactions: string;
  payments: string;
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
  viewDetails: string;
  // Page: Transactions
  createTransaction: string;
  selectAccount: string;
  account: string;
  accountFrom: string;
  accountTo: string;
  amount: string;
  instantTransaction: string;
  after: string; // used for balance after -> combine {balance} + {after}
  message: string;
  note: string;
  submit: string;
  completedTransactions: string;
  completedPayments: string;
  pendingTransactions: string;
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
  editNote: string;
  transactionType: string;
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
  iban: string;
  allAccounts: string;
  allTransactions: string;
  incoming: string;
  outgoing: string;
  internalTransfer: string;
  loading: string;
  last15Transactions: string;
  noTransactionData: string;
  sessionExpired: string;
  sessionTimeoutReason: string;
  sessionLoginAgain: string;
  returnToLogin: string;
  inactiveIn: string;
  wealthHistory: string;
  wealthHistorySubtitle: string;
  last7Days: string;
  last14Days: string;
  // Session Timeout Modal
  sessionTimeoutTitle: string;
  sessionTimeoutBody: string;
  sessionTimeoutLabel: string;
  sessionTimeoutInstruction: string;
  sessionTimeoutLogout: string;
  sessionTimeoutStay: string;
  // Showcase Page
  showcaseBrand: string;
  backToLogin: string;
  productVideos: string;
  interfacePreviews: string;
  exploreShowcase: string;
  systemDiagrams: string;
  // Admin Interface
  userManagement: string;
  allUsers: string;
  name: string;
  contract: string;
  usersTotal: string;
  noUsersFound: string;
  loadingUsers: string;
  kontoManagement: string;
  forceDailyCalc: string;
  runAbrechnung: string;
  createKonto: string;
  createKontoTitle: string;
  selectUserToViewAccounts: string;
  noAccountsFound: string;
  adminSettings: string;
  changePassword: string;
  changePasswordTitle: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  changing: string;
  createUser: string;
  createUserBtn: string;
  firstName: string;
  lastName: string;
  contractNumberAuto: string;
  contractNumberAutoHint: string;
  creating: string;
  userDetails: string;
  userId: string;
  createdAt: string;
  selectUserToViewDetails: string;
  userDetailsNotAvailable: string;
  loadingUserDetails: string;
  registrationCodes: string;
  codeCopied: string;
  newCode: string;
  title: string;
  optionalDescription: string;
  createCode: string;
  copy: string;
  used: string;
  codesTotal: string;
  noRegistrationCodesFound: string;
  createCodeToStart: string;
  selectUserToManageCodes: string;
  loadingRegistrationCodes: string;
  auditLogs: string;
  timestamp: string;
  action: string;
  entity: string;
  user: string;
  details: string;
  loadingLogs: string;
  logDetails: string;
  ipAddress: string;
  noAdditionalDetails: string;
  page: string;
  of: string;
  total: string;
  actions: string;
  balanceAdjustment: string;
  enterAmountAdjustment: string;
  update: string;
  editAccount: string;
  accruedInterest: string;
  lastCalcDate: string;
  members: string;
  noMembers: string;
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
      payments: 'Zahlungen',
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
      viewDetails: 'Details anzeigen',
      createTransaction: "Überweisung erfassen",
      selectAccount: "Konto auswählen",
      account: "Konto",
      accountFrom: "Konto von",
      accountTo: "Konto zu",
      amount: "Betrag",
      instantTransaction: "Sofort",
      after: "danach", // NOT CAPITALISED ON PURPOSE
      message: "Nachricht",
      note: "Notiz",
      submit: "Absenden",
      completedTransactions: "Ausgeführte Überweisungen",
      completedPayments: "Ausgeführte Zahlungen",
      pendingTransactions: "Überweisungen in Verarbeitung",
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
      editNote: "Notiz bearbeiten",
      transactionType: "Transaktionstyp",
      pendingPayments: "Überweisungen in Verarbeitung",
      deleteAccountWarning: "Nur Konten mit einem Kontostand von 0 und bei denen Sie der Inhaber sind, können gelöscht werden.",
      inviteMember: "Mitglied einladen",
      role: "Rolle",
      currency: "Währung",
      owner: "Inhaber",
      manager: "Verwalter",
      viewer: "Betrachter",
      myRole: "Meine Rolle",
      actionExecutedAccordingToMobile: "Aktion ausgeführt gemäss Mobile App",
      wealthConvertedToCHF: "Alle Konten werden in CHF umgerechnet und angezeigt",
      iban: "IBAN",
      allAccounts: "Alle Konten",
      allTransactions: "Alle Transaktionen",
      incoming: "Eingehend",
      outgoing: "Ausgehend",
      internalTransfer: "Interner Übertrag",
      loading: "Laden...",
      last15Transactions: "Letzte 15 Transaktionen (CHF)",
      noTransactionData: "Keine Transaktionsdaten verfügbar",
      sessionExpired: "Sitzung abgelaufen",
      sessionTimeoutReason: "Ihre Sitzung ist aus Sicherheitsgründen wegen Inaktivität abgelaufen.",
      sessionLoginAgain: "Bitte melden Sie sich erneut an, um Ihre Bankgeschäfte weiter zu verwalten.",
      returnToLogin: "ZURÜCK ZUM LOGIN",
      inactiveIn: "Inaktiv in",
      wealthHistory: "Vermögensverlauf",
      wealthHistorySubtitle: "Gesamtguthaben letzte 7 Tage (CHF)",
      last7Days: "7 Tage",
      last14Days: "14 Tage",
      sessionTimeoutTitle: "Sitzung läuft ab",
      sessionTimeoutBody: "Ihre Sitzung läuft aufgrund von Inaktivität bald ab.",
      sessionTimeoutLabel: "Automatischer Logout in:",
      sessionTimeoutInstruction: 'Klicken Sie auf "ANGEMELDET BLEIBEN", um Ihre aktuelle Sitzung fortzusetzen.',
      sessionTimeoutLogout: "ABMELDEN",
      sessionTimeoutStay: "ANGEMELDET BLEIBEN",
      showcaseBrand: "PURBANK SHOWCASE",
      backToLogin: "ZURÜCK ZUM LOGIN",
      productVideos: "PRODUKT-VIDEOS",
      interfacePreviews: "INTERFACE-VORSCHAU",
      exploreShowcase: "SHOWCASE ENTDECKEN",
      systemDiagrams: 'SYSTEM-DIAGRAMME',
      // Admin Interface
      userManagement: "BENUTZERVERWALTUNG",
      allUsers: "ALLE BENUTZER",
      name: "NAME",
      contract: "VERTRAG",
      usersTotal: "BENUTZER TOTAL",
      noUsersFound: "KEINE BENUTZER GEFUNDEN",
      loadingUsers: "LADE BENUTZER...",
      kontoManagement: "KONTOVERWALTUNG",
      forceDailyCalc: "TAGESABSCHLUSS ERZWINGEN",
      runAbrechnung: "ABRECHNUNG STARTEN",
      createKonto: "KONTO ERSTELLEN",
      createKontoTitle: "Neues Konto erstellen",
      selectUserToViewAccounts: "WÄHLEN SIE EINEN BENUTZER, UM KONTEN ANZUZEIGEN",
      noAccountsFound: "KEINE KONTEN GEFUNDEN",
      adminSettings: "ADMIN EINSTELLUNGEN",
      changePassword: "PASSWORT ÄNDERN",
      changePasswordTitle: "Passwort ändern",
      currentPassword: "Aktuelles Passwort",
      newPassword: "Neues Passwort",
      confirmNewPassword: "Neues Passwort bestätigen",
      changing: "Ändern...",
      createUser: "Neuen Benutzer erstellen",
      createUserBtn: "+ NEUER BENUTZER",
      firstName: "Vorname",
      lastName: "Nachname",
      contractNumberAuto: "Vertragsnummer (automatisch generiert)",
      contractNumberAutoHint: "Vertragsnummer wird automatisch generiert",
      creating: "Erstelle...",
      userDetails: "BENUTZERDETAILS",
      userId: "BENUTZER ID",
      createdAt: "ERSTELLT AM",
      selectUserToViewDetails: "WÄHLEN SIE EINEN BENUTZER FÜR DETAILS",
      userDetailsNotAvailable: "BENUTZERDETAILS NICHT VERFÜGBAR",
      loadingUserDetails: "LADE BENUTZERDETAILS...",
      registrationCodes: "REGISTRIERUNGSCODES",
      codeCopied: "CODE KOPIERT",
      newCode: "+ NEUER CODE",
      title: "TITEL",
      optionalDescription: "Optionale Beschreibung",
      createCode: "CODE ERSTELLEN",
      copy: "KOPIEREN",
      used: "BENUTZT",
      codesTotal: "CODE(S) TOTAL",
      noRegistrationCodesFound: "KEINE REGISTRIERUNGSCODES GEFUNDEN",
      createCodeToStart: "ERSTELLEN SIE EINEN NEUEN CODE, UM ZU BEGINNEN",
      selectUserToManageCodes: "WÄHLEN SIE EINEN BENUTZER, UM CODES ZU VERWALTEN",
      loadingRegistrationCodes: "LADE REGISTRIERUNGSCODES...",
      auditLogs: "AUDIT LOGS",
      timestamp: "ZEITSTEMPEL",
      action: "AKTION",
      entity: "ENTITÄT",
      user: "BENUTZER",
      details: "DETAILS",
      loadingLogs: "Lade Logs...",
      logDetails: "Log Details",
      ipAddress: "IP Adresse",
      noAdditionalDetails: "Keine weiteren Details verfügbar.",
      page: "Seite",
      of: "von",
      total: "Gesamt",
      actions: "AKTIONEN",
      balanceAdjustment: "Saldoanpassung (+/-)",
      enterAmountAdjustment: "Betrag eingeben, um ihn zum aktuellen Saldo hinzuzufügen oder davon abzuziehen",
      update: "Aktualisieren",
      editAccount: "Konto bearbeiten",
      accruedInterest: "Aufgelaufene Zinsen",
      lastCalcDate: "Letztes Berechnungsdatum",
      members: "Mitglieder",
      noMembers: "Keine Mitglieder"
    },
    en: {
      dashboard: 'Dashboard',
      wealth: 'Wealth',
      transactions: 'Transactions',
      payments: 'Payments',
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
      viewDetails: 'View details',
      createTransaction: "Create Transaction",
      selectAccount: "Select Account",
      account: "Account",
      accountFrom: "Account from",
      accountTo: "Account to",
      amount: "Amount",
      instantTransaction: "Instant",
      after: "after", // NOT CAPITALISED ON PURPOSE
      message: "Message",
      note: "Note",
      submit: "Send",
      completedTransactions: "Completed Transactions",
      completedPayments: "Completed Payments",
      pendingTransactions: "Pending Payments",
      description: "Description",
      pendingTransactionsHint: "All payments will go through at 01:00 AM Zurich time.",
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
      editNote: "Edit Note",
      transactionType: "Transaction Type",
      pendingPayments: "Pending Payments",
      deleteAccountWarning: "Only accounts with a balance of 0 where you are the owner can be deleted.",
      inviteMember: "Invite Member",
      role: "Role",
      currency: "Currency",
      owner: "Owner",
      manager: "Manager",
      viewer: "Viewer",
      myRole: "My Role",
      actionExecutedAccordingToMobile: "Action executed according to mobile app",
      wealthConvertedToCHF: "All accounts are converted to CHF for the total",
      iban: "IBAN",
      allAccounts: "All Accounts",
      allTransactions: "All Transactions",
      incoming: "Incoming",
      outgoing: "Outgoing",
      internalTransfer: "Internal Transfer",
      loading: "Loading...",
      last15Transactions: "Last 15 Transactions (CHF)",
      noTransactionData: "No transaction data available",
      sessionExpired: "Session Expired",
      sessionTimeoutReason: "Your session has timed out due to inactivity for security reasons.",
      sessionLoginAgain: "Please log in again to continue managing your banking transactions.",
      returnToLogin: "RETURN TO LOGIN",
      inactiveIn: "Inactive in",
      wealthHistory: "Wealth History",
      wealthHistorySubtitle: "Total balance last 7 days (CHF)",
      last7Days: "7 Days",
      last14Days: "14 Days",
      sessionTimeoutTitle: "Session Timeout Warning",
      sessionTimeoutBody: "Your session is about to expire due to inactivity.",
      sessionTimeoutLabel: "Automatic logout in:",
      sessionTimeoutInstruction: 'Click "STAY LOGGED IN" to continue your current session.',
      sessionTimeoutLogout: "LOG OUT",
      sessionTimeoutStay: "STAY LOGGED IN",
      showcaseBrand: "PURBANK SHOWCASE",
      backToLogin: "BACK TO LOGIN",
      productVideos: "PRODUCT VIDEOS",
      interfacePreviews: "INTERFACE PREVIEWS",
      exploreShowcase: "EXPLORE SHOWCASE",
      systemDiagrams: 'SYSTEM DIAGRAMS',
      // Admin Interface
      userManagement: "USER MANAGEMENT",
      allUsers: "ALL USERS",
      name: "NAME",
      contract: "CONTRACT",
      usersTotal: "USERS TOTAL",
      noUsersFound: "NO USERS FOUND",
      loadingUsers: "LOADING USERS...",
      kontoManagement: "KONTO MANAGEMENT",
      forceDailyCalc: "FORCE DAILY CALC",
      runAbrechnung: "RUN ABRECHNUNG",
      createKonto: "CREATE KONTO",
      createKontoTitle: "Create New Account",
      selectUserToViewAccounts: "SELECT A USER TO VIEW ACCOUNTS",
      noAccountsFound: "NO ACCOUNTS FOUND",
      adminSettings: "ADMIN SETTINGS",
      changePassword: "CHANGE PASSWORD",
      changePasswordTitle: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      changing: "Changing...",
      createUser: "Create New User",
      createUserBtn: "+ NEW USER",
      firstName: "First Name",
      lastName: "Last Name",
      contractNumberAuto: "Contract Number (auto-generated)",
      contractNumberAutoHint: "Contract number will be automatically generated",
      creating: "Creating...",
      userDetails: "USER DETAILS",
      userId: "USER ID",
      createdAt: "CREATED AT",
      selectUserToViewDetails: "SELECT A USER TO VIEW DETAILS",
      userDetailsNotAvailable: "USER DETAILS NOT AVAILABLE",
      loadingUserDetails: "LOADING USER DETAILS...",
      registrationCodes: "REGISTRATION CODES",
      codeCopied: "CODE COPIED",
      newCode: "+ NEW CODE",
      title: "TITLE",
      optionalDescription: "Optional description",
      createCode: "CREATE CODE",
      copy: "COPY",
      used: "USED",
      codesTotal: "CODE(S) TOTAL",
      noRegistrationCodesFound: "NO REGISTRATION CODES FOUND",
      createCodeToStart: "CREATE A NEW CODE TO GET STARTED",
      selectUserToManageCodes: "SELECT A USER TO MANAGE REGISTRATION CODES",
      loadingRegistrationCodes: "LOADING REGISTRATION CODES...",
      auditLogs: "AUDIT LOGS",
      timestamp: "TIMESTAMP",
      action: "ACTION",
      entity: "ENTITY",
      user: "USER",
      details: "DETAILS",
      loadingLogs: "Loading logs...",
      logDetails: "Log Details",
      ipAddress: "IP Address",
      noAdditionalDetails: "No additional details available.",
      page: "Page",
      of: "of",
      total: "total",
      actions: "ACTIONS",
      balanceAdjustment: "Balance Adjustment (+/-)",
      enterAmountAdjustment: "Enter amount to add/subtract from current balance",
      update: "Update",
      editAccount: "Edit Account",
      accruedInterest: "Accrued Interest",
      lastCalcDate: "Last Calc Date",
      members: "Members",
      noMembers: "No members"
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

  formatDate(date: string | Date): string {
    const locale = this.currentLanguage() === 'de' ? 'de-CH' : 'en-US';
    return new Date(date).toLocaleDateString(locale, { dateStyle: 'full' });
  }
}