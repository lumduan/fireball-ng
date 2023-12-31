import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IncomeStatementComponent } from './financial-statement/income-statement/income-statement.component';
import { StockComponent } from './stock/stock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IncomeStatementComponent, StockComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CheckHoon';

  activeTab = 0;

  tabs = [
    { title: 'Home', content: 'Lorem ipsum dolor sit amet...' },
    { title: 'Menu 1', content: 'Ut enim ad minim veniam...' },
    { title: 'Menu 2', content: 'Sed ut perspiciatis unde omnis iste natus error...' }
  ];

}
