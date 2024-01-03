import { Injectable, inject } from '@angular/core';
import { Observable, Subject, throwError,BehaviorSubject } from 'rxjs'
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class FinancialService {
  constructor() {
    // Initialization code here
  }

  //FN :  รับข้อมูล 'Q3/2023' แล้ว Return กลับเป็น '2023 Q3'
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

  // FN : คำนวณ Last Year Q : ex. '2023 Q3' => '2022 Q3'
  // SubtractOneYear(input: string): string {
  //   // Split the input string into parts using space
  //   const parts = input.split(' ');

  //   if (parts.length === 2) {
  //     const year = parseInt(parts[0].trim());
  //     const quarter = parts[1].trim();

  //     if (!isNaN(year)) {
  //       // Subtract one year
  //       const newYear = year - 1;

  //       // Format the result as 'YYYY QX'
  //       return `${newYear} ${quarter}`;
  //     }
  //   }

  //   // Return the original input if the format is not as expected
  //   return input;
  // }

  /*
   * Function: CreateYoYArray
   * Purpose:
   *   Generates an array of years and quarters in a year-over-year (YoY) format.
   *   This is useful for creating time series data for specific quarters across multiple years.
   *
   * How it works:
   *   - Takes a starting year and quarter (e.g., '2023 Q3') and a number of years.
   *   - Iteratively decrements the year while keeping the quarter constant.
   *   - Constructs an array of these year-quarter combinations.
   *
   * Parameters:
   *   - startYear: string - The starting year and quarter in the format 'YYYY QX'
   *                         where YYYY is the year and QX is the quarter (e.g., 'Q3').
   *
   *   - numberOfYears: number - The number of years to include in the array,
   *                              counting backwards from the start year.
   *
   * Returns:
   *   - string[] - An array of year-quarter strings in reverse chronological order.
   *                For example, if the start year is '2023 Q3' and the number of years is 3,
   *                it returns ['2023 Q3', '2022 Q3', '2021 Q3'].
   *
   * Sample Usage and Output:
   *   let startYear = '2023 Q3';
   *   let numberOfYears = 3;
   *   let yoyArray = CreateYoYArray(startYear, numberOfYears);
   *   console.log(yoyArray); // Outputs: ['2023 Q3', '2022 Q3', '2021 Q3']
   *
   */
  CreateYoYArray(startYear: string, numberOfYears: number): string[] {
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
  GetLastQuarterList(startYear: string, numberOfQuarter: number): string[] {
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

}

