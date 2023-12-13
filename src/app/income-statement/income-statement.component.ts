import { Component, OnInit,OnDestroy } from '@angular/core';
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

  quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  yoy: any = {
    yearsQuarters: {},
    totalRevenue : {},
  }

  numberPastofYear: number = 5;

  // data: any = [];


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

  ngOnDestroy(): void {
    this.destroyTotalRevenueChart();
    this.ngUnsubscribe.next(undefined);  // Pass undefined or any value here.
    this.ngUnsubscribe.complete();
  }

  private destroyTotalRevenueChart(): void {
    if (this.chartTotalRevenue) {
      this.chartTotalRevenue.destroy();
      this.chartTotalRevenue = null;
    }
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

          //สร้าง YoY Array
          //เก็บค่าtotalRevenueYoY q1 - q4 ในปีที่เลือกหุ้น

          this.yoy.totalRevenue = {}
          this.yoy.yearsQuarters = {}

          const currentYear = this.stock.period.split(' ')[0];

          for (const quarter of this.quarters) {
            const yearQuarter = this.stockService.GenYoYArray(`${currentYear} ${quarter}`, this.numberPastofYear);


            // Initialize arrays if they don't exist
            if (!this.yoy.yearsQuarters[quarter.toLowerCase()]) {
              this.yoy.yearsQuarters[quarter.toLowerCase()] = [];
            }

            if (!this.yoy.totalRevenue[quarter.toLowerCase()]) {
              this.yoy.totalRevenue[quarter.toLowerCase()] = [];
            }

            this.yoy.yearsQuarters[quarter.toLowerCase()] = yearQuarter;

            for (const yq of yearQuarter) {
              this.yoy.totalRevenue[quarter.toLowerCase()].push(this.stock.pl['Total Revenue'][`${yq}`].value || 0);
            }
          }

          // console.log('YOY YQ : ',this.yoy) //แสดง array ของ yoy q ที่ต้องการ
          // console.log('YOY TotalRevenue : ',this.yoy.totalRevenue)

          const chartTotalRevenueData = this.stockService.CombineYQData(this.yoy.totalRevenue,this.yoy.yearsQuarters);
          console.log('Data Combile : ',chartTotalRevenueData)


          // Chart Area

            // The datasets array is dynamically generated based on the years present in the this.yoy.yearsQuarters["q1"] array.
            // The map function is used to create a dataset for each year.
            // The chartData object is constructed with the dynamic dataset
          const datasets = this.yoy.yearsQuarters["q1"].map((yearQuarter: string) => {
            const year = Number(yearQuarter.split(" ")[0]);

            return {
              label: year.toString(),
              data: chartTotalRevenueData.map((item: any) => item[year]),
              parsing: {
                yAxisKey: year.toString()
              }
            };
          });

          // Chart totalRevenue
          this.destroyTotalRevenueChart();
          this.chartTotalRevenue = new Chart('chartTotalRevenue', {
            type: 'bar',
            data: {
              labels: this.quarters,
              datasets: datasets,
            },

            options: {
              responsive: false,
              // maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  display: true,
                },
                title: {
                  display: false,
                  text: 'Total Revenue',
                },
              },
            },
          });

          console.log('Data received:', this.stock)
          //

        },

        (error) => {
          console.error('Error:', error);
        }
      )
  }




}


