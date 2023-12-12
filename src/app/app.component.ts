import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FindStockComponent } from './find-stock/find-stock.component'
import { IncomeStatementComponent } from './income-statement/income-statement.component';
import { StockComponent } from './stock/stock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FindStockComponent, IncomeStatementComponent, StockComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-fireball';


}
