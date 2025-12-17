import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { PaymentsService, Payment } from '../../../shared/services/payments.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';
import { forkJoin } from 'rxjs';

interface PaymentDisplay {
  name: string;
  account: string;
  amount: number;
  toIban: string;
  message: string;
  note: string;
}

@Component({
  selector: 'app-pending-transactions',
  imports: [CommonModule],
  templateUrl: './pending-transactions.component.html',
  styleUrl: './pending-transactions.component.css',
})
export class PendingTransactionsComponent implements OnInit {
  transactions: PaymentDisplay[] = [];
  isLoading = true;
  konten: Konto[] = [];
  // TODO: show transactions from accounts wiht multiple members with icon (public/icons/users.svg)

  constructor(
    public languageService: LanguageService,
    private paymentsService: PaymentsService,
    private kontenService: KontenService
  ) {}

  isExpanded: boolean = false;

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments(): void {
    forkJoin({
      konten: this.kontenService.getKonten(),
      payments: this.paymentsService.getAllPayments()
    }).subscribe({
      next: ({ konten, payments }) => {
        this.konten = konten;
        
        // most recent first
        const sortedPayments = payments.sort((a, b) => {
          const dateA = a.executionDate || a.execution_date || '';
          const dateB = b.executionDate || b.execution_date || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        
        this.transactions = sortedPayments.map(p => {
          const kontoId = p.kontoId || p.konto || '';
          const konto = this.konten.find(k => k.kontoId === kontoId);
          return {
            name: konto?.kontoName || 'Unknown Account',
            account: kontoId,
            amount: p.amount,
            toIban: p.toIban,
            message: p.message,
            note: p.note
          };
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.isLoading = false;
      }
    });
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: Event) {
    if (this.isExpanded) {
      this.toggleExpand();
    }
  }

  get totalAmount(): number {
    return this.transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  protected MathAbs(val: number): number {
    return Math.abs(val);
  }
}
