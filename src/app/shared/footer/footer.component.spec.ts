import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { provideRouter, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { LanguageService } from '../services/language.service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let router: Router;

  const mockLanguageService = {
    translate: (key: string) => key === 'inactiveIn' ? 'Inactivity in' : key,
  };

  const inactivityTimeRemaining = signal(300);
  const mockSessionService = {
    inactivityTimeRemaining: inactivityTimeRemaining
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'login', component: DummyComponent },
          { path: 'support', component: DummyComponent },
          { path: 'create-account', component: DummyComponent },
          { path: 'dashboard', component: DummyComponent }
        ]),
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show inactivity timer on dashboard', async () => {
    await router.navigate(['/dashboard']);
    fixture.detectChanges();
    const timer = fixture.debugElement.query(By.css('.session-timer'));
    expect(timer).toBeTruthy();
  });

  it('should not show inactivity timer on login page', async () => {
    await router.navigate(['/login']);
    fixture.detectChanges();
    const timer = fixture.debugElement.query(By.css('.session-timer'));
    expect(timer).toBeFalsy();
  });

  it('should not show inactivity timer on root path', async () => {
    await router.navigate(['/']);
    fixture.detectChanges();
    const timer = fixture.debugElement.query(By.css('.session-timer'));
    expect(timer).toBeFalsy();
  });

  it('should not show inactivity timer on support page', async () => {
    await router.navigate(['/support']);
    fixture.detectChanges();
    const timer = fixture.debugElement.query(By.css('.session-timer'));
    expect(timer).toBeFalsy();
  });

  it('should not show inactivity timer on create-account page', async () => {
    await router.navigate(['/create-account']);
    fixture.detectChanges();
    const timer = fixture.debugElement.query(By.css('.session-timer'));
    expect(timer).toBeFalsy();
  });
});
