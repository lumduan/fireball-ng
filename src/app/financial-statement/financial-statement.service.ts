import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  constructor() {
    // Initialization code here
  }

  GetCurrentYear(stock: any): string {
    return stock.period.split(' ')[0];
  }

  ConvertPeriodToYQ(input: string): string {
    const parts = input.split('/');

    if (parts.length === 2) {
      const quarter = parts[0].trim();
      const year = parts[1].trim();

      if (/^Q[1-4]$/i.test(quarter)) {
        return `${year} ${quarter.toUpperCase()}`;
      }
    }
    return input;
  }

  CreateYoYArray(startYear: string, numberOfYears: number): string[] {
    const result: string[] = [];

    const [year, quarter] = startYear.split(' ');

    for (let i = 0; i < numberOfYears; i++) {
      const currentYear = parseInt(year) - i;
      result.push(`${currentYear} ${quarter}`);
    }

    return result.reverse();
  }

  CombineYQData(
    fsValue: Record<string, number[]>,
    yearsQuarters: Record<string, string[]>
  ): Record<string, any>[] {
    const quarters = Object.keys(fsValue);

    const data: Record<string, any>[] = quarters.map((quarter) => {
      const capitalizedQuarter = quarter.toUpperCase(); // Capitalize the quarter
      const item: Record<string, any> = { x: capitalizedQuarter };
      yearsQuarters[quarter].forEach((yearQuarter, index) => {
        const year = Number(yearQuarter.split(' ')[0]); // Extract the year from the string
        item[year] = fsValue[quarter][index];
      });
      return item;
    });

    return data;
  }

  GetLastQuarterList(startYear: string, numberOfQuarter: number): string[] {
    const result: string[] = [];

    const [yearStr, quarterStr] = startYear.split(' ');

    if (yearStr && quarterStr) {
      let year = parseInt(yearStr);
      let quarter = parseInt(quarterStr.slice(1));

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
