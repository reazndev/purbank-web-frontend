import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';

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
    private kontenService: KontenService
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
        console.error('Error loading konten:', error);
      }
    });
  }

  calculateTotalWealth(): void {
    this.totalWealth = this.konten.reduce((sum, konto) => sum + konto.balance, 0);
  }
}
