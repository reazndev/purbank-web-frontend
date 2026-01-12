import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';
import { CurrencyService } from '../../../shared/services/currency.service';

@Component({
  selector: 'app-wealth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wealth.component.html',
  styleUrls: ['./wealth.component.css'],
})
export class DashboardWealthComponent implements OnInit {
  konten: Konto[] = [];
  totalWealth: number = 0;

  constructor(
    public languageService: LanguageService,
    private kontenService: KontenService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadKonten();
  }

  loadKonten(): void {
    this.kontenService.getKonten().subscribe({
      next: (data) => {
        this.konten = data;
        this.calculateTotalWealth();
      },
      error: (error) => {
        // Handle error silently
      }
    });
  }

  calculateTotalWealth(): void {
    // Convert all account balances to CHF and sum them
    const accountAmounts = this.konten.map(k => ({
      amount: k.balance,
      currency: k.currency
    }));

    this.currencyService.convertAndSum(accountAmounts, 'CHF').subscribe({
      next: (total) => {
        this.totalWealth = Math.round(total * 100) / 100; // Round to 2 decimal places
      },
      error: (error) => {
        console.error('Failed to calculate total wealth:', error);
        // Fallback: just sum CHF accounts
        this.totalWealth = this.konten
          .filter(k => k.currency === 'CHF')
          .reduce((sum, konto) => sum + konto.balance, 0);
      }
    });
  }
}
