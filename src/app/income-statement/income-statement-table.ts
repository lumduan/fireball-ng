import { controllers } from 'chart.js';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import { StockService } from '../stock.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

const plData = [
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

// FN : ดู Template จากข้อมูล stock
const GetPlTemplate = (stock: any): any => stock.fs_templates.pl.income;


// FN : เปลี่ยน #HEADER กับ ITEM ให้เป็น ข้อความที่จะเปลี่ยนต้องอยู่ใน {item: }
//
function ReplaceItemAndHeaderInData(data: any[]): any[] {
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
      headerSort: false
    });
  }

  return columns;
}



const createTableQoQ = (tableName: string, data: any[]): Tabulator => {

  const table = new Tabulator(tableName, {
    height:"100%",
    data: plData, // Use the provided data
    layout:"fitData",
    movableColumns:false,
    columns: [
      // { title: "ลำดับ", field: "id"},
      // { title: "id", field: "id", width: 10, headerSort:false,},
      { title: "Items", field: "item", width: 190, hozAlign: "left", formatter: "plaintext", headerSort:false,},
      { title: "2023 Q3", field: "periodA", width: 120, headerHozAlign:"right", hozAlign: "right", formatter: "plaintext", headerSort:false,},
      { title: "2022 Q3", field: "periodB", width: 120, headerHozAlign:"right", hozAlign: "right", formatter: "plaintext", headerSort:false,},
      { title: "2021 Q3", field: "periodB", width: 120, headerHozAlign:"right", hozAlign: "right", formatter: "plaintext", headerSort:false,},
    ],

    // สร้างเงื่อนไข ถ้าข้อมูลตรงกับที่ต้องการ ปรับ style ในแถวนั้น
    rowFormatter:function(row){
      var data = row.getData();
      if(data.item == "Total Revenue" ||
      data.item == "Total Cost" ||
      data.item == "Net Profit (Loss)"||
      data.item == "EPS"
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

const createTableMain = (tableName: string, data: any[]): Tabulator => {
  // console.log('lastQuarterList : ' ,data) //ทดสอบ
  const lastQuarterList = GetLastQuarterList('2023 Q3', 5)
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
  tableData = ReplaceItemAndHeaderInData(tableData)


  // console.log('Template : ',plTemplate)
  console.log('Template Edited Replace : ', tableData)

  //Create table with tableData
  const table = new Tabulator(tableName, {
    height:"100%",
    data: tableData, // <<==== ใส่ชุดข้อมูลตรงนี้
    layout:"fitData",
    movableColumns:false,


    columns: tableColumns,

  //  สร้างเงื่อนไข ถ้าข้อมูลตรงกับที่ต้องการ ปรับ style ในแถวนั้น
    rowFormatter:function(row){
      var data = row.getData();
      if(data.item == "Total Revenue" ||
      data.item == "Total Cost And Expenses" ||
      data.item == "Net Profit (Loss)"||
      data.item == "FYI"
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
