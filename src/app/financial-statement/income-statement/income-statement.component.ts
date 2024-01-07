import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, controllers, registerables } from 'chart.js/auto';
import { ThisReceiver } from '@angular/compiler';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Subject, takeUntil } from 'rxjs';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {createTableQoQ, createTableMain } from './income-statement-table';
import {GetYoYChart} from './income-statement-chart'
import {GetFinancialIncomeCard} from './income-statement-card';
import { StockService } from '../../stock.service';
import { FinancialService } from '../financial-statement.service';




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

  numberPastofYear: number = 5;

  // Chart
  chartTotalRevenue: any;
  chartGrossProfit: any;
  chartNetProfit: any;

  stockService: StockService;
  financialService: FinancialService;
  dataFrame: any;
  tableQoQ: Tabulator | undefined;
  tableMain: Tabulator | undefined;
  PlTable: any;
  plTemplate: any = [];

  constructor(stockService: StockService, financialService: FinancialService) {
    this.stockService = stockService;
    this.financialService = financialService;
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
          data.period = this.financialService.ConvertPeriodToYQ(data.period);

          this.stock = data;

          // สร้าง Table QoQ
          const tableQoQ = '#tableQoQ';
          createTableQoQ(tableQoQ, this.stock);

          // สร้าง Table Main
          const tableMain = '#tableMain';
          createTableMain(tableMain, this.stock);

          //สร้าง incomeStatement-card
          this.stock = GetFinancialIncomeCard(this.stock)

          this.destroyChart()
          this.chartTotalRevenue = GetYoYChart(this.stock,'Total Revenue')
          // this.chartGrossProfit = GetYoYChart(this.stock,'Total Revenue')
          this.chartNetProfit = GetYoYChart(this.stock,'Net Profit (Loss) Attributable To : Owners Of The Parent')


          // Console to result area
          console.log('Data received:', this.stock)
          this.plTemplate = this.stock.fs_templates.pl.income

        },

        (error) => {
          console.error('Error:', error);
        }
      )
      // Teble Area

  }

}
