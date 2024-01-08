import { FinancialService } from '../financial-statement.service';
import { Chart, controllers, registerables,ChartConfiguration, ChartType } from 'chart.js/auto';

Chart.register(...registerables);

const financialService = new FinancialService;

const stockCurrentYear = (stock:any) =>{
  return financialService.GetCurrentYear(stock)
}

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];


const numberPastOfYear:number = 5;
const predefinedColors = [
  'rgba(5, 74, 145, 0.6)',     // Royal Blue (traditional)
  'rgba(67, 127, 151, 0.7)',  // Cerulean
  'rgba(132, 147, 36, 0.7)',  // Olive
  'rgba(255, 179, 0, 0.9)',  // Selective Yellow
  'rgba(241, 115, 0, 0.9)'    // Orange
];


function InitializeChart(stock:any):any{
  if (!stock || typeof stock !== 'object') {
    throw new Error('Invalid stock object provided');
  }

  stock.chart = [];
  return stock;
}

function CreateYoYArrayData(stock:any):any{

  stock.chart.yearsQuarters = [];
  stock.chart.yearQuartersData = [];

  for (const quarter of quarters){

    const yearQuarters = financialService.CreateYoYArray(`${ stockCurrentYear(stock)} ${quarter}`, numberPastOfYear);

    stock.chart.yearsQuarters[quarter.toLowerCase()] = yearQuarters;
    stock.chart.yearQuartersData[quarter.toLowerCase()] = [];

    for (const yq of yearQuarters) {
      if(stock.chart.item ==='gp'){
        stock.chart.yearQuartersData[quarter.toLowerCase()].push(stock.pl['Revenue From Operations'][`${yq}`].value - stock.pl['Costs'][`${yq}`].value || 0);
      }
      else{
        stock.chart.yearQuartersData[quarter.toLowerCase()].push(stock.pl[stock.chart.item][`${yq}`].value || 0);
      }
    }
  }
  return stock;
}


function CreateChartData(stock:any):any{
  stock = CreateYoYArrayData(stock);
  return financialService.CombineYQData(stock.chart.yearQuartersData,stock.chart.yearsQuarters);
}

function CreateChartDataSets(stock: any): any {

  // Assign a color to each year
  const yearColors: Record<string, string> = {};
  stock.chart.yearsQuarters["q1"].forEach((yearQuarter: string, index: number) => {
    const year = yearQuarter.split(" ")[0];
    if (!yearColors[year]) {
      // Use modulo operator to loop through colors if there are more years than colors
      yearColors[year] = predefinedColors[index % predefinedColors.length];
    }
  });

  // Create data sets with the assigned color for all quarters of each year
  return stock.chart.yearsQuarters["q1"].map((yearQuarter: string) => {
    const year = yearQuarter.split(" ")[0];

    return {
      label: year, // Changed to just year to remove 'Q1' from the legend
      data: stock.chart.data.map((item: any) => item[Number(year)]),
      parsing: {
        yAxisKey: yearQuarter
      },
      backgroundColor: yearColors[year], // Use the assigned color for the year
      borderColor: yearColors[year], // Use the assigned color for the year
    };
  });
}




function CreateYoYChart(stock:any):any{
  return new Chart(stock.chart.id, {
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
          display: true,
          text: stock.chart.title,
          font: {
            size: 16
          },
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

function GetYoYChart(stock:any):any{

  stock.chart.data = CreateChartData(stock);
  stock.chart.dataset = CreateChartDataSets(stock);

  // console.log('Stock Data in chart.ts : ', stock)

  return CreateYoYChart(stock)
}

const GetChartIncome = (stock:any) =>{
  stock = InitializeChart(stock)

  stock.chart.id = 'chartIncome'

  if (stock.sector === 'Banking') {
    stock.chart.item = 'Interest Income'
    stock.chart.title = 'Interest Income'
  }

  else{
    stock.chart.item = 'Revenue From Operations'
    stock.chart.title = 'Total Income'
  }

  return GetYoYChart(stock);
}

const GetChartGP = (stock:any) =>{
  stock = InitializeChart(stock)

  stock.chart.id = 'chartGP'

  if (stock.sector === 'Banking') {
    stock.chart.item = 'Net Interest Income'
    stock.chart.title = 'Net Interest Income'
  }

  else if (stock.sector === 'Finance and Securities') {
    stock.chart.item = 'Profit (Loss) Before Finance Costs And Income Tax Expense'
    stock.chart.title = 'EBIT'
  }

  else{
    stock.chart.item = 'gp'
    stock.chart.title = 'Gross Profit'
  }

  return GetYoYChart(stock);
}

const GetChartNP  = (stock:any) =>{
  stock = InitializeChart(stock)
  stock.chart.id = 'chartNP'
  stock.chart.item = 'Net Profit (Loss) Attributable To : Owners Of The Parent'
  stock.chart.title = 'Net Profit'
  return GetYoYChart(stock);
}

export { GetChartIncome, GetChartGP, GetChartNP }
