import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class DashboardTransactionsComponent {
  constructor(public languageService: LanguageService) {}
}
