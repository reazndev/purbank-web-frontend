import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css'],
})
export class ComponentDashboardTransactions {
  constructor(public languageService: LanguageService) {}
}
