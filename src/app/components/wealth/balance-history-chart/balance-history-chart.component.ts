import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto, Transaction } from '../../../shared/services/konten.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { forkJoin, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface DayBalance {
  date: string;
  totalCHF: number;
}

@Component({
  selector: 'app-balance-history-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance-history-chart.component.html',
  styleUrls: ['./balance-history-chart.component.css'],
})
export class WealthBalanceHistoryChartComponent implements OnInit, AfterViewInit {
  @ViewChild('historyCanvas', { static: true }) historyCanvas!: ElementRef<HTMLCanvasElement>;

  public readonly languageService = inject(LanguageService);
  private readonly kontenService = inject(KontenService);
  private readonly currencyService = inject(CurrencyService);

  private chart?: Chart;
  public isLoading = true;
  public historyData: DayBalance[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.kontenService.getKonten().pipe(
      switchMap((konten: Konto[]) => {
        if (konten.length === 0) return of([]);
        
        // Fetch transactions for all accounts
        const requests = konten.map(k => 
          this.kontenService.getTransactions(k.kontoId).pipe(
            map(transactions => ({ konto: k, transactions }))
          )
        );
        return forkJoin(requests);
      }),
      switchMap((results) => {
        if (results.length === 0) return of([]);

        // 1. Generate date range for exactly the last 7 days
        const dates: string[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          dates.push(d.toISOString().split('T')[0]);
        }

        // 2. For each date, calculate the total balance in CHF
        const dailyObservables = dates.map(date => {
          const accountBalancesAtDate: { amount: number, currency: string }[] = [];

          results.forEach(res => {
            const relevantTx = res.transactions
              .filter(t => t.timestamp.split('T')[0] <= date)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            if (relevantTx) {
              accountBalancesAtDate.push({ amount: relevantTx.balanceAfter, currency: res.konto.currency });
            } else {
              accountBalancesAtDate.push({ amount: 0, currency: res.konto.currency });
            }
          });

          return this.currencyService.convertAndSum(accountBalancesAtDate, 'CHF').pipe(
            map(total => ({ date, totalCHF: total }))
          );
        });

        return forkJoin(dailyObservables).pipe(
          map(data => {
            // 3. Trim leading days where total balance was 0
            const firstNonZeroIndex = data.findIndex(d => d.totalCHF > 0);
            return firstNonZeroIndex === -1 ? [] : data.slice(firstNonZeroIndex);
          })
        );
      })
    ).subscribe({
      next: (data) => {
        this.historyData = data;
        this.isLoading = false;
        if (this.historyCanvas) {
          this.createChart();
        }
      },
      error: (err) => {
        console.error('Failed to load balance history', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.historyData.length > 0) {
      this.createChart();
    }
  }

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const labels = this.historyData.map((d, index) => {
        if (index === this.historyData.length - 1) return this.languageService.translate('current');
        
        const dDate = new Date(d.date);
        dDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today.getTime() - dDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Show label for the very first point (e.g. 7d, 4d)
        if (index === 0) return `${diffDays}d`;
        
        return ''; 
    });

    const data = this.historyData.map(d => d.totalCHF);

    const ctx = this.historyCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: this.languageService.translate('balance') + ' (CHF)',
          data,
          borderColor: '#5A7684',
          backgroundColor: 'rgba(90, 118, 132, 0.05)',
          fill: true,
          tension: 0.3,
          pointRadius: (ctx) => (labels[ctx.dataIndex] !== '' ? 3 : 0),
          borderWidth: 1.5,
          pointBackgroundColor: '#5A7684'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                const index = items[0].dataIndex;
                return new Date(this.historyData[index].date).toLocaleDateString();
              },
              label: (context) => {
                const value = context.parsed.y ?? 0;
                return `${value.toFixed(2)} CHF`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grace: '10%',
            display: true,
            position: 'right',
            grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.03)',
                drawTicks: false
            },
            border: { display: false },
            ticks: {
                font: { size: 9 },
                color: 'rgba(0, 0, 0, 0.3)',
                maxTicksLimit: 3, 
                callback: (value) => {
                    if (Number(value) >= 1000) return (Number(value) / 1000).toFixed(0) + 'k';
                    return value;
                }
            }
          },
          x: {
            display: true,
            grid: { display: false },
            border: { display: false },
            ticks: {
                font: { size: 9, weight: 'bold' },
                color: 'rgba(0, 0, 0, 0.4)',
                maxRotation: 0,
                autoSkip: false 
            }
          }
        }
      }
    });
  }
}
