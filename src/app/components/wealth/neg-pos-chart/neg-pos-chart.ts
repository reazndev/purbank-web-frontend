import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-neg-pos-chart',
  standalone: true,
  templateUrl: './neg-pos-chart.html',
  styleUrls: ['./neg-pos-chart.css'],
})
export class ComponentWealthNegPosChart implements AfterViewInit {
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  // This is all temporary mock data
  // Needs to be replaced with actual backend once that is finished
  // TODO: Replace with backend data

  public konten = [
    { name: 'Konto 1', amount: 420 },
    { name: 'Konto 2', amount: -260 },
    { name: 'Konto 3', amount: -320 },
    { name: 'Konto 4', amount: -620 },
    { name: 'Konto 5', amount: 160 },
    { name: 'Konto 6', amount: 820 },
  ];

  private chart?: Chart;

  constructor(public languageService: LanguageService) {}

  ngAfterViewInit(): void {
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
                return `${context.label}: ${value}`;
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
                ctx.fillText(value.toString(), x, y);
              });
            });
          }
        }
      ]
    });
  }
}