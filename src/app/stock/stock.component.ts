import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockService } from '../stock.service';
import { IncomeStatementComponent } from '../financial-statement/income-statement/income-statement.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [IncomeStatementComponent,FormsModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {

  symbol: string = '';

  constructor(private stockService: StockService) {}


  ngOnInit() {

  }

  GetStockData(){
    this.stockService.symbol = this.symbol.toUpperCase();
    this.symbol = '';
    // console.log(this.stockService.symbol);
  }

}
