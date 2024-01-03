import { FinancialService } from '../financial-statement.service';


const financialService = new FinancialService

function GetLastYear(stock:any):string {
  return financialService.GetLastQuarterList(stock.period,5)[4];
}

function GetStockSector(stock:any):string{
  return stock.sector;
}

function GetTotalRevenue(stock:any):any{

  if (GetStockSector(stock) === 'Banking') {
    stock.totalRevenueItemName = 'Interest Income'
    return stock.pl['Interest Income'][stock.period].value;
  }
  else{
    stock.totalRevenueItemName = 'Total Income'
    return stock.pl['Total Revenue'][stock.period].value;
  }
}

function GetTotalRevenueLastYear(stock:any):any{
  if (GetStockSector(stock) === 'Banking') {
    return stock.pl['Interest Income'][GetLastYear(stock)].value;
  }
  else{
    return stock.pl['Total Revenue'][GetLastYear(stock)].value;
  }

}

function GetTotalRevenueYoY(stock:any):any{
  return stock.totalRevenue - stock.totalRevenueLastYear;
}

function GetTotalRevenusYoYPercent(stock:any):any{
  return (stock.totalRevenusYoY / Math.abs(stock.totalRevenueLastYear)) * 100
}

function GetGrossProfit(stock:any):any{

  if (GetStockSector(stock) === 'Banking') {
    stock.grossProfitItemName = 'Net Interest Income'
    return stock.pl['Net Interest Income'][stock.period].value;
  }

  else if (GetStockSector(stock) === 'Finance and Securities') {
    stock.grossProfitItemName = 'EBIT'
    return stock.pl['Profit (Loss) Before Finance Costs And Income Tax Expense'][stock.period].value;
  }

  else{
    stock.grossProfitItemName = 'Gross Profit'
    return stock.pl['Revenue From Operations'][stock.period].value - stock.pl['Costs'][stock.period].value
  }
}

function GetGrossProfitLastYear(stock:any):any{
  if (GetStockSector(stock) === 'Banking') {
    return stock.pl['Net Interest Income'][GetLastYear(stock)].value;
  }

  else if (GetStockSector(stock) === 'Finance and Securities') {
    return stock.pl['Profit (Loss) Before Finance Costs And Income Tax Expense'][GetLastYear(stock)].value;
  }

  else{
    return stock.pl['Revenue From Operations'][GetLastYear(stock)].value - stock.pl['Costs'][GetLastYear(stock)].value
  }
}

function GetGrossProfitYoY(stock:any):any{
  return stock.gp - stock.gpLastYear;
}

function GetGrossProfitYoYPercent(stock:any):any{
  return (stock.gpYoY / Math.abs(stock.gpLastYear)) * 100
}

function GetNetProfit(stock:any):any{
  stock.netProfitItemName = 'Net Profit'
  return stock.pl['Net Profit (Loss) For The Period'][stock.period].value;
}

function GetNetProfitLastYear(stock:any):any{
  return stock.pl['Net Profit (Loss) For The Period'][GetLastYear(stock)].value;
}

function GetNetProfitYoY(stock:any):any{
  return stock.np - stock.npLastYear;
}

function GetNetProfitYoYPercent(stock:any):any{
  return (stock.npYoY / Math.abs(stock.npLastYear)) * 100
}


const GetFinancialIncomeCard = (stock:any):string =>{
  stock.totalRevenue = GetTotalRevenue(stock);
  stock.totalRevenueLastYear = GetTotalRevenueLastYear(stock);
  stock.totalRevenusYoY = GetTotalRevenueYoY(stock);
  stock.totalRevenusYoYPercent = GetTotalRevenusYoYPercent(stock);

  stock.gp = GetGrossProfit(stock);
  stock.gpLastYear = GetGrossProfitLastYear(stock);
  stock.gpYoY = GetGrossProfitYoY(stock);
  stock.gpYoYPercent = GetGrossProfitYoYPercent(stock);

  stock.np = GetNetProfit(stock);
  stock.npLastYear = GetNetProfitLastYear(stock);
  stock.npYoY = GetNetProfitYoY(stock);
  stock.npYoYPercent = GetNetProfitYoYPercent(stock);

  return stock
}

export { GetFinancialIncomeCard }
