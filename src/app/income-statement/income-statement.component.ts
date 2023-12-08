import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { stockService } from '../stock.service';
import {stock} from '../stock';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

@Component({
  selector: 'app-income-statement',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './income-statement.component.html',
  styleUrl: './income-statement.component.css',
})

export class IncomeStatementComponent {

  stock: stock = {
    symbol: 'SABINA',
    name: 'Home pro',
    fs: [],
  }

  data: any = [];
  symbol:string = 'HMPRO';

  constructor(private stockService: stockService) {}

  ngOnInit() {
    this.getData()
    // console.log(this.data)

  }



  getData(){
    this.stockService.getFs(this.stock.symbol, 'pl')
    .subscribe(
      (data) => {
        this.stock.fs = data
        console.log('Data received:', this.stock.fs)
      },
      (error) => {
        console.error('Error:', error)
      }
    )
  }




}


// Function :: สร้าง Array สำหรับ Year และ Quarter เริ่มจาก '2003 Q1'
function generateQuartersList(): string[] {
  const currentYear = new Date().getFullYear();
  const quartersList: string[] = [];

  for (let year = 2003; year <= currentYear; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
          quartersList.push(`${year} Q${quarter}`);
      }
  }

return quartersList;
}
