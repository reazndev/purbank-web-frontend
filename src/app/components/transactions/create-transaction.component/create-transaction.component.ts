import { Component } from '@angular/core';
import { LanguageService } from '../../../shared/services/language.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent {
  constructor(public languageService: LanguageService) {}

  accounts: any[] = [
    { id: 1, name: 'Checking Account' },
    { id: 2, name: 'Savings Account' },
    { id: 3, name: 'Business Account' },
    { id: 4, name: 'Investment Account' }
  ]; // Mock data

  // TODO: Need to validate IBAN -> is valid or not -> allow send / dont allow 

  selectedAccount: string = '';
  isInstant: boolean = false;
  isReoccuring: boolean = false;
  ibanReceiver: string = '';
  amount: number = 0;
  message: string = '';
  note: string = '';

  calculateBalanceAfter(): string {
    // TODO: Connect to backend for real balance calculation
    return 'TODO: Calculate balance';
  }
}
