import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-completed-transactions',
  imports: [],
  templateUrl: './completed-transactions.component.html',
  styleUrl: './completed-transactions.component.css',
})
export class CompletedTransactionsComponent {
  constructor(public languageService: LanguageService) {}

}
