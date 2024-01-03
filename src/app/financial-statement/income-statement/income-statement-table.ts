import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { FinancialService } from '../financial-statement.service';

// FN : ดู Template จากข้อมูล stock
const GetPlTemplate = (stock: any): any => stock.fs_templates.pl.income;
const financialService = new FinancialService
// For use in Tabulator money format
const currency = {
  decimal:".",
  thousand:",",
  symbol:"",
  symbolAfter:"p",
  negativeSign:true,
  precision:false,
}

// FN : เปลี่ยน #HEADER กับ ITEM ให้เป็น ข้อความที่จะเปลี่ยนต้องอยู่ใน {item: }
//
function AddPlTableRow(data: any[]): any[] {
  function ReplaceItemAndHeader(item: string): string {
      return item.replace("#ITEM", "").replace("#HEADER", "");
  }

  return data.map(obj => ({
      id: obj.id,
      item: ReplaceItemAndHeader(obj.item)
  }));
}


/**
 * Create table columns for a Tabulator table based on an array of quarters.
 *
 * @param {string[]} quarters - An array of quarter strings in the format "YYYY QX".
 * @returns {Tabulator.ColumnDefinition[]} An array of column definitions for Tabulator.
 *
 * Usage example:
 *
 * // Define an array of quarters
 * const quartersArray = ['2023 Q3', '2023 Q2', '2023 Q1', '2022 Q4', '2022 Q3'];
 *
 * // Create table columns using the function
 * const tableColumns = CreateTableColumns(quartersArray);
 *
 * // Initialize a Tabulator table with the generated columns
 * const table = new Tabulator("#example-table", {
 *   columns: tableColumns,
 *   // ... other Tabulator options
 * });
 *
 * Expected result:
 * The function will generate an array of column definitions suitable for a Tabulator table,
 * with "Items" as the first column and each quarter as subsequent columns. The Tabulator
 * table can then be initialized using these columns.
 */


function CreateMainTableColumns(quarters: string[]) {
  const columns:any = [
    { title: "Items",
    field: "item",
    width: 350,
    headerHozAlign:"left",
    hozAlign: "left",
    headerSort: false,
    },
  ];

  for (const quarter of quarters) {
    columns.push({
      title: quarter,
      field: quarter,
      width: 160,
      headerHozAlign:"right",
      hozAlign: "right",
      headerSort: false,
      formatter:"money",
      formatterParams: currency
    });
  }

  return columns;
}

/**
 * Function: UpdateValueTableData
 * Purpose:
 *   This function is designed to merge financial data from the dataPL object into each item of the tableData array.
 *   It updates each item in tableData with corresponding financial data found in dataPL.pl, keyed by "YYYY QX".
 *
 * How it works:
 *   - The function iterates over each item in the tableData array.
 *   - For each item, it checks for corresponding financial data in dataPL.pl based on the item's name.
 *   - If matching financial data is found, the function merges this data into the tableData item.
 *   - Each key representing a quarter (e.g., "2021 Q1") and its value from dataPL.pl is added to the respective item in tableData.
 *   - The function returns an updated tableData array with merged financial data.
 *
 * Parameters:
 *   - dataPL: An object containing financial data. It should have a structure where dataPL.pl is an object with keys
 *             representing different financial metrics, each containing a sub-object keyed by "YYYY QX".
 *   - tableData: An array of objects, each with at least an 'item' property, representing different financial metrics.
 *
 * Returns:
 *   - An updated array of tableData where each item contains its original properties plus the corresponding financial data.
 *
 * Sample Usage and Output:
 *
 *   /// Sample input dataPL object
 *   const dataPL = {
 *     pl: {
 *       "Revenue From Operations": {
 *         "2021 Q1": { value: 100000 },
 *         "2021 Q2": { value: 110000 }
 *          ... more quarters
 *       },
 *        ... more items
 *     }
 *   };
 *
 *   /// Sample input tableData array
 *   const tableData = [
 *     { id: 1, item: "Revenue From Operations" }
 *     /// ... more items
 *   ];
 *
 *   /// Calling the function
 *   const updatedTableData = UpdateValueTableData(dataPL, tableData);
 *
 *   /// Expected output
 *   /// [
 *   ///   {
 *   ///     id: 1,
 *   ///     item: "Revenue From Operations",
 *   ///     "2021 Q1": 100000,
 *   ///     "2021 Q2": 110000
 *   ///     ... more quarters
 *      },
 *      /// ... more items with their respective updated financial data
 *    ]
 */
function UpdateValueMainTableData(dataPL: any, tableData: any): any {
  return tableData.map((tableItem: any) => {
    const dataPLItem = dataPL.pl[tableItem.item];
    if (dataPLItem) {
      // Merge financial data directly into tableItem
      Object.keys(dataPLItem).forEach((key) => {
        tableItem[key] = parseFloat(dataPLItem[key].value).toFixed(2);
      });
    }
    return tableItem;
  });
}

const createTableQoQ = (tableName: string, data: any): Tabulator => {

  const lastYears = financialService.CreateYoYArray(data.period, 3);

  function CreateFinancialItem(
    displayName: string,
    dataKey: any,
    data: { pl: { [x: string]: { [x: string]: { value: string; }; }; }; },
    lastYears: (string | number)[]
  ) {
    // Helper function to safely get the value
    const getValue = (year: string | number): string => {
        try {
            if(data.pl[dataKey] && data.pl[dataKey][year] && data.pl[dataKey][year].value) {
                return parseFloat(data.pl[dataKey][year].value).toFixed(2);
            } else {
                return "0";
            }
        } catch (error) {
            return "0";
        }
    }

    return {
        item: displayName,
        2: getValue(lastYears[2]),
        1: getValue(lastYears[1]),
        0: getValue(lastYears[0])
    };
  }

  // แบ่งรายการแสดงผลในตารางตาม sector ของหุ้น

  let financialItemMapping = {}

  if (data.sector === 'Banking') {
    financialItemMapping = {
      'Interest Income':'Interest Income',
      'Interest Expenses' : 'Interest Expenses',
      'Net Interest Income': 'Net Interest Income',
      'Fees & Service Income':'Fees And Service Income',
      'Fees & Service Expenses':'Fees And Service Expenses',
      'Net Fees & Service Income':'Net Fees And Service Income',
      'Other Operating Income':'Other Operating Income',
      'Other Operating Expenses':'Other Operating Expenses',
      'Expected Credit Losses' : '(Reversal Of) Expected Credit Losses',
      'EBIT' : 'Profit (Loss) From Operating Before Income Tax Expense',
      'Income Tax Expense':'Income Tax Expense',
      'Net Profit (Loss)':'Net Profit (Loss) For The Period',
      'EPS': 'Basic Earnings (Loss) Per Share (Baht/Share)',
    }
  }

  else if (data.sector === 'Finance and Securities') {
    financialItemMapping = {
      'Revenue From Operations': 'Revenue From Operations',
      'Other Income': 'Other Income',
      'Total Revenue': 'Total Revenue',
      // 'Fees And Service Expenses': 'Fees And Service Expenses',
      'Administrative Expenses': 'Administrative Expenses',
      'Expected Credit Losses' : '(Reversal Of) Expected Credit Losses',
      'Total Cost': 'Total Cost And Expenses',
      'EBIT': 'Profit (Loss) Before Finance Costs And Income Tax Expense',
      'Finance Costs':'Finance Costs',
      'Income Tax': 'Income Tax Expense',
      'Net Profit (Loss)': 'Net Profit (Loss) For The Period',
      'EPS': 'Basic Earnings (Loss) Per Share (Baht/Share)'
    };
  }

  else{
    financialItemMapping = {
      'Revenue From Operations': 'Revenue From Operations',
      'Other Income': 'Other Income',
      'Total Revenue': 'Total Revenue',
      'Cost Of Sales': 'Costs',
      'Selling Expenses': 'Selling Expenses',
      'Administrative Expenses': 'Administrative Expenses',
      'Total Cost': 'Total Cost And Expenses',
      'EBIT': 'Profit (Loss) Before Finance Costs And Income Tax Expense',
      'Finance Costs':'Finance Costs',
      'Income Tax': 'Income Tax Expense',
      'Net Profit (Loss)': 'Net Profit (Loss) For The Period',
      'EPS': 'Basic Earnings (Loss) Per Share (Baht/Share)'
    };
  }


  const plQoQData = Object.entries(financialItemMapping).map(([displayName, dataKey]) =>
      CreateFinancialItem(displayName, dataKey, data, lastYears)
  );

  // console.log(plQoQData);


  const table = new Tabulator(tableName, {
    height:"100%",
    data: plQoQData, // Use the provided data
    layout:"fitData",
    movableColumns:false,
    columns: [
      // { title: "ลำดับ", field: "id"},
      // { title: "id", field: "id", width: 10, headerSort:false,},
      { title: "Items", field: "item", width: 190, hozAlign: "left", formatter: "plaintext", headerSort:false,},
      { title: lastYears[2], field: "2", width: 120, headerHozAlign:"right", hozAlign: "right", headerSort:false, formatter:"money", formatterParams: currency },
      { title: lastYears[1], field: "1", width: 120, headerHozAlign:"right", hozAlign: "right", headerSort:false, formatter:"money", formatterParams: currency },
      { title: lastYears[0], field: "0", width: 120, headerHozAlign:"right", hozAlign: "right", headerSort:false, formatter:"money", formatterParams: currency },
    ],


    // สร้างเงื่อนไข ถ้าข้อมูลตรงกับที่ต้องการ ปรับ style ในแถวนั้น
    rowFormatter:function(row){
      var data = row.getData();
      if(data.item == "Total Revenue" ||
      data.item == "Total Cost" ||
      data.item == "Net Interest Income" ||
      data.item == "Net Profit (Loss)"||
      data.item == "Net Fees & Service Income"||
      data.item == "EBIT"||
      data.item == "Net Profit (Loss) For The Period / Profit (Loss) For The Period From Continuing Operations" ||
      data.item == "EPS"||
      data.item == "xxx"
      ){
          row.getElement().style.borderBottom = "thin double #888";
          row.getElement().style.font = "bold 15px Kanit";
          // row.getElement().style.color = "#DC7633";
          row.getElement().style.textAlignLast = "right";

      }
  },


  });

  return table;
};

const createTableMain = (tableName: string, data: any): Tabulator => {

  // สร้าง Array ไว้เก็บจำนวนปีเริ่มจาก Year Q ปัจจุบัน ย้อนหลังไปจำนวน x ปี
  const lastQuarterList = financialService.GetLastQuarterList(data.period, 20)
  // console.log('lastQuarterList : ', lastQuarterList)

  const tableColumns = CreateMainTableColumns(lastQuarterList);
  // console.log('Testing createTableColumns ',tableColumns);

  const plTemplate = GetPlTemplate(data);

  let tableData:any = [];

  // ใส่ข้อมูลจาก plTemplate ที่ดึงมาจาก stock ลงใน  tableData โดยเรียงลำดับ จะได้ข้อมูล {id: 1 , item: "revenue#ITEM"}
  Object.entries(plTemplate).forEach(([key, value]: [string, unknown]) => {
    if (typeof key === 'string' && typeof value === 'string' && value.endsWith('#ITEM')) {
      // Add a new row to tableData for each ITEM in plTemplate
      tableData.push({ id: parseInt(key), item: value });
    }
  });

  // Replace #ITEM and #HEADER with ""
  tableData = AddPlTableRow(tableData)


  // console.log('Template : ',plTemplate)
  // console.log('Template Edited Replace : ', tableData)

  const updateValueTableData = UpdateValueMainTableData(data,tableData)

  // console.log('updateValueTableData : ', updateValueTableData)




  //Create table with tableData
  const table = new Tabulator(tableName, {
    height:"100%",
    data: updateValueTableData, // <<==== ใส่ชุดข้อมูลตรงนี้
    layout:"fitData",
    movableColumns:false,


    columns: tableColumns,

  //  สร้างเงื่อนไข ถ้าข้อมูลตรงกับที่ต้องการ ปรับ style ในแถวนั้น
    rowFormatter:function(row){
      var rowData = row.getData();
      if(rowData.item == "Total Revenue" ||
      rowData.item == "Net Interest Income"||
      rowData.item == "Net Fees And Service Income"||
      rowData.item == "Total Cost And Expenses" ||
      rowData.item == "Profit (Loss) Before Finance Costs And Income Tax Expense" ||
      rowData.item == "Total Comprehensive Income (Expense) Attributable To : Non-Controlling Interests"||
      rowData.item == "Net Profit (Loss) For The Period / Profit (Loss) For The Period From Continuing Operations"||
      rowData.item == "Profit (Loss) From Operating Before Income Tax Expense"||
      rowData.item == "Net Profit (Loss)"||
      rowData.item == "Net Profit (Loss) For The Period"||
      rowData.item == "Other Comprehensive Income (Expense) - Net Of Tax"||
      rowData.item == "Total Comprehensive Income (Expense) For The Period"||
      rowData.item == "Basic Earnings (Loss) Per Share (Baht/Share)"
      ){
          row.getElement().style.borderBottom = "thin double #888";
          row.getElement().style.font = "bold 15px Kanit";
          // row.getElement().style.color = "#DC7633";
          row.getElement().style.textAlignLast = "right";

      }
  },


  });

  return table;
};



export { createTableQoQ, createTableMain,};
  // function CreateYoYArray(period: any, arg1: number) {
  //   throw new Error('Function not implemented.');
  // }

