import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.html',
  styleUrls: ['./pie-chart.css'],
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  // This is all temporary mock data
  // Needs to be replaced with actual backend once that is finished
  // TODO: Replace with backend data

  public konten = [
    { name: 'Konto 1', amount: 420 },
    { name: 'Konto 2', amount: 260 },
    { name: 'Konto 3', amount: 320 },
    { name: 'Konto 4', amount: 620 },
    { name: 'Konto 5', amount: 160 },
    { name: 'Konto 6', amount: 820 },
  ];

  private chart?: Chart;

  constructor(public languageService: LanguageService) {}

  ngAfterViewInit(): void {
    const labels = this.konten.map((k) => k.name);
    const data = this.konten.map((k) => k.amount);

    this.chart = new Chart(this.pieCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data, backgroundColor: ['#438a8eff', '#6ea4daff', '#165087ff'] }],
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
              meta.data.forEach((element: any, index) => {
                const data = dataset.data[index] as number;
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
                
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial'; 
                // TODO: figure out if we can use custom fonts here 
                // not that important tho
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Draw the label name & amount
                ctx.fillText(label, x, y - 8);
                ctx.fillText(`${data}`, x, y + 8);
              });
            });
          }
        }
      ]
    });
  }
}