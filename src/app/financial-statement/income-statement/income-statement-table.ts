import { controllers } from 'chart.js';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { StockService } from '../../stock.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// FN : ดู Template จากข้อมูล stock
const GetPlTemplate = (stock: any): any => stock.fs_templates.pl.income;


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

//

/**
 * Generate a list of quarters in reverse chronological order, starting from a given year and quarter.
 *
 * @param {string} startYear - The starting year and quarter in the format "YYYY QX", e.g., "2023 Q3".
 * @param {number} numberOfQuarter - The number of quarters to generate.
 * @returns {string[]} An array of strings representing quarters in reverse chronological order.
 *
 * Usage example:
 * const resultArray = GetLastQuarterList('2023 Q3', 5);
 * console.log(resultArray);
 * Output: ['2023 Q3', '2023 Q2', '2023 Q1', '2022 Q4', '2022 Q3']
 */
function GetLastQuarterList(startYear: string, numberOfQuarter: number): string[] {
  const result: string[] = [];

  const [yearStr, quarterStr] = startYear.split(' ');

  if (yearStr && quarterStr) {
    let year = parseInt(yearStr);
    let quarter = parseInt(quarterStr.slice(1)); // Remove the 'Q' and parse the quarter part

    for (let i = 0; i < numberOfQuarter; i++) {
      result.push(`${year} Q${quarter}`);

      if (quarter === 1) {
        quarter = 4;
        year -= 1;
      } else {
        quarter -= 1;
      }
    }
  }

  return result;
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


function CreateTableColumns(quarters: string[]) {
  const columns:any = [
    { title: "Items",
    field: "item",
    width: 300,
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
      formatter:"money", formatterParams:{
        decimal:".",
        thousand:",",
        symbol:"",
        symbolAfter:"p",
        negativeSign:true,
        precision:false,
    }
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
 *   // Sample input dataPL object
 *   const dataPL = {
 *     pl: {
 *       "Revenue From Operations": {
 *         "2021 Q1": { value: 100000 },
 *         "2021 Q2": { value: 110000 }
 *         // ... more quarters
 *       },
 *       // ... more items
 *     }
 *   };
 *
 *   // Sample input tableData array
 *   const tableData = [
 *     { id: 1, item: "Revenue From Operations" }
 *     // ... more items
 *   ];
 *
 *   // Calling the function
 *   const updatedTableData = UpdateValueTableData(dataPL, tableData);
 *
 *   // Expected output
 *   // [
 *   //   {
 *   //     id: 1,
 *   //     item: "Revenue From Operations",
 *   //     "2021 Q1": 100000,
 *   //     "2021 Q2": 110000
 *   //     // ... more quarters
 *   //   },
 *   //   // ... more items with their respective updated financial data
 *   // ]
 */
function UpdateValueTableData(dataPL: any, tableData: any): any {
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

  const plQoQData = [
    { item: 'Revenue From Operations',},
    { item: 'Interest And Dividend',},
    { item: 'Other Revenue',},
    { item: 'Total Revenue',},
    { item: 'Cost Of Sales',},
    { item: 'Selling Expenses',},
    { item: 'Administrative Expenses',},
    { item: 'Total Cost',},
    { item: 'EBIT',},
    { item: 'Income Tax',},
    { item: 'Net Profit (Loss)',},
    { item: 'EPS',},
  ];

  const table = new Tabulator(tableName, {
    height:"100%",
    data: plQoQData, // Use the provided data
    layout:"fitData",
    movableColumns:false,
    columns: [
      // { title: "ลำดับ", field: "id"},
      // { title: "id", field: "id", width: 10, headerSort:false,},
      { title: "Items", field: "item", width: 190, hozAlign: "left", formatter: "plaintext", headerSort:false,},
      { title: data.period, field: "periodA", width: 120, headerHozAlign:"right", hozAlign: "right", formatter: "plaintext", headerSort:false,},
      { title: data.period, field: "periodB", width: 120, headerHozAlign:"right", hozAlign: "right", formatter: "plaintext", headerSort:false,},
      { title: "2021 Q3", field: "periodB", width: 120, headerHozAlign:"right", hozAlign: "right", formatter: "plaintext", headerSort:false,},
    ],

    // สร้างเงื่อนไข ถ้าข้อมูลตรงกับที่ต้องการ ปรับ style ในแถวนั้น
    rowFormatter:function(row){
      var data = row.getData();
      if(data.item == "Total Revenue" ||
      data.item == "Total Cost" ||
      data.item == "Net Profit (Loss)"||
      data.item == "Net Profit (Loss) For The Period / Profit (Loss) For The Period From Continuing Operations" ||
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
  const lastQuarterList = GetLastQuarterList(data.period, 20)
  // console.log('lastQuarterList : ', lastQuarterList)

  const tableColumns = CreateTableColumns(lastQuarterList);
  console.log('Testing createTableColumns ',tableColumns);

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
  console.log('Template Edited Replace : ', tableData)

  const updateValueTableData = UpdateValueTableData(data,tableData)

  console.log('updateValueTableData : ', updateValueTableData)




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
      rowData.item == "Total Cost And Expenses" ||
      rowData.item == "Net Profit (Loss)"||
      rowData.item == "Net Interest Income"||
      rowData.item == "Basic Earnings (Loss) Per Share (Baht/Share)"||
      rowData.item == "Total Comprehensive Income (Expense) Attributable To : Non-Controlling Interests"||
      rowData.item == "Net Profit (Loss) For The Period / Profit (Loss) For The Period From Continuing Operations"
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
