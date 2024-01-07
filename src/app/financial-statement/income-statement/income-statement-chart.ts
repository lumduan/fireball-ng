import { FinancialService } from '../financial-statement.service';
import { Chart, controllers, registerables,ChartConfiguration, ChartType } from 'chart.js/auto';

Chart.register(...registerables);

const financialService = new FinancialService;

const stockCurrentYear = (stock:any) =>{
  return financialService.GetCurrentYear(stock)
}

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const numberPastOfYear:number = 5;

function CreateYoYArrayData(stock:any):any{

  stock.chart.yearsQuarters = [];
  stock.chart.yearQuartersData = [];

  for (const quarter of quarters){

    const yearQuarters = financialService.CreateYoYArray(`${ stockCurrentYear(stock)} ${quarter}`, numberPastOfYear);

    stock.chart.yearsQuarters[quarter.toLowerCase()] = yearQuarters;
    stock.chart.yearQuartersData[quarter.toLowerCase()] = [];

    for (const yq of yearQuarters) {
      stock.chart.yearQuartersData[quarter.toLowerCase()].push(stock.pl[stock.chart.name][`${yq}`].value || 0);
    }
  }
  return stock;
}

function CreateChartData(stock:any):any{
  stock = CreateYoYArrayData(stock);
  return financialService.CombineYQData(stock.chart.yearQuartersData,stock.chart.yearsQuarters);
}

function CreateChartDataSets(stock:any):any {
  return stock.chart.yearsQuarters["q1"].map((yearQuarter: string) => {
    const year = Number(yearQuarter.split(" ")[0]);

    return {
      label: year.toString(),
      data: stock.chart.data.map((item: any) => item[year]),
      parsing: {
        yAxisKey: year.toString()
      }
    };
  });
}

function CreateYoYChart(stock:any):any{
  return new Chart(stock.chart.name, {
    type: 'bar',
    data: {
      labels: quarters,
      datasets: stock.chart.dataset,
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
  });
}


const GetYoYChart = (stock:any, chartName:string) => {
  if (!stock || typeof stock !== 'object') {
    throw new Error('Invalid stock object provided');
  }

  stock.chart = [];
  stock.chart.name = chartName;
  stock.chart.data = CreateChartData(stock);
  stock.chart.dataset = CreateChartDataSets(stock);

  console.log('Stock Data in chart.ts : ', stock)

  return CreateYoYChart(stock)
}

export { GetYoYChart }
