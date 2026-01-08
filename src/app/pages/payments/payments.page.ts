import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CreateTransactionComponent } from '../../components/transactions/create-transaction.component/create-transaction.component';
import { CompletedTransactionsComponent } from '../../components/transactions/completed-transactions.component/completed-transactions.component';
import { PendingTransactionsComponent } from '../../components/transactions/pending-transactions.component/pending-transactions.component';
import { TransactionFilterComponent } from '../../components/transactions/transaction-filter/transaction-filter.component';

@Component({
  selector: 'app-payments',
  imports: [
    RouterModule, 
    FooterComponent, 
    NavbarComponent, 
    CreateTransactionComponent, 
    CompletedTransactionsComponent, 
    PendingTransactionsComponent, 
    TransactionFilterComponent
  ],
  templateUrl: './payments.page.html',
  styleUrl: './payments.page.css',
})
export class PaymentsPage {

}
