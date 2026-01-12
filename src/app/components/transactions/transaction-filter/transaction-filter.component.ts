import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../shared/services/language.service';
import { TransactionFilterService } from '../../../shared/services/transaction-filter.service';
import { KontenService, Konto } from '../../../shared/services/konten.service';

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.css'
})
export class TransactionFilterComponent implements OnInit {
  @Input() showTypeFilter: boolean = false;
  konten: Konto[] = [];
  selectedKontoId: string = 'all';
  selectedType: 'all' | 'INCOMING' | 'OUTGOING' = 'all';

  constructor(
    public languageService: LanguageService,
    private filterService: TransactionFilterService,
    private kontenService: KontenService
  ) {}

  ngOnInit(): void {
    // Sync with service state
    this.selectedKontoId = this.filterService.getSelectedKontoId()();
    this.selectedType = this.filterService.getSelectedTransactionType()();

    this.kontenService.getKonten().subscribe({
      next: (konten) => {
        this.konten = konten;
      },
      error: (err) => console.error('Failed to load accounts for filter', err)
    });
  }

  onSelectionChange(): void {
    this.filterService.setSelectedKontoId(this.selectedKontoId);
  }

  onTypeChange(): void {
    this.filterService.setSelectedTransactionType(this.selectedType);
  }
}
