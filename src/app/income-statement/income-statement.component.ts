import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../stock.service';
import { stock } from '../stock';
import { Chart, registerables } from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-income-statement',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './income-statement.component.html',
  styleUrl: './income-statement.component.css',
})

export class IncomeStatementComponent implements OnInit {

  private ngUnsubscribe = new Subject();

  stock: any = {};
  data: any = [];
  chartTotalRevenue: any;

  stockService: StockService;

  constructor(stockService: StockService) {
    this.stockService = stockService;
  }



  ngOnInit() {

    this.stockService.symbol$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((symbol) => {
        console.log('Symbol :', symbol);
        this.GetData(symbol)
      });

  }


  GetData(symbol: string) {
    this.stockService.GetFs(symbol, 'pl')
      .subscribe(
        (data) => {
          // ปรับค่า period จาก 'Q/Y' ให้เป็น 'Y Q'
          data.period = this.stockService.ConvertPeriodToYQ(data.period);
          this.stock = data;

          // คำนวณ Last Year Q : ex. '2023 Q3' => '2022 Q3'
          const lastYear: string = this.stockService.SubtractOneYear(this.stock.period)

          this.stock.totalRevenue = this.stock.pl['Total Revenue'][this.stock.period].value
          this.stock.totalRevenueLastYear = this.stock.pl['Total Revenue'][lastYear].value
          this.stock.totalRevenusYoY = this.stock.totalRevenue - this.stock.totalRevenueLastYear
          this.stock.totalRevenusYoYPercent = (this.stock.totalRevenusYoY / Math.abs(this.stock.totalRevenueLastYear)) * 100


          this.stock.gp = this.stock.pl['Revenue From Operations'][this.stock.period].value - this.stock.pl['Costs'][this.stock.period].value
          this.stock.gpLastYear = this.stock.pl['Revenue From Operations'][lastYear].value - this.stock.pl['Costs'][lastYear].value
          this.stock.gpYoY = this.stock.gp - this.stock.gpLastYear
          this.stock.gpYoYPercent = (this.stock.gpYoY / Math.abs(this.stock.gpLastYear)) * 100

          this.stock.np = this.stock.pl['Net Profit (Loss) For The Period'][this.stock.period].value
          this.stock.npLastYear = this.stock.pl['Net Profit (Loss) For The Period'][lastYear].value
          this.stock.npYoY = this.stock.np - this.stock.npLastYear
          this.stock.npYoYPercent = (this.stock.npYoY / Math.abs(this.stock.npLastYear)) * 100

          // Chart Area
          // this.chartTotalRevenue = new Chart('chartTotalRevenue',{
          //   type: 'bar',
          //   data: {
          //     labels: this.chart_labels,
          //     datasets: [{
          //       label: 'Total Revenue MB.',
          //       data: this.chart_values,
          //       backgroundColor: [
          //         'rgba(255, 99, 132, 0.7)',
          //         'rgba(54, 162, 235, 0.7)',
          //         'rgba(255, 206, 86, 0.7)',
          //         'rgba(75, 192, 192, 0.7)',
          //       ],
          //       borderColor: [
          //         'rgba(255, 99, 132, 1)',
          //         'rgba(54, 162, 235, 1)',
          //         'rgba(255, 206, 86, 1)',
          //         'rgba(75, 192, 192, 1)',
          //       ],
          //       borderWidth: 1
          //     }]
          //   },
          //   options: {
          //     scales: {
          //       y: {
          //         beginAtZero: true
          //       }
          //     }
          //   }
          // })




          console.log('Data received:', this.stock)
          // console.log('Gen YOY:', this.stockService.GenYoYArray('2023 Q3',3))

        },

        (error) => {
          console.error('Error:', error);
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
