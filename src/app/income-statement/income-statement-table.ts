import {TabulatorFull as Tabulator} from 'tabulator-tables';


const createTable = (tableName: string, data: any[]): Tabulator => {
  const table = new Tabulator(tableName, {
    height: 205,
    data: data, // Use the provided data
    layout: "fitColumns",
    movableColumns:false,
    columns: [
      { title: "รายการ", field: "name", width: 150, headerSort:false,},
      { title: "Age", field: "age", hozAlign: "left", formatter: "progress", headerSort:false,},
      { title: "Favourite Colordmsndmsnmsd", field: "col", headerSort:false, },
      { title: "Date Of Birthkjkjkksl", field: "dob", sorter: "date", hozAlign: "center", headerSort:false, },
    ],
  });

  return table;
};



export { createTable };
