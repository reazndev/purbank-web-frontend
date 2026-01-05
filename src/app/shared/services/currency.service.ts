import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CurrencyRates {
  rates: Record<string, number>;
}

export interface ConversionResult {
  convertedAmount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = environment.apiUrl;
  private cachedRates: CurrencyRates | null = null;
  private cacheTimestamp: number = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  /**
   * Get all currency conversion rates
   */
  getRates(): Observable<CurrencyRates> {
    // Return cached rates if still valid
    if (this.cachedRates && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return of(this.cachedRates);
    }

    return this.http.get<CurrencyRates>(`${this.apiUrl}/currencies/rates`).pipe(
      map(rates => {
        this.cachedRates = rates;
        this.cacheTimestamp = Date.now();
        return rates;
      }),
      catchError(error => {
        console.error('Failed to fetch currency rates:', error);
        // Return fallback rates if API fails
        return of({
          rates: {
            'CHF': 1,
            'EUR': 1.05,
            'USD': 0.95
          }
        });
      })
    );
  }

  /**
   * Convert an amount from one currency to another
   */
  convertAmount(amount: number, from: string, to: string): Observable<number> {
    if (from === to) {
      return of(amount);
    }

    return this.http.get<{ amount: number; from: string; to: string }>(
      `${this.apiUrl}/currencies/convert`, 
      {
        params: {
          amount: amount.toString(),
          from: from,
          to: to
        }
      }
    ).pipe(
      map(response => response.amount),
      catchError(error => {
        console.error('Currency conversion failed:', error);
        return of(amount);
      })
    );
  }

  /**
   * Convert multiple amounts to a target currency and sum them
   */
  convertAndSum(amounts: { amount: number, currency: string }[], targetCurrency: string = 'CHF'): Observable<number> {
    if (amounts.length === 0) {
      return of(0);
    }

    return this.getRates().pipe(
      map(ratesData => {
        const rates = ratesData.rates;
        let total = 0;

        for (const item of amounts) {
          if (item.currency === targetCurrency) {
            total += item.amount;
          } else if (rates[item.currency] && rates[targetCurrency]) {
            // Convert to target currency
            const rate = rates[targetCurrency] / rates[item.currency];
            total += item.amount * rate;
          } else {
            // If conversion not available, add as-is (fallback)
            console.warn(`No conversion rate available for ${item.currency} to ${targetCurrency}`);
            total += item.amount;
          }
        }

        return total;
      })
    );
  }

  /**
   * Format amount with currency symbol
   */
  formatAmount(amount: number, currency: string): string {
    return `${amount.toFixed(2)} ${currency}`;
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return ['CHF', 'EUR', 'USD'];
  }
}
