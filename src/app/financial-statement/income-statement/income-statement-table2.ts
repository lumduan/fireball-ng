import { FinancialService } from '../financial-statement.service';

const financialService = new FinancialService;
const numberOfQuarters = 20;

function InitializeTable(stock:any):any{
  if (!stock || typeof stock !== 'object') {
    throw new Error('Invalid stock object provided');
  }

  stock.table = [];
  return stock;
}

function GetQuarterList(stock:any):any{
  return financialService.GetLastQuarterList(stock.period, numberOfQuarters)
}

function GetTableIncomeStatement(stock:any):any{

  stock = InitializeTable(stock)

  stock.table.quarterList = GetQuarterList(stock)

  console.log('From incom table data : ', stock)

}
export { GetTableIncomeStatement }
