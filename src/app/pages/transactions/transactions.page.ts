import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CreateTransactionComponent } from '../../components/transactions/create-transaction.component/create-transaction.component';
import { CompletedTransactionsComponent } from '../../components/transactions/completed-transactions.component/completed-transactions.component';
import { PendingTransactionsComponent } from '../../components/transactions/pending-transactions.component/pending-transactions.component';
import { ReoccuringTransactionsComponent } from '../../components/transactions/reoccuring-transactions.component/reoccuring-transactions.component';
import { TransactionFilterComponent } from '../../components/transactions/transaction-filter/transaction-filter.component';

@Component({
  selector: 'app-transactions',
  imports: [
    RouterModule, 
    FooterComponent, 
    NavbarComponent, 
    CreateTransactionComponent, 
    CompletedTransactionsComponent, 
    PendingTransactionsComponent, 
    ReoccuringTransactionsComponent,
    TransactionFilterComponent
  ],
  templateUrl: './transactions.page.html',
  styleUrl: './transactions.page.css',
})
export class TransactionsPage {

}
