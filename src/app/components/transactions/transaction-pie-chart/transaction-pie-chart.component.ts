import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Transaction, Konto } from '../../../shared/services/konten.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-transaction-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-pie-chart.component.html',
  styleUrls: ['./transaction-pie-chart.component.css'],
})
export class TransactionPieChartComponent implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  public readonly languageService = inject(LanguageService);
  private readonly kontenService = inject(KontenService);
  private readonly currencyService = inject(CurrencyService);

  public dataPoints: { name: string; amount: number }[] = [];
  private chart?: Chart;
  public isLoading = true;

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.kontenService.getKonten().pipe(
      switchMap((konten: Konto[]) => {
        if (konten.length === 0) return of([]);
        const transactionRequests = konten.map(k => this.kontenService.getTransactions(k.kontoId));
        return forkJoin(transactionRequests);
      }),
      map((allResults: Transaction[][]) => {
        // Flatten, sort by timestamp desc, take last 15
        return allResults.flat()
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 15);
      }),
      switchMap((last15: Transaction[]) => {
        if (last15.length === 0) return of([]);

        const incoming = last15.filter(t => t.transactionType === 'INCOMING');
        const outgoing = last15.filter(t => t.transactionType === 'OUTGOING');

        const incomingCHF$ = this.currencyService.convertAndSum(
          incoming.map(t => ({ amount: Math.abs(t.amount), currency: t.currency })), 
          'CHF'
        );
        const outgoingCHF$ = this.currencyService.convertAndSum(
          outgoing.map(t => ({ amount: Math.abs(t.amount), currency: t.currency })), 
          'CHF'
        );

        return forkJoin([incomingCHF$, outgoingCHF$]).pipe(
          map(([inSum, outSum]) => [
            { name: this.languageService.translate('incoming'), amount: inSum },
            { name: this.languageService.translate('outgoing'), amount: outSum }
          ])
        );
      })
    ).subscribe({
      next: (points) => {
        this.dataPoints = points;
        this.isLoading = false;
        if (this.pieCanvas) {
          this.createChart();
        }
      },
      error: (err) => {
        console.error('Failed to load transaction data for chart', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.dataPoints.length > 0) {
      this.createChart();
    }
  }

  private createChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.dataPoints.map((p) => p.name);
    const data = this.dataPoints.map((p) => p.amount);

    this.chart = new Chart(this.pieCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ 
          data, 
          backgroundColor: ['#81B1AA', '#5A7684'] // Incoming (teal), Outgoing (dark)
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value.toFixed(2)} CHF`;
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
                if (total === 0 || (data / total) * 100 < 5) return;

                const label = chart.data.labels?.[index] as string;
                
                const centerX = element.x;
                const centerY = element.y;
                const startAngle = element.startAngle;
                const endAngle = element.endAngle;
                const midAngle = (startAngle + endAngle) / 2;
                
                const radius = element.outerRadius * 0.6;
                const x = centerX + Math.cos(midAngle) * radius;
                const y = centerY + Math.sin(midAngle) * radius;
                
                ctx.fillStyle = '#ffffffff';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
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
