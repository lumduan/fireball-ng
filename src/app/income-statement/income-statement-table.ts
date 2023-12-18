import {TabulatorFull as Tabulator} from 'tabulator-tables';


const createTableQoQ = (tableName: string, data: any[]): Tabulator => {
  const table = new Tabulator(tableName, {
    height:"40%",
    data: data, // Use the provided data
    layout:"fitData",
    movableColumns:false,
    columns: [
      // { title: "ลำดับ", field: "id"},
      // { title: "id", field: "id", width: 10, headerSort:false,},
      { title: "Items", field: "item", width: 500, hozAlign: "left", formatter: "plaintext", headerSort:false,},
    ],
  });

  return table;
};



export { createTableQoQ };
