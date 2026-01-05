import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class DashboardChartComponent implements OnInit {
  exchangeRates: { from: string; to: string; rate: number }[] = [];
  isLoading = true;

  constructor(
    public languageService: LanguageService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.loadExchangeRates();
  }

  loadExchangeRates(): void {
    // Use the convert endpoint to get actual exchange rates for 1 unit of each currency
    forkJoin({
      chfToUsd: this.currencyService.convertAmount(1, 'CHF', 'USD'),
      chfToEur: this.currencyService.convertAmount(1, 'CHF', 'EUR'),
      eurToUsd: this.currencyService.convertAmount(1, 'EUR', 'USD')
    }).subscribe({
      next: ({ chfToUsd, chfToEur, eurToUsd }) => {
        this.exchangeRates = [
          { from: 'CHF', to: 'USD', rate: chfToUsd },
          { from: 'CHF', to: 'EUR', rate: chfToEur },
          { from: 'EUR', to: 'USD', rate: eurToUsd }
        ];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load exchange rates:', error);
        this.isLoading = false;
      }
    });
  }
}
