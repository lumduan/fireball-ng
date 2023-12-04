import { Component,OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {FormsModule,} from '@angular/forms';
import { Chart, registerables } from 'chart.js/auto';
import { bar_chart_2 } from './bar_chart_2/bar_chart_2';
Chart.register(...registerables);



@Component({
  selector: 'app-find-stock',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule],
  templateUrl: './find-stock.component.html',
  styleUrl: './find-stock.component.css',

})


export class FindStockComponent   {

  httpClient = inject(HttpClient)
  data: any = [] // เก็บข้อมูลที่ดึงมาจาก fastapi
  symbol = 'CPALL'

  quartersList: string[] = generateQuartersList(); // quartersList เก็บ array ที่จะแสดงผลใน form-control

  thisYear: number = new Date().getFullYear(); // รับค่าจากการเลือก Quarter โดยต่าเริ่มต้นเป็น 5 ปีที่แล้ว Q1
  selected_start_quarter: string = `${this.thisYear - 5} Q1`;
  selected_end_quarter: string = `${this.thisYear} Q1`;

  labels: any = []
  values: any = []

  // เก็บชื่อ yq ที่ดึงมาจาก db ทั้งหมด '2022 Q1'
  yq_labels: any = []
  yq_values: any = []

  // เก็บค่า yq ที่ดึงมาจาก db ทั้งหมด '100,000,000.00'
  chart_labels: any = []
  char_values: any = []

  chart: any
  combo_chart: any



  labeldata: any[] = []






  async total_revenue() {
    const data = await this.httpClient.get(`http://192.168.1.13:8000/total_revenue/${this.symbol}`).toPromise();
    // console.log(data); //สำหรับเช็คการดึงข้อมูล
    this.data = data;
  }

  async show_chart(){

  await this.total_revenue()


  if (this.data && this.data.financial_statements) {
    this.yq_labels = Object.keys(this.data.financial_statements);

    // จัดเรียงการแสดงผล Year Quarter
    this.arrange_yq()

  }

    this.gen_chart()
  }

  // ลบ Chart ที่เคยสร้าง
  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  gen_chart(){

    this.destroyChart()

    this.chart = new Chart('barChart-1',{
      type: 'bar',
      data: {
        labels: this.chart_labels,
        datasets: [{
          label: 'Total Revenue MB.',
          data: this.char_values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }

    })
  }


  gen_combo_chart(){
      this.combo_chart = new Chart('combo-1', {
        type: 'bar',
        data: {
          labels : bar_chart_2.yq,
          datasets : [
            {
            label: 'ProductA',
            data: bar_chart_2.sales_a_data,
            // order: 1
            stack: 'Stack 0'
            },
            {
              label: 'ProductB',
              data: bar_chart_2.sales_b_data,
              // order: 0
              stack: 'Stack 0'
              },
            {
              label: 'ProductC',
              data: bar_chart_2.sales_c_data,
              // order: 0
              stack: 'Stack 0'
            },
            {
              label: 'NetProfit',
              data: bar_chart_2.np,
              // order: 0
              stack: 'Stack 1'
            },

            {
              label: 'GPM',
              data: bar_chart_2.gpm,
              type: 'line',
              borderDash: [3, 1],
              yAxisID: 'quantity',
              // order: 1
            },

            {
              label: 'NPM',
              data: bar_chart_2.npm,
              type: 'line',
              borderDash: [3, 1],
              yAxisID: 'quantity',
              // order: 1
            },

            {
              label: 'PE',
              data: bar_chart_2.pe,
              type: 'line',
              borderDash: [3, 1],
              yAxisID: 'quantity',
              // order: 1
            },

          ]
        },
        options:{
          responsive: true,

          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Test Chart Combo Bar and Line'
            }
          },

          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            },
            quantity:{
              beginAtZero : true,
              // type : 'linear',
              position : 'right'

            },
          }

        },


      });
  }


  //จัดเรียงการแสดงผล Year Quarter
  async arrange_yq(){

    // กำหนดค่าการแสดงข้อมูลให้เริ่มจาก Start : Year Quarter ถึง End : Year Quarter
    this.chart_labels = this.yq_labels.filter((label: string) => label >= this.selected_start_quarter && label <= this.selected_end_quarter);

    // Use the filtered labels to create the filtered values array
    this.char_values = this.chart_labels.map((key: string | number) => this.data.financial_statements[key]?.value);

    // เรียง Year Qtarter ในแสดงใน Label จากเก่ามาใหม่
    this.chart_labels.sort((a: string, b: any) => {

      // an customize the comparison logic based on your requirements
      // For example, if the keys are numeric, you can use a - b
    return a.localeCompare(b); // This sorts alphabetically, adjust as needed
  });



  }

  // Function :: สร้าง ตารางใหม่เมื่อเปลี่ยนค่า Quarter ที่เลือก
  async onLabelChange() {
    // console.log('Selected label:', this.selected_start_quarter)

    this.arrange_yq()
    this.gen_chart()
    // Add your custom logic here
  }

} // end of export


  // Function :: สร้าง Array สำหรับ Year และ Quarter เริ่มจาก '2003 Q1'
function generateQuartersList(): string[] {
    const currentYear = new Date().getFullYear();
    const quartersList: string[] = [];

    for (let year = 2003; year <= currentYear; year++) {
        for (let quarter = 1; quarter <= 4; quarter++) {
            quartersList.push(`${year} Q${quarter}`);
        }
    }

  return quartersList;
}
