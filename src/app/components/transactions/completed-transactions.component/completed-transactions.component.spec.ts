import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CompletedTransactionsComponent } from './completed-transactions.component';
import { LanguageService } from '../../../shared/services/language.service';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('CompletedTransactionsComponent', () => {
  let component: CompletedTransactionsComponent;
  let fixture: ComponentFixture<CompletedTransactionsComponent>;
  let mockLanguageService: any;

  beforeEach(async () => {
    mockLanguageService = {
      translate: jasmine.createSpy('translate').and.callFake((key: string) => key),
      getCurrentLanguage: () => signal('en'),
    };

    await TestBed.configureTestingModule({
      imports: [CompletedTransactionsComponent, HttpClientTestingModule],
      providers: [
        { provide: LanguageService, useValue: mockLanguageService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedTransactionsComponent);
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
   * Test: Initial Popup State
   * Prerequisite: The component is initialized.
   * Expected Result: The 'isExpanded' property is false and the modal overlay is not present in the DOM.
   */
  it('should have initial state with closed popup', () => {
    expect(component.isExpanded).toBeFalse();
    const modal = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modal).toBeNull();
  });

  /**
   * Test: Open Popup Interaction
   * Prerequisite: The component is initialized and the popup is closed.
   * Expected Result: Clicking the expand button sets 'isExpanded' to true and the modal overlay appears in the DOM.
   */
  it('should open popup when expand button is clicked', () => {
    const expandBtn = fixture.debugElement.query(By.css('.icon-btn'));
    expandBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isExpanded).toBeTrue();
    const modal = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modal).toBeTruthy();
  });

  /**
   * Test: Close Popup via Overlay
   * Prerequisite: The popup is currently open.
   * Expected Result: Clicking the modal overlay (background) sets 'isExpanded' to false and removes the modal from the DOM.
   */
  it('should close popup when clicking on overlay', () => {
    component.isExpanded = true;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    overlay.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isExpanded).toBeFalse();
    const modal = fixture.debugElement.query(By.css('.modal-overlay'));
    expect(modal).toBeNull();
  });



  /**
   * Test: Rendering Performance
   * Prerequisite: The component is initialized.
   * Expected Result: A change detection cycle completes in less than 200ms.
   */
  it('should load and render efficiently (under 200ms)', () => {
    const start = performance.now();
    fixture.detectChanges();
    const end = performance.now();
    const duration = end - start;
    expect(duration).toBeLessThan(200); 
  });
});