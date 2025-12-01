import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-reoccuring-transactions',
  imports: [],
  templateUrl: './reoccuring-transactions.component.html',
  styleUrl: './reoccuring-transactions.component.css',
})
export class ReoccuringTransactionsComponent {
  constructor(public languageService: LanguageService) {}

}
