import {TabulatorFull as Tabulator} from 'tabulator-tables';

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
  const table = new Tabulator(tableName, {
    height:"100%",
    data: data, // Use the provided data
    layout:"fitData",
    movableColumns:false,
    columns: [
      // { title: "ลำดับ", field: "id"},
      { title: "id", field: "id", width: 10, headerSort:false,},
      { title: "Items", field: "item", width: 190, hozAlign: "left", formatter: "plaintext", headerSort:false,},
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



export { createTableQoQ, createTableMain };
