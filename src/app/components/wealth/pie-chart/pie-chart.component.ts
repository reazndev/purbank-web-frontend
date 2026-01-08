import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class WealthPieChartComponent implements OnInit, AfterViewInit {
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
        const conversionObservables = data
          .filter(konto => konto.balance !== 0)
          .map(konto => {
            if (konto.currency === 'CHF') {
              return of({ name: konto.kontoName, amount: konto.balance });
            } else {
              return this.currencyService.convertAmount(konto.balance, konto.currency, 'CHF').pipe(
                map(convertedAmount => ({
                  name: `${konto.kontoName} (${konto.currency})`,
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
              .filter(konto => konto.currency === 'CHF' && konto.balance !== 0)
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

    const labels = this.konten.map((k) => k.name);
    const data = this.konten.map((k) => k.amount);

    this.chart = new Chart(this.pieCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data, backgroundColor: ['#A2C5D6', '#5A7684', '#81B1AA', '#616D9E', '#bca89dff', '#3E4E56'] }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false // Hide the legend to save space
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}`;
              }
            }
          }
        },
      },
      plugins: [
        {
          id: 'customLabels',
          afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, datasetIndex) => {
              const meta = chart.getDatasetMeta(datasetIndex);
              const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);

              meta.data.forEach((element: any, index) => {
                const data = dataset.data[index] as number;
                if ((data / total) * 100 < 10) return;

                const label = chart.data.labels?.[index] as string;
                
                // Get the center of the chart and the midpoint angle
                const centerX = element.x;
                const centerY = element.y;
                const startAngle = element.startAngle;
                const endAngle = element.endAngle;
                const midAngle = (startAngle + endAngle) / 2;
                
                // Move text further away from the center to increase readability with low % sections
                const radius = element.outerRadius * 0.7;
                const x = centerX + Math.cos(midAngle) * radius;
                const y = centerY + Math.sin(midAngle) * radius;
                
                ctx.fillStyle = '#ffffffff';
                ctx.font = 'bold 14px Arial'; 
                // TODO: figure out if we can use custom fonts here 
                // not that important tho
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw the label name & amount
                ctx.fillText(label, x, y - 8);
                ctx.fillText(`${data.toFixed(2)}`, x, y + 8);
              });
            });
          }
        }
      ]
    });
  }
}