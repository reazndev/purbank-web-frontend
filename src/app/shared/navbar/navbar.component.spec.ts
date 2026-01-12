import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavbarComponent } from './navbar.component';
import { provideRouter, Router } from '@angular/router';
import { LanguageService } from '../services/language.service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Component } from '@angular/core';

// Dummy components for routing
@Component({ template: '' })
class DummyComponent {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let location: Location;

  const mockLanguageService = {
    getCurrentLanguage: () => signal('en'),
    getTranslations: () => ({
      dashboard: 'Dashboard',
      wealth: 'Wealth',
      transactions: 'Transactions',
      logout: 'Logout'
    }),
    setLanguage: jasmine.createSpy('setLanguage')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, HttpClientTestingModule],
      providers: [
        provideRouter([
          { path: 'dashboard', component: DummyComponent },
          { path: 'wealth', component: DummyComponent },
          { path: 'transactions', component: DummyComponent },
          { path: 'logout', component: DummyComponent }
        ]),
        { provide: LanguageService, useValue: mockLanguageService }
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test: Component Creation
   * Prerequisite: The component and its dependencies are configured in the TestBed.
   * Expected Result: The component instance should be successfully created and not be null/undefined.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test: Dashboard Link Existence
   * Prerequisite: The component template is rendered.
   * Expected Result: An anchor tag with routerLink="/dashboard" should exist and display the translated text "Dashboard".
   */
  it('should have a link to dashboard', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/dashboard"]'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Dashboard');
  });

  /**
   * Test: Dashboard Navigation
   * Prerequisite: The dashboard link exists and the router is configured.
   * Expected Result: Clicking the dashboard link should update the browser location path to '/dashboard'.
   */
  it('should navigate to dashboard when clicked', async () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/dashboard"]'));
    link.nativeElement.click();
    await fixture.whenStable();
    expect(location.path()).toBe('/dashboard');
  });

  /**
   * Test: Wealth Link Existence
   * Prerequisite: The component template is rendered.
   * Expected Result: An anchor tag with routerLink="/wealth" should exist and display the translated text "Wealth".
   */
  it('should have a link to wealth', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/wealth"]'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Wealth');
  });

  /**
   * Test: Wealth Navigation
   * Prerequisite: The wealth link exists and the router is configured.
   * Expected Result: Clicking the wealth link should update the browser location path to '/wealth'.
   */
  it('should navigate to wealth when clicked', async () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/wealth"]'));
    link.nativeElement.click();
    await fixture.whenStable();
    expect(location.path()).toBe('/wealth');
  });

  /**
   * Test: Language Switching
   * Prerequisite: Language options are rendered in the template.
   * Expected Result: 
   * 1. Clicking the first option (DE) should call setLanguage('de').
   * 2. Clicking the last option (EN) should call setLanguage('en').
   */
  it('should call setLanguage when language option is clicked', () => {
    const deOption = fixture.debugElement.query(By.css('.language-option:first-child'));
    deOption.triggerEventHandler('click', null);
    expect(mockLanguageService.setLanguage).toHaveBeenCalledWith('de');

    const enOption = fixture.debugElement.query(By.css('.language-option:last-child'));
    enOption.triggerEventHandler('click', null);
    expect(mockLanguageService.setLanguage).toHaveBeenCalledWith('en');
  });

  /**
   * Test: Active Route Styling
   * Prerequisite: Navigation links exist and router is functional.
   * Expected Result:
   * 1. When navigating to '/dashboard', the dashboard link should have the 'active' CSS class.
   * 2. When navigating to '/wealth', the wealth link should have the 'active' CSS class, and the dashboard link should NOT.
   */
  it('should apply active class to active route', async () => {
    // Navigate to dashboard
    const dashboardLink = fixture.debugElement.query(By.css('a[routerLink="/dashboard"]'));
    dashboardLink.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(dashboardLink.nativeElement.classList).toContain('active');
    
    // Navigate to wealth
    const wealthLink = fixture.debugElement.query(By.css('a[routerLink="/wealth"]'));
    wealthLink.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(wealthLink.nativeElement.classList).toContain('active');
    expect(dashboardLink.nativeElement.classList).not.toContain('active');
  });

  /**
   * Test: Transactions Navigation
   * Prerequisite: The transactions link exists and the router is configured.
   * Expected Result: Clicking the transactions link should update the browser location path to '/transactions'.
   */
  it('should navigate to transactions when clicked', async () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/transactions"]'));
    expect(link).toBeTruthy();
    
    link.nativeElement.click();
    await fixture.whenStable();
    
    expect(location.path()).toBe('/transactions');
  });
});
