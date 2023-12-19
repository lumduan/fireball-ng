import { controllers } from 'chart.js';
import {TabulatorFull as Tabulator} from 'tabulator-tables';

let incomeTemplate:any = [];

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
function replaceItemAndHeaderInData(data: any[]): any[] {
  function replaceItemAndHeader(item: string): string {
      return item.replace("#ITEM", "").replace("#HEADER", "");
  }

  return data.map(obj => ({
      id: obj.id,
      item: replaceItemAndHeader(obj.item)
  }));
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
      { title: "2023 Q3", field: "periodA", width: 120, hozAlign: "right", formatter: "plaintext", headerSort:false,},
      { title: "2022 Q3", field: "periodB", width: 120, hozAlign: "right", formatter: "plaintext", headerSort:false,},
      { title: "2021 Q3", field: "periodB", width: 120, hozAlign: "right", formatter: "plaintext", headerSort:false,},
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
  // console.log('Item data : ' ,data) //ทดสอบ
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
  tableData = replaceItemAndHeaderInData(tableData)


  // console.log('Template : ',plTemplate)
  console.log('Template Edited Replace : ', tableData)

  //Create table with tableData
  const table = new Tabulator(tableName, {
    height:"100%",
    data: tableData, // <<==== ใส่ชุดข้อมูลตรงนี้
    layout:"fitData",
    movableColumns:false,

    columns: [
      // { title: "ลำดับ", field: "id"},
      // { title: "id", field: "id", width: 10, headerSort:false,},
      { title: "Items", field: "item", hozAlign: "left", formatter: "plaintext", headerSort:false,},
    ],

  //  สร้างเงื่อนไข ถ้าข้อมูลตรงกับที่ต้องการ ปรับ style ในแถวนั้น
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



export { createTableQoQ, createTableMain,};
