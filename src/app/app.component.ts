import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FindStockComponent } from './find-stock/find-stock.component'
import { IncomeStatementComponent } from './income-statement/income-statement.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FindStockComponent, IncomeStatementComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-fireball';
  show_chart1 = false;
  show_chart2 = true;

  toggle_chart1() {
    this.show_chart1 = !this.show_chart1;
  }

  toggle_chart2() {
    this.show_chart2 = !this.show_chart2;
  }

}
