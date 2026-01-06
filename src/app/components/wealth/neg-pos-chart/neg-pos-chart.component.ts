import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-neg-pos-chart',
  standalone: true,
  templateUrl: './neg-pos-chart.component.html',
  styleUrls: ['./neg-pos-chart.component.css'],
})
export class WealthNegPosChartComponent implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  public konten: { name: string; amount: number }[] = [];
  private chart?: Chart;

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
        // Convert all account balances to CHF for the chart
        const conversionObservables = data.map(konto => {
          if (konto.currency === 'CHF') {
            return of({ name: konto.kontoName, amount: konto.balance });
          } else {
            return this.currencyService.convertAmount(konto.balance, konto.currency, 'CHF').pipe(
              map(convertedAmount => ({
                name: konto.kontoName,
                amount: Math.round(convertedAmount * 100) / 100
              }))
            );
          }
        });

        if (conversionObservables.length === 0) {
          this.konten = [];
          return;
        }

        forkJoin(conversionObservables).subscribe({
          next: (convertedKonten) => {
            this.konten = convertedKonten;
            if (this.pieCanvas) {
              this.createChart();
            }
          },
          error: (error) => {
            console.error('Failed to convert currencies:', error);
            // Fallback: show only CHF accounts
            this.konten = data
              .filter(konto => konto.currency === 'CHF')
              .map(konto => ({
                name: konto.kontoName,
                amount: konto.balance
              }));
            if (this.pieCanvas) {
              this.createChart();
            }
          }
        });
      },
      error: (error) => {
        // Handle error silently
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.konten.length > 0) {
      this.createChart();
    }
  }

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    // Calculate total positive and negative amounts
    const positiveTotal = this.konten
      .filter(k => k.amount > 0)
      .reduce((sum, k) => sum + k.amount, 0);
    
    const negativeTotal = Math.abs(this.konten
      .filter(k => k.amount < 0)
      .reduce((sum, k) => sum + k.amount, 0));

    const translations = this.languageService.getTranslations();

    this.chart = new Chart(this.pieCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D, {
      type: 'bar',
      data: {
        labels: [translations.positive, translations.negative],
        // TODO: Update translation upon language switch -> rerender canvas
        // only way to update language is to rerender the entire canvas. not sure if this is too annoying UX wise
        // or if people even notice. Not needed but nice if we find the time to fix
        datasets: [{
          label: translations.balance,
          data: [positiveTotal, -negativeTotal],
          backgroundColor: ['#438a8eff', '#ff6b6bff'],
          borderWidth: 0,
          barThickness: 60,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 25,
            bottom: 5
          }
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
          legend: { 
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = Math.abs(context.parsed.y || 0);
                return `${context.label}: ${value.toFixed(2)}`;
              }
            }
          }
        },
      },
      plugins: [
        {
          id: 'barLabels',
          afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = chart.getDatasetMeta(datasetIndex);
              meta.data.forEach((element: any, index) => {
                const value = Math.abs(dataset.data[index] as number);
                const x = element.x;
                const y = element.y - 8;
                
                ctx.fillStyle = '#000';
                ctx.font = 'bold 14px Arial';
                // TODO: figure out if we can use custom fonts here
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                // Draw the amount on top of the bar
                ctx.fillText(value.toFixed(2), x, y);
              });
            });
          }
        }
      ]
    });
  }
}