import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../shared/services/language.service';
import { KontenService, Konto, KontoMember } from '../../../shared/services/konten.service';

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
  isExpanded: boolean = false;
  showDetailModal: boolean = false;
  selectedKonto: Konto | null = null;
  kontoMembers: KontoMember[] = [];
  loadingMembers: boolean = false;

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

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  showKontoDetail(konto: Konto): void {
    this.selectedKonto = konto;
    this.showDetailModal = true;
    this.loadKontoMembers(konto.kontoId);
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedKonto = null;
    this.kontoMembers = [];
  }

  loadKontoMembers(kontoId: string): void {
    this.loadingMembers = true;
    this.kontenService.getKontoMembers(kontoId).subscribe({
      next: (members) => {
        this.kontoMembers = members;
        this.loadingMembers = false;
      },
      error: (error) => {
        console.error('Error loading konto members:', error);
        this.loadingMembers = false;
      }
    });
  }
}