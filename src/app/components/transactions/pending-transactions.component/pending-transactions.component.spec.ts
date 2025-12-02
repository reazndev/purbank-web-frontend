import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingTransactionsComponent } from './pending-transactions.component';
import { LanguageService } from '../../../shared/services/language.service';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('PendingTransactionsComponent', () => {
  let component: PendingTransactionsComponent;
  let fixture: ComponentFixture<PendingTransactionsComponent>;
  let mockLanguageService: any;

  beforeEach(async () => {
    mockLanguageService = {
      translate: jasmine.createSpy('translate').and.callFake((key: string) => key),
      getCurrentLanguage: () => signal('en'),
    };

    await TestBed.configureTestingModule({
      imports: [PendingTransactionsComponent],
      providers: [
        { provide: LanguageService, useValue: mockLanguageService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingTransactionsComponent);
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
   * Test: Close Popup via Button
   * Prerequisite: The popup is currently open.
   * Expected Result: Clicking the minimize button inside the modal sets 'isExpanded' to false.
   */
  it('should close popup when clicking minimize button inside modal', () => {
    component.isExpanded = true;
    fixture.detectChanges();

    // Find the button inside the modal-content. 
    // Note: The minimize button is the .icon-btn inside .modal-content
    const minimizeBtn = fixture.debugElement.query(By.css('.modal-content .icon-btn'));
    minimizeBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isExpanded).toBeFalse();
  });

  /**
   * Test: Transaction List Rendering
   * Prerequisite: The component has a list of transactions (mock data).
   * Expected Result: The number of rendered transaction boxes in the scrollable grid matches the mock data length (10).
   */
  it('should render the list of transactions', () => {
    const transactionItems = fixture.debugElement.queryAll(By.css('.scrollable-grid .transaction-box'));
    expect(transactionItems.length).toBe(10);
  });

  /**
   * Test: Expanded Transaction List Rendering
   * Prerequisite: The popup is expanded.
   * Expected Result: The number of rendered transaction boxes in the full-height grid matches the mock data length (10).
   */
  it('should render the list of transactions in the modal when expanded', () => {
    component.isExpanded = true;
    fixture.detectChanges();
    
    const transactionItems = fixture.debugElement.queryAll(By.css('.full-height-grid .transaction-box'));
    expect(transactionItems.length).toBe(10);
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
    
    // This is a 'pi mal daumen' check, but ensures no massive performance regression in simple rendering
    expect(duration).toBeLessThan(200); 
  });
});