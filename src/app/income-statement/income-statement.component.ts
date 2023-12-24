import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService } from '../stock.service';
import { Chart, controllers, registerables } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subject, takeUntil } from 'rxjs';
import DataFrame from 'dataframe-js';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { createTableQoQ, createTableMain } from './income-statement-table';
import { ThisReceiver } from '@angular/compiler';


Chart.register(...registerables);
// Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
  color: '#FE777B'
});


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
    grossProfit : {},
    netProfit : {}
  }

  numberPastofYear: number = 5;

  // Chart
  chartTotalRevenue: any;
  chartGrossProfit: any;
  chartNetProfit: any;

  stockService: StockService;
  dataFrame: any;
  tableQoQ: Tabulator | undefined;
  tableMain: Tabulator | undefined;
  PlTable: any;
  plTemplate: any = [];

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
    this.destroyChart();
    this.ngUnsubscribe.next(undefined);  // Pass undefined or any value here.
    this.ngUnsubscribe.complete();
  }

  private destroyChart(): void {
    if (this.chartTotalRevenue) {
      this.chartTotalRevenue.destroy();
      this.chartTotalRevenue = null;
    }

    if (this.chartGrossProfit) {
      this.chartGrossProfit.destroy();
      this.chartGrossProfit = null;
    }

    if (this.chartNetProfit) {
      this.chartNetProfit.destroy();
      this.chartNetProfit = null;
    }

  }


  GetData(symbol: string) {
    this.stockService.GetFs(symbol, 'pl')
      .subscribe(
        (data) => {
          // ปรับค่า period จาก 'Q/Y' ให้เป็น 'Y Q'
          data.period = this.stockService.ConvertPeriodToYQ(data.period);
          this.stock = data;

          // สร้าง Table QoQ
          const tableQoQ = '#tableQoQ';
          createTableQoQ(tableQoQ, this.stock);

          // สร้าง Table Main
          const tableMain = '#tableMain';
          createTableMain(tableMain, this.stock);

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
          this.yoy.grossProfit = {}
          this.yoy.netProfit = {}
          this.yoy.yearsQuarters = {}

          // แยก String โดยแยก Year ออกจาก Q ซึ่ง Year จะอยู่ตำแหน่งที่ [0] และ อยู่ตำแหน่งที่[1]
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
            if (!this.yoy.grossProfit[quarter.toLowerCase()]) {
              this.yoy.grossProfit[quarter.toLowerCase()] = [];
            }
            if (!this.yoy.netProfit[quarter.toLowerCase()]) {
              this.yoy.netProfit[quarter.toLowerCase()] = [];
            }

            this.yoy.yearsQuarters[quarter.toLowerCase()] = yearQuarter;

            for (const yq of yearQuarter) {
              this.yoy.totalRevenue[quarter.toLowerCase()].push(this.stock.pl['Total Revenue'][`${yq}`].value || 0);
              this.yoy.grossProfit[quarter.toLowerCase()].push(this.stock.pl['Revenue From Operations'][`${yq}`].value - this.stock.pl['Costs'][`${yq}`].value || 0);
              this.yoy.netProfit[quarter.toLowerCase()].push(this.stock.pl['Net Profit (Loss) For The Period'][`${yq}`].value || 0);
            }
          }

          // console.log('YOY YQ : ',this.yoy) //แสดง array ของ yoy q ที่ต้องการ
          // console.log('YOY Data : ',this.yoy)

          // PrepareData to Chart
          const chartTotalRevenueData = this.stockService.CombineYQData(this.yoy.totalRevenue,this.yoy.yearsQuarters);
          const chartGrossProfitData = this.stockService.CombineYQData(this.yoy.grossProfit,this.yoy.yearsQuarters);
          const chartNetProfitData = this.stockService.CombineYQData(this.yoy.netProfit,this.yoy.yearsQuarters);
          // console.log('Data Combile : ',chartTotalRevenueData)


          // Chart Area
          this.destroyChart();

          // Chart totalRevenue
            // The datasets array is dynamically generated based on the years present in the this.yoy.yearsQuarters["q1"] array.
            // The map function is used to create a dataset for each year.
            // The chartData object is constructed with the dynamic dataset
          const chartTotalRevenueDatasets = this.yoy.yearsQuarters["q1"].map((yearQuarter: string) => {
            const year = Number(yearQuarter.split(" ")[0]);

            return {
              label: year.toString(),
              data: chartTotalRevenueData.map((item: any) => item[year]),
              datalabels: {
                color: '#FFCE56'
              },
              parsing: {
                yAxisKey: year.toString()
              }
            };
          });


          this.chartTotalRevenue = new Chart('chartTotalRevenue', {
            type: 'bar',
            data: {
              labels: this.quarters,
              datasets: chartTotalRevenueDatasets,
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

                datalabels: {
                  color: '#36A2EB',
                  rotation: -90,
                  formatter: function(value, context) {
                    return Math.round(value) + ' MB';
                  },
                },

              },
            },
          }); // End Chart totalRevenue

          // Chart GrossProfit

          const chartGrossProfitDatasets = this.yoy.yearsQuarters["q1"].map((yearQuarter: string) => {
            const year = Number(yearQuarter.split(" ")[0]);

            return {
              label: year.toString(),
              data: chartGrossProfitData.map((item: any) => item[year]),
              parsing: {
                yAxisKey: year.toString()
              }
            };
          });


          this.chartGrossProfit = new Chart('chartGrossProfit', {
            type: 'bar',
            data: {
              labels: this.quarters,
              datasets: chartGrossProfitDatasets,
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
                  text: 'GP',
                },
              },
            },
          }); // End Chart GrossProfit

          // Chart NetProfit
          const chartNetProfitDatasets = this.yoy.yearsQuarters["q1"].map((yearQuarter: string) => {
            const year = Number(yearQuarter.split(" ")[0]);

            return {
              label: year.toString(),
              data: chartNetProfitData.map((item: any) => item[year]),
              parsing: {
                yAxisKey: year.toString()
              }
            };
          });


          this.chartNetProfit = new Chart('chartNetProfit', {
            type: 'bar',
            data: {
              labels: this.quarters,
              datasets: chartNetProfitDatasets,
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
                  text: 'NP',
                },

              },
            },
          }); // End Chart NetProfit

          // Console to result area
          console.log('Data received:', this.stock)
          this.plTemplate = this.stock.fs_templates.pl.income
          // console.log('FS Templates : ',this.plTemplate)
          //

        },

        (error) => {
          console.error('Error:', error);
        }
      )
      // Teble Area

  }

}
