import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { stock } from '../stock.service'
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

@Component({
  selector: 'app-income-statement',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,],
  templateUrl: './income-statement.component.html',
  styleUrl: './income-statement.component.css'
})

export class IncomeStatementComponent {

  data: any = [];
  symbol:string = 'CPALL'
  symbol_check: string =''

  constructor(private stock_service: stock) {}

  ngOnInit() {
    this.getData()
    // console.log(this.data)

  }



  getData(){
    this.stock_service.getFs('TU', 'pl')
    .subscribe(
      (data) => {
        this.data = data
        console.log('Data received:', this.data)
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
