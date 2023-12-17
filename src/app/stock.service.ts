import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject, throwError,BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class StockService {

  private api_url: string = '/api'
  private defaultSymbol:string = 'CPALL'

  private _symbolSubject = new BehaviorSubject<string>(this.defaultSymbol);
  symbol$ = this._symbolSubject.asObservable();

  set symbol(value: string) {
    this._symbolSubject.next(value.toUpperCase());
  }


  constructor(private http: HttpClient) {}

  // get financial statement from fast api
  GetFs(symbol: string, fs: string): Observable<any> {
    const url = `${this.api_url}/${fs}/${symbol}`; // Ensure correct path construction
    return this.http.get(url).pipe(
      catchError((error: any) => {
        console.error('Error fetching data:', error);
        return throwError(error); // Re-throw the error so the caller can handle it
      })
    );
  }



  ConvertPeriodToYQ(input: string): string {
    // Split the input string into parts using '/'
    const parts = input.split('/');

    if (parts.length === 2) {
      const quarter = parts[0].trim();
      const year = parts[1].trim();

      // Check if the quarter is valid (e.g., 'Q1', 'Q2', 'Q3', 'Q4')
      if (/^Q[1-4]$/i.test(quarter)) {
        // Format the result as 'YYYY QX'
        return `${year} ${quarter.toUpperCase()}`;
      }
    }

    // Return the original input if the format is not as expected
    return input;
  }

  SubtractOneYear(input: string): string {
    // Split the input string into parts using space
    const parts = input.split(' ');

    if (parts.length === 2) {
      const year = parseInt(parts[0].trim());
      const quarter = parts[1].trim();

      if (!isNaN(year)) {
        // Subtract one year
        const newYear = year - 1;

        // Format the result as 'YYYY QX'
        return `${newYear} ${quarter}`;
      }
    }

    // Return the original input if the format is not as expected
    return input;
  }

  // FN : สร้าง Array โดยรับค่า Year Q ล่าสุดแล้ว ย้อนหลัง จำนวน i ปี เพื่อสร้างเป็น Array ที่ต้องการ
  GenYoYArray(startYear: string, numberOfYears: number): string[] {
    const result: string[] = [];

    const [year, quarter] = startYear.split(' ');

    for (let i = 0; i < numberOfYears; i++) {
      const currentYear = parseInt(year) - i;
      result.push(`${currentYear} ${quarter}`);
    }

    return result.reverse();
  }

  // FN : รวมข้อมูล YQ และ Data เข้าไว้ด้วยกัน เอาไว้ใช้ แสดงผลใน กราฟ ที่มี dataset
  CombineYQData(fsValue: Record<string, number[]>, yearsQuarters: Record<string, string[]>): Record<string, any>[] {
    const quarters = Object.keys(fsValue);

    const data: Record<string, any>[] = quarters.map((quarter) => {
      const capitalizedQuarter = quarter.toUpperCase(); // Capitalize the quarter
      const item: Record<string, any> = { x: capitalizedQuarter };
      yearsQuarters[quarter].forEach((yearQuarter, index) => {
        const year = Number(yearQuarter.split(" ")[0]); // Extract the year from the string
        item[year] = fsValue[quarter][index];
      });
      return item;
    });

    return data;
  }




}
