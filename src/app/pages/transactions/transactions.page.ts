import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { TransactionsListComponent } from '../../components/transactions/transactions-list/transactions-list.component';
import { TransactionFilterComponent } from '../../components/transactions/transaction-filter/transaction-filter.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    RouterModule, 
    FooterComponent, 
    NavbarComponent, 
    TransactionsListComponent, 
    TransactionFilterComponent
  ],
  templateUrl: './transactions.page.html',
  styleUrl: './transactions.page.css',
})
export class TransactionsPage {

}
