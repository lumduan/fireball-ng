import { FinancialService } from '../financial-statement.service';
import { Chart, controllers, registerables } from 'chart.js/auto';

Chart.register(...registerables);

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
let yoy: any = {
  yearsQuarters: {},
  totalRevenue : {},
  grossProfit : {},
  netProfit : {}
}

const numberPastofYear:number = 5;

// Chart
let chartTotalRevenue: any;
let chartGrossProfit: any;
let chartNetProfit: any;
