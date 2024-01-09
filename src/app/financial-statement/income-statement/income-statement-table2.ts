import { FinancialService } from '../financial-statement.service';

const financialService = new FinancialService();

const numberOfQuarters = 20;

const fixedDecimal = 2;

function InitializeTable(stock: any): any {
  if (!stock || typeof stock !== 'object') {
    throw new Error('Invalid stock object provided');
  }
  stock.table = [];
  return stock;
}

function GetIncomeStatementItems(stock: any): { id: number; item: string }[] {
  const template = stock.fs_templates.pl.income;

  let items: { id: number; item: string }[] = [];
  Object.entries(template).forEach(([key, value]) => {
    if (typeof value === 'string' && value.endsWith('#ITEM')) {
      items.push({ id: parseInt(key), item: value });
    }
  });

  return items;
}

function RemoveItemsTag(stock: any): { id: number; item: string }[] {
  function ReplaceItemAndHeader(item: string): string {
    return item.replace('#ITEM', '').replace('#HEADER', '');
  }

  return stock.table.items.map((obj: { id: number; item: string }) => ({
    id: obj.id,
    item: ReplaceItemAndHeader(obj.item),
  }));
}

function GetQuarterList(stock: any): string[] {
  return financialService.GetLastQuarterList(stock.period, numberOfQuarters);
}

function CreateDisplayedColumns(stock: any): string[] {
  stock.table.quarterList.unshift('item');
  return stock.table.quarterList;
}

function GetDataSource(stock: any): any {
  return stock.table.items.map((items: any) => {
    const data = stock.pl[items.item];
    if (data) {
      // Merge financial data directly into tableItem
      Object.keys(data).forEach((key) => {
        items[key] = parseFloat(data[key].value).toFixed(fixedDecimal);
      });
    }
    return items;
  });
}

function GetTableIncomeStatement(stock: any): any {
  stock = InitializeTable(stock);

  stock.table.name = 'Historical Income Statement';
  stock.table.quarterList = GetQuarterList(stock);
  stock.table.displayedColumns = CreateDisplayedColumns(stock);
  stock.table.items = GetIncomeStatementItems(stock);
  stock.table.items = RemoveItemsTag(stock);
  stock.table.dataSource = GetDataSource(stock);

  console.log('From income table data : ', stock.table);

  return stock.table;
}
export { GetTableIncomeStatement };
