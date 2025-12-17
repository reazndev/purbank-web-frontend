import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';

@Component({
  selector: 'app-wealth-detailed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wealth-detailed.component.html',
  styleUrls: ['./wealth-detailed.component.css'],
})
export class WealthWealthDetailedComponent implements OnInit {
  konten: Konto[] = [];
  provisionalWealth: number = 0;
  currentWealth: number = 0;

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
        this.calculateWealth();
      },
      error: (error) => {
        console.error('Error loading konten:', error);
      }
    });
  }

  calculateWealth(): void {
    this.provisionalWealth = this.konten.reduce((sum, konto) => sum + konto.balance, 0);
    this.currentWealth = this.provisionalWealth;
  }
}