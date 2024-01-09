# NgFireball (CheckHoon)


## Checkhoon Web App Development Plan
```mermaid
gantt

dateFormat YYYY-MM-DD

section Initial
  Project Initialization :done, 2024-01-01, 5d
  Environment Setup     :active, after des1, 5d

section Frontend
  Basic Layout Design   : 2024-01-05, 10d
  Page-FinancialStatement Dev : 2024-01-05, 10d
  Optimize Chart of FinancialStatement : 2024-01-07, 3d
  Optimize Table of FinancialStatement : 2024-01-07, 5d
  
  Feature Development   : 2024-01-05, 60d
  UI/UX Enhancements    : 2024-01-05, 60d
  Angular Material UI : 2024-01-06,7d
  
  SideBar: 2024-01-08, 5d

section Backend
  Database Design       : 2024-01-05, 7d
    MondoDB : 2024-01-03, 3d
    MariaDB(SQL) : 2024-01-05, 3d
  API Development       : 2024-01-05, 60d
  Integration Testing   : 2024-01-12, 60d

section Testing
  Private Testing : 2024-01-30, 90d
  Unit Testing          : 2024-03-20, 10d
  Functional Testing    : 2024-03-20, 15d
  Bug Fixes             :2024-03-25, 20d

section Deployment
  Staging Deployment    : 2024-04-15, 5d
  Production Launch     : 2024-04-20, 5d

```

## Update Lists

* 2024-01-08
  * Update: income-statement-table.ts
    * Prepare data for tables created from Angular Material 

* 2024-01-08
  * Update: Function chart in income-statement-chart.ts
    * Makes it possible to create charges according to the desired item.
    * Can choose the display color of the graph bars.

  * Update: Function table in income-statement-table.ts

* 2024-01-07
  * Update: Function in financial-statement.service (GetCurrentYear)
  * Create: Function in income-statement-chart.ts
    * Increase create chart more efficiently.

* 2024-01-05
  * Create: Docker Container MariaDB => For SQL to store a list of stocks and stocks that recently IPO.


* 2024-01-04
  * Remove: Diff & Increase font size of % change


--- 
<br><br>

# Documentation of Functions

## Function Definition in `financial-statement.service.ts`

### `GetLastQuarterList`

#### Purpose
The purpose of the `GetLastQuarterList` function is to generate a sequence of quarters (3-month periods) in reverse chronological order, starting from a specified year and quarter. This can be particularly useful for financial reporting, data analysis, and any application where tracking periods across multiple years is required.

#### How It Works
The function begins with a start year and quarter, then counts backward through the quarters. If the starting quarter is Q1, it moves to the previous year's Q4 and continues the countdown. This process repeats until the desired number of quarters is generated.

#### Parameters
- `startYear`: string - The starting year and quarter in the format "YYYY QX", for example, "2023 Q3".
- `numberOfQuarter`: number - The number of quarters to generate.

#### Returns
- `string[]`: An array of strings representing quarters in reverse chronological order.

#### Usage Example
```typescript
const resultArray = GetLastQuarterList('2023 Q3', 5);
console.log(resultArray);
// Output: ['2023 Q3', '2023 Q2', '2023 Q1', '2022 Q4', '2022 Q3']
```
#### Flowchart
```mermaid
graph TB
    Start["Start"] --> Input1["Input startYear and numberOfQuarter"]
    Input1 --> CheckInput["Check if yearStr and quarterStr are valid"]
    CheckInput -- "Valid" --> Loop["For each quarter"]
    CheckInput -- "Invalid" --> EndInvalid["Return empty result"]
    Loop --> AddQuarter["Add 'year Qquarter' to result"]
    AddQuarter --> Decrement["Decrement quarter"]
    Decrement -- "quarter > 1" --> Loop
    Decrement -- "quarter == 1" --> ChangeYear["Set quarter to 4, decrement year"]
    ChangeYear --> Loop
    Loop -- "Loop numberOfQuarter times" --> EndValid["Return result"]
    EndInvalid --> End["End"]
    EndValid --> End
``````


### `CreateFinancialItem`

#### Purpose
Creates an object representing a financial item with its values for the past three years.

#### How It Works
- Takes a display name, a corresponding key in the data object, the data object itself, and an array of years.
- Utilizes a helper function to fetch and format financial values from the data object based on the provided key and year indices safely.
- Returns an object with the display name and formatted financial values for each of the last three years.

#### Parameters
- `displayName`: The name to be displayed for the financial item.
- `dataKey`: The key corresponding to the item in the data object.
- `data`: The data object containing financial information in a nested structure.
- `lastYears`: An array containing indices for the last three years.

#### Returns
An object containing the display name of the financial item and its formatted values for the past three years.

#### Sample Usage and Output
```typescript
// Assuming data is an object with financial data and lastYears is [2021, 2022, 2023]
const item = CreateFinancialItem('Revenue', 'Revenue From Operations', data, lastYears);
// Output: { item: 'Revenue', 2: '100.00', 1: '200.00', 0: '300.00' }
``````

#### Flowchart
Below is a simple flow chart for the `CreateFinancialItem` function:

```mermaid
graph TD
    A["Start"] -->|"CreateFinancialItem called"| B["Initialize Parameters"]
    B --> C["Loop through lastYears"]
    C --> D["Call getValue for each year"]
    D --> E{"Check if data exists for year"}
    E -->|"Yes"| F["Format and return value"]
    E -->|"No"| G["Return '0'"]
    F --> H["Create result object"]
    G --> H
    H --> I["Return result object"]
    I --> J["End"]
```

### `GetCurrentYear`

#### Purpose
Extracts and returns the current year from the stock's financial period information. This function is designed to isolate the year component from the financial period data in the stock object.

#### How It Works
- The function accesses the `period` property of the stock object.
- It then splits this `period` string by space (' ') and retrieves the first part, which represents the current year.

#### Parameters
- `stock`: any - The stock object containing the financial period data in the format "YYYY QX".

#### Returns
- `string`: The current year extracted from the stock's financial period.

#### Sample Usage and Output
```typescript
const stock = { period: '2023 Q3' };
const currentYear = GetCurrentYear(stock);
// Output: '2023' (representing the current year extracted from the financial period)
```

### `CombineYQData`

#### Purpose
Combines financial data with its corresponding years and quarters into a structured format suitable for charting or data analysis. This function maps quarterly financial values to their respective years and quarters.

#### How It Works
- Iterates over the keys (quarters) of the `fsValue` object, which holds financial data for different quarters.
- For each quarter, it creates a data object with the quarter as a key and financial values as values, aligning them with their respective years obtained from `yearsQuarters`.
- Capitalizes the quarter string for consistent formatting.
- Extracts the year from each year-quarter combination in `yearsQuarters` and assigns the corresponding financial value from `fsValue` to this year in the data object.
- Returns an array of these data objects, each representing a quarter with its financial data mapped to the respective years.

#### Parameters
- `fsValue`: Record<string, number[]> - An object containing arrays of financial values, keyed by quarters.
- `yearsQuarters`: Record<string, string[]> - An object containing arrays of year-quarter strings, keyed by quarters.

#### Returns
- `Record<string, any>[]`: An array of objects where each object contains a quarter with financial values mapped to their corresponding years.

#### Sample Usage and Output
```typescript
const totalRevenue = {
  "q1": [138895.71, 145799.98, 133371.87, 199731.15, 222019.79],
  "q2": [143180.92, 128027.32, 137391.45, 213655.47, 232001.81],
  // ... other quarters ...
};

const yearsQuarters = {
  "q1": ["2019 Q1", "2020 Q1", "2021 Q1", "2022 Q1", "2023 Q1"],
  "q2": ["2019 Q2", "2020 Q2", "2021 Q2", "2022 Q2", "2023 Q2"],
  // ... other quarters ...
};

const chartTotalRevenueData = CombineYQData(totalRevenue, yearsQuarters);
/* Output: An array of objects with each object representing a quarter and its financial values mapped to corresponding years.
chartTotalRevenueData = 
[
    {
        "2019": 138895.71,
        "2020": 145799.98,
        "2021": 133371.87,
        "2022": 199731.15,
        "2023": 222019.79,
        "x": "Q1"
    },
    {
        "2019": 143180.92,
        "2020": 128027.31999999998,
        "2021": 137391.45,
        "2022": 213655.47,
        "2023": 232001.80999999997,
        "x": "Q2"
    },
    .....
*/
``````
#### Flowchart
```mermaid
graph TD
    A["Start"] -->|"CombineYQData called"| B["Initialize quarters from fsValue"]
    B --> C["Iterate over quarters"]
    C --> D["Capitalize quarter"]
    D --> E["Create data object for quarter"]
    E --> F["Iterate over yearsQuarters"]
    F --> G{"Extract year from yearQuarter"}
    G --> H["Assign financial value to year in data object"]
    H --> I["Add data object to result array"]
    I -->|"Repeat for each quarter"| C
    C --> J["Return array of data objects"]
    J --> K["End"]
``````

## Function Definition in `income-statement-table.ts`

### `CreateMainTableColumns`

#### Purpose
This function creates table columns for a Tabulator table based on an array of quarters. It formats each column to display financial data with appropriate alignment and formatting, suitable for financial reports or dashboards.

#### How It Works
The function takes an array of quarter strings and generates column definitions for a Tabulator table. The first column is always titled "Items" and configured for textual content. Each subsequent column represents a quarter and is configured for financial data, with right alignment and a money formatter.

#### Parameters
- `quarters`: string[] - An array of quarter strings in the format "YYYY QX".

#### Returns
- `Tabulator.ColumnDefinition[]`: An array of column definitions for Tabulator.

#### Usage Example
```typescript
// Define an array of quarters
const quartersArray = ['2023 Q3', '2023 Q2', '2023 Q1', '2022 Q4', '2022 Q3'];

// Create table columns using the function
const tableColumns = CreateMainTableColumns(quartersArray);

// Initialize a Tabulator table with the generated columns
const table = new Tabulator("#example-table", {
  columns: tableColumns,
  // ... other Tabulator options
});
``````
#### Flowchart
```mermaid
graph TB
    Start["Start"] -->|"Receive quarters array"| A["Create empty columns array"]
    A --> B["Add 'Items' column to array"]
    B --> C["For each quarter in quarters"]
    C -- "Add quarter column" --> D["{title: quarter, field: quarter, headerSort: false}" ]
    D --> E["Add to columns array"]
    E --> F["All quarters processed"]
    F --> End["Return columns array"]
``````


### `CreateYoYArray`

#### Purpose
Generates an array of years and quarters in a year-over-year (YoY) format. This is useful for creating time series data for specific quarters across multiple years.

#### How It Works
- Takes a starting year and quarter (e.g., '2023 Q3') and a number of years.
- Iteratively decrements the year while keeping the quarter constant.
- Constructs an array of these year-quarter combinations.

#### Parameters
- `startYear`: string - The starting year and quarter in the format 'YYYY QX' where YYYY is the year and QX is the quarter (e.g., 'Q3').
- `numberOfYears`: number - The number of years to include in the array, counting backwards from the start year.

#### Returns
- string[] - An array of year-quarter strings in reverse chronological order. For example, if the start year is '2023 Q3' and the number of years is 3, it returns ['2023 Q3', '2022 Q3', '2021 Q3'].

#### Sample Usage and Output
```typescript
let startYear = '2023 Q3';
let numberOfYears = 3;
let yoyArray = CreateYoYArray(startYear, numberOfYears);
console.log(yoyArray); // Outputs: ['2023 Q3', '2022 Q3', '2021 Q3']
```

#### Flowchart
```mermaid
graph TB
    Start["Start"]
    Function["Function: CreateYoYArray"]
    Split["Split startYear"]
    Year["year = startYear.split(' ')[0]"]
    Quarter["quarter = startYear.split(' ')[1]"]
    Loop["for i = 0; i < numberOfYears; i++"]
    CurrentYear["currentYear = parseInt(year) - i"]
    Push["result.push(`${currentYear} ${quarter}`)"]
    Reverse["result.reverse()"]
    Return["return result"]
    End["End"]

    Start --> Function
    Function --> Split
    Split --> Year
    Split --> Quarter
    Year --> Loop
    Quarter --> Loop
    Loop --> CurrentYear
    CurrentYear --> Push
    Push --> Loop
    Loop --> Reverse
    Reverse --> Return
    Return --> End
```

### `UpdateValueMainTableData`

#### Purpose
This function is designed to merge financial data from the dataPL object into each item of the tableData array. It updates each item in tableData with corresponding financial data found in dataPL.pl, keyed by "YYYY QX".

#### How It Works
- The function iterates over each item in the tableData array.
- For each item, it checks for corresponding financial data in dataPL.pl based on the item's name.
- If matching financial data is found, the function merges this data into the tableData item.
- Each key representing a quarter (e.g., "2021 Q1") and its value from dataPL.pl is added to the respective item in tableData.
- The function returns an updated tableData array with merged financial data.

#### Parameters
- `dataPL`: An object containing financial data. It should have a structure where dataPL.pl is an object with keys representing different financial metrics, each containing a sub-object keyed by "YYYY QX".
- `tableData`: An array of objects, each with at least an 'item' property, representing different financial metrics.

#### Returns
- An updated array of tableData where each item contains its original properties plus the corresponding financial data.

#### Sample Usage and Output
```typescript
// Sample input dataPL object
const dataPL = {
  pl: {
    "Revenue From Operations": {
      "2021 Q1": { value: 100000 },
      "2021 Q2": { value: 110000 }
      // ... more quarters
    },
    // ... more items
  }
};

// Sample input tableData array
const tableData = [
  { id: 1, item: "Revenue From Operations" }
  // ... more items
];

// Calling the function
const updatedTableData = UpdateValueTableData(dataPL, tableData);

// Expected output
// [
//   {
//     id: 1,
//     item: "Revenue From Operations",
//     "2021 Q1": 100000,
//     "2021 Q2": 110000
//     // ... more quarters
//   },
//   // ... more items with their respective updated financial data
// ]
````
#### Flowchart
```mermaid
graph TD
    Start["Start"] -->|"Call UpdateValueTableData with dataPL and tableData"| IterateTableData["Iterate over each item in tableData"]
    IterateTableData -->|"For each item"| CheckDataPL["Check for corresponding data in dataPL.pl"]
    CheckDataPL -->|"If data found"| MergeData["Merge financial data into tableData item"]
    MergeData --> ReturnItem["Return updated tableItem"]
    CheckDataPL -->|"If no data found"| ReturnItem
    ReturnItem -->|"Continue until all items processed"| End["End"]
```
## Function Definition in `financial-statement-card.ts`
### `GetLastYear`

#### Purpose
Retrieves the quarter from one year prior to the current period from the stock's financial data.

#### How It Works
- Calls the `GetLastQuarterList` function from the `FinancialService` instance.
- The `GetLastQuarterList` function is passed the current period and the number of quarters to generate, which is 5 in this case.
- It then selects the 5th element from the returned array, which corresponds to the same quarter from the previous year.

#### Parameters
- `stock`: any - The stock object containing the financial period data.

#### Returns
- `string`: A string representing the year and quarter in the format "YYYY QX".

#### Sample Usage and Output
```typescript
const stock = { period: '2023 Q3' };
const lastYearQuarter = GetLastYear(stock);
// Assuming the financialService.GetLastQuarterList method returns an array of the last five quarters,
// the output would be '2022 Q3'.
````
### `GetStockSector`

#### Purpose
Retrieves the sector classification of a given stock.

#### How It Works
- Directly accesses and returns the `sector` property from the provided stock object.

#### Parameters
- `stock`: any - The stock object containing sector information.

#### Returns
- `string`: The sector of the stock.

#### Sample Usage and Output
```typescript
const stock = { sector: 'Banking' };
const sector = GetStockSector(stock);
// Output: 'Banking'
```

### `GetTotalRevenue`

#### Purpose
Calculates and retrieves the total revenue for a given stock, based on its sector. It distinguishes between different types of revenue (e.g., 'Interest Income' for banking sector stocks).

#### How It Works
- The function first determines the stock's sector using the `GetStockSector` function.
- If the stock is in the 'Banking' sector, it sets the `totalRevenueItemName` to 'Interest Income' and retrieves the corresponding value from the stock's financial data (`pl` object).
- For stocks in other sectors, it sets `totalRevenueItemName` to 'Total Income' and retrieves the 'Total Revenue' value from the stock's financial data.
- The retrieved value is then returned as the total revenue for the stock.

#### Parameters
- `stock`: any - The stock object containing financial data and sector information.

#### Returns
- `any`: The total revenue figure for the stock, which varies based on the sector.

#### Sample Usage and Output
```typescript
const stock = {
  sector: 'Banking',
  period: '2023 Q1',
  pl: {
    'Interest Income': {
      '2023 Q1': { value: '50000' }
    },
    'Total Revenue': {
      '2023 Q1': { value: '100000' }
    }
  }
};
const totalRevenue = GetTotalRevenue(stock);
// Output: '50000' if the sector is 'Banking', or '100000' for other sectors.
```

### `GetTotalRevenueLastYear`

#### Purpose
Determines the total revenue for a stock in the last financial year. This function accounts for sector-specific revenue calculations, particularly distinguishing between 'Banking' and other sectors.

#### How It Works
- The function first identifies the stock's sector using the `GetStockSector` function.
- For stocks in the 'Banking' sector, it accesses the 'Interest Income' value for the last year's quarter, as obtained by the `GetLastYear` function.
- For stocks in other sectors, it fetches the 'Total Revenue' for the last year's quarter.
- This approach ensures that the total revenue figure is accurately retrieved according to the sector-specific financial structure.

#### Parameters
- `stock`: any - The stock object containing financial data including sector and profit & loss (pl) details.

#### Returns
- `any`: The total revenue for the stock for the last financial year.

#### Sample Usage and Output
```typescript
const stock = {
  sector: 'Banking',
  pl: {
    'Interest Income': {
      '2022 Q4': { value: '45000' },
      '2021 Q4': { value: '40000' }
    },
    'Total Revenue': {
      '2022 Q4': { value: '90000' },
      '2021 Q4': { value: '85000' }
    }
  },
  period: '2023 Q1'
};
const totalRevenueLastYear = GetTotalRevenueLastYear(stock);
// Output: '40000' if the sector is 'Banking', or '85000' for other sectors.
```

### `GetTotalRevenueYoY`

#### Purpose
Calculates the Year-Over-Year (YoY) change in total revenue for a given stock.

#### How It Works
- Subtracts the total revenue of the last financial year (`totalRevenueLastYear`) from the total revenue of the current period (`totalRevenue`) to determine the Year-Over-Year change.

#### Parameters
- `stock`: any - The stock object containing the total revenue for the current period and the last year.

#### Returns
- `any`: The Year-Over-Year change in total revenue.

#### Sample Usage and Output
```typescript
const stock = {
  totalRevenue: 120000,
  totalRevenueLastYear: 100000
};
const totalRevenueYoY = GetTotalRevenueYoY(stock);
// Output: 20000 (representing the YoY change in total revenue)
```

### `GetTotalRevenusYoYPercent`

#### Purpose
Calculates the Year-Over-Year (YoY) percentage change in total revenue for a given stock.

#### How It Works
- Computes the Year-Over-Year change in total revenue as a ratio of the total revenue from the last financial year.
- The ratio is then multiplied by 100 to convert it into a percentage. This calculation takes the absolute value of the last year's total revenue to ensure a correct percentage calculation even if the last year's revenue was negative.

#### Parameters
- `stock`: any - The stock object containing the total revenue change Year-Over-Year (`totalRevenusYoY`) and the total revenue from the last year (`totalRevenueLastYear`).

#### Returns
- `any`: The Year-Over-Year percentage change in total revenue.

#### Sample Usage and Output
```typescript
const stock = {
  totalRevenusYoY: 20000, // Change in revenue
  totalRevenueLastYear: 100000 // Last year's revenue
};
const totalRevenusYoYPercent = GetTotalRevenusYoYPercent(stock);
// Output: 20 (representing a 20% Year-Over-Year change in total revenue)
```

### `GetGrossProfit`

#### Purpose
Calculates the gross profit for a given stock. This function adapts to different sectors, specifically accounting for unique financial metrics in the 'Banking' and 'Finance and Securities' sectors.

#### How It Works
- The function first determines the sector of the stock using `GetStockSector`.
- For stocks in the 'Banking' sector, it sets `grossProfitItemName` to 'Net Interest Income' and retrieves the corresponding value.
- For stocks in the 'Finance and Securities' sector, `grossProfitItemName` is set to 'EBIT', and the relevant value is fetched.
- For other sectors, the gross profit is calculated as the difference between 'Revenue From Operations' and 'Costs'.
- The function dynamically selects the appropriate financial metrics based on the stock's sector and calculates the gross profit accordingly.

#### Parameters
- `stock`: any - The stock object containing financial data including sector, profit & loss (pl) details, and period.

#### Returns
- `any`: The gross profit for the stock, which varies based on the sector.

#### Sample Usage and Output
```typescript
const stock = {
  sector: 'Banking',
  period: '2023 Q1',
  pl: {
    'Net Interest Income': { '2023 Q1': { value: '50000' } },
    'Profit (Loss) Before Finance Costs And Income Tax Expense': { '2023 Q1': { value: '30000' } },
    'Revenue From Operations': { '2023 Q1': { value: '100000' } },
    'Costs': { '2023 Q1': { value: '40000' } }
  }
};
const grossProfit = GetGrossProfit(stock);
// Output: '50000' for Banking sector, '30000' for Finance and Securities, or '60000' (Revenue From Operations - Costs) for other sectors.
```

### `GetGrossProfitLastYear`

#### Purpose
Calculates the gross profit for a stock in the last financial year, adapting to different financial metrics based on the stock's sector.

#### How It Works
- The function determines the sector of the stock using `GetStockSector`.
- For stocks in the 'Banking' sector, it retrieves the 'Net Interest Income' value for the last year's quarter, as determined by the `GetLastYear` function.
- For stocks in the 'Finance and Securities' sector, it fetches the 'Profit (Loss) Before Finance Costs And Income Tax Expense' value for the last year.
- For other sectors, the gross profit is calculated as the difference between 'Revenue From Operations' and 'Costs' for the last year's quarter.
- This method ensures that the gross profit is accurately calculated based on the sector-specific financial structure of the stock.

#### Parameters
- `stock`: any - The stock object containing financial data including sector and profit & loss (pl) details.

#### Returns
- `any`: The gross profit for the stock for the last financial year.

#### Sample Usage and Output
```typescript
const stock = {
  sector: 'Banking',
  pl: {
    'Net Interest Income': { '2022 Q4': { value: '45000' } },
    'Profit (Loss) Before Finance Costs And Income Tax Expense': { '2022 Q4': { value: '30000' } },
    'Revenue From Operations': { '2022 Q4': { value: '80000' } },
    'Costs': { '2022 Q4': { value: '30000' } }
  },
  period: '2023 Q1'
};
const grossProfitLastYear = GetGrossProfitLastYear(stock);
// Output: '45000' for Banking sector, '30000' for Finance and Securities, or '50000' (Revenue From Operations - Costs) for other sectors.
```
### `GetGrossProfitYoY`

#### Purpose
Calculates the Year-Over-Year (YoY) change in gross profit for a given stock.

#### How It Works
- This function computes the difference in gross profit between the current year (`gp`) and the last year (`gpLastYear`).
- It simply subtracts the gross profit of the last year from the gross profit of the current year to find the Year-Over-Year change.

#### Parameters
- `stock`: any - The stock object containing gross profit data for the current year (`gp`) and the last year (`gpLastYear`).

#### Returns
- `any`: The Year-Over-Year change in gross profit.

#### Sample Usage and Output
```typescript
const stock = {
  gp: 120000, // Gross profit for the current year
  gpLastYear: 100000 // Gross profit for the last year
};
const grossProfitYoY = GetGrossProfitYoY(stock);
// Output: 20000 (representing the YoY change in gross profit)
```

### `GetGrossProfitYoYPercent`

#### Purpose
Calculates the Year-Over-Year (YoY) percentage change in gross profit for a given stock.

#### How It Works
- The function computes the Year-Over-Year change in gross profit as a percentage.
- It divides the Year-Over-Year gross profit change (`gpYoY`) by the absolute value of last year's gross profit (`gpLastYear`) to get a ratio.
- This ratio is then multiplied by 100 to convert it into a percentage. Using the absolute value ensures accurate calculation even if last year's gross profit was negative.

#### Parameters
- `stock`: any - The stock object containing the Year-Over-Year gross profit change (`gpYoY`) and last year's gross profit (`gpLastYear`).

#### Returns
- `any`: The Year-Over-Year percentage change in gross profit.

#### Sample Usage and Output
```typescript
const stock = {
  gpYoY: 20000, // Year-Over-Year change in gross profit
  gpLastYear: 100000 // Gross profit for the last year
};
const grossProfitYoYPercent = GetGrossProfitYoYPercent(stock);
// Output: 20 (representing a 20% Year-Over-Year change in gross profit)
```

### `GetNetProfit`

#### Purpose
Retrieves the net profit for a given stock for the current financial period.

#### How It Works
- The function sets `netProfitItemName` to 'Net Profit' as an identifier for the type of profit being calculated.
- It then accesses the stock's profit and loss (pl) data to retrieve the 'Net Profit (Loss) For The Period' value for the specified financial period.
- The net profit value for the current period is extracted and returned.

#### Parameters
- `stock`: any - The stock object containing profit and loss data (`pl`) and the current financial period (`period`).

#### Returns
- `any`: The net profit value for the stock for the current financial period.

#### Sample Usage and Output
```typescript
const stock = {
  period: '2023 Q1',
  pl: {
    'Net Profit (Loss) For The Period': {
      '2023 Q1': { value: '75000' }
    }
  }
};
const netProfit = GetNetProfit(stock);
// Output: '75000' (the net profit for the period '2023 Q1')
```
### `GetNetProfitLastYear`

#### Purpose
Calculates the net profit (or loss) for a stock in the previous financial year. This function is designed to retrieve the net profit or loss value from the stock's financial data for the last year's period.

#### How It Works
- Utilizes the `GetLastYear` function to determine the financial period for the previous year.
- Retrieves the 'Net Profit (Loss) For The Period' value for that specific period from the stock's financial data (`pl` object).

#### Parameters
- `stock`: any - The stock object containing detailed profit & loss (pl) data and the current financial period.

#### Returns
- `any`: The net profit (or loss) for the stock for the last financial year.

#### Sample Usage and Output
```typescript
const stock = {
  pl: {
    'Net Profit (Loss) For The Period': {
      '2022 Q4': { value: '20000' },
      '2021 Q4': { value: '-5000' }
    }
  },
  period: '2023 Q1'
};
const netProfitLastYear = GetNetProfitLastYear(stock);
// Output: '20000' if the last year's quarter was '2022 Q4', or '-5000' for '2021 Q4'.
```

### `GetNetProfitYoY`

#### Purpose
Calculates the Year-Over-Year (YoY) change in net profit for a given stock. This function is aimed at assessing the growth or decline in a stock's profitability over the past year.

#### How It Works
- Subtracts the net profit from the last financial year (`npLastYear`) from the current financial year's net profit (`np`) to calculate the Year-Over-Year change.
- This calculation provides a straightforward assessment of how the net profit has evolved from one year to the next.

#### Parameters
- `stock`: any - The stock object containing the net profit data for the current period (`np`) and the last year (`npLastYear`).

#### Returns
- `any`: The Year-Over-Year change in net profit.

#### Sample Usage and Output
```typescript
const stock = {
  np: 30000, // Net profit for the current period
  npLastYear: 25000 // Net profit for the last year
};
const netProfitYoY = GetNetProfitYoY(stock);
// Output: 5000 (indicating a 5000 increase in net profit Year-Over-Year)
```

### `GetNetProfitYoYPercent`

#### Purpose
Calculates the Year-Over-Year (YoY) percentage change in net profit for a given stock. This function provides a percentage-based assessment of the growth or decline in the stock's net profitability over the past year.

#### How It Works
- Divides the Year-Over-Year change in net profit (`npYoY`) by the absolute value of last year's net profit (`npLastYear`). This approach ensures accurate percentage calculations, even when last year's net profit was negative.
- The result is then multiplied by 100 to convert it into a percentage, representing the rate of change in net profit compared to the previous year.

#### Parameters
- `stock`: any - The stock object containing the net profit data for the Year-Over-Year change (`npYoY`) and last year (`npLastYear`).

#### Returns
- `any`: The Year-Over-Year percentage change in net profit.

#### Sample Usage and Output
```typescript
const stock = {
  npYoY: 5000, // Year-Over-Year change in net profit
  npLastYear: 25000 // Net profit for the last year
};
const netProfitYoYPercent = GetNetProfitYoYPercent(stock);
// Output: 20 (representing a 20% increase in net profit Year-Over-Year)
```

### `GetFinancialIncomeCard`

#### Purpose
Consolidates various financial metrics into a single enhanced stock object, representing a comprehensive financial income card. This function aggregates key metrics such as total revenue, gross profit, and net profit, along with their Year-Over-Year changes and percentages.

#### How It Works
- The function calculates and sets various financial metrics on the stock object:
  - Total Revenue for the current period and the last year.
  - Year-Over-Year change and percentage change in Total Revenue.
  - Gross Profit for the current period and the last year.
  - Year-Over-Year change and percentage change in Gross Profit.
  - Net Profit for the current period and the last year.
  - Year-Over-Year change and percentage change in Net Profit.
- Each of these metrics is computed using the respective functions (`GetTotalRevenue`, `GetGrossProfit`, `GetNetProfit`, etc.).
- The updated stock object, with all these financial metrics, is then returned.

#### Parameters
- `stock`: any - The stock object to be enhanced with financial metrics.

#### Returns
- `string`: The enhanced stock object containing all calculated financial metrics.

#### Sample Usage and Output
```typescript
const stock = {
  // ... initial stock data including financial data ...
};
const financialIncomeCard = GetFinancialIncomeCard(stock);
// Output: The stock object now contains properties like totalRevenue, totalRevenueLastYear,
// totalRevenusYoY, gp, gpLastYear, np, npLastYear, and respective YoY changes and percentages.
```
#### Flowchart
```mermaid
graph TD
    A["Start"] -->|"GetFinancialIncomeCard called"| B["Initialize stock object"]
    B --> C["Calculate Total Revenue"]
    C --> D["Calculate Year-Over-Year change and percentage for Total Revenue"]
    D --> E["Calculate Gross Profit"]
    E --> F["Calculate Year-Over-Year change and percentage for Gross Profit"]
    F --> G["Calculate Net Profit"]
    G --> H["Calculate Year-Over-Year change and percentage for Net Profit"]
    H --> I["Return enhanced stock object"]
    I --> J["End"]
```

## Function Definition in `financial-statement-chart.ts`

### `CreateYoYArrayData`

#### Purpose
Constructs year-over-year (YoY) array data for a stock, categorizing financial values by quarters over the past several years. This function is designed to prepare data for time-series analysis or charting, focusing on quarterly financial trends.

#### How It Works
- Initializes arrays for storing years and quarters data (`yearsQuarters`) and the corresponding financial data (`yearQuartersData`) in the stock's chart object.
- Iterates over a predefined list of quarters (e.g., 'Q1', 'Q2', 'Q3', 'Q4').
- For each quarter, it uses the `CreateYoYArray` function from the `FinancialService` to generate an array of year-quarter strings, starting from the current year and going back for a specified number of years.
- Stores this array in `stock.chart.yearsQuarters`.
- Then, for each year-quarter combination, it fetches the corresponding financial value from the stock's profit and loss data (`pl`) and stores these values in `stock.chart.yearQuartersData`.
- Returns the enhanced stock object with added year-over-year array data.

#### Parameters
- `stock`: any - The stock object to be processed, containing financial data and a chart object for storing the results.

#### Returns
- `any`: The stock object enhanced with year-over-year array data for each quarter.

#### Sample Usage and Output
```typescript
const stock = {
  // ... initial stock data including financial data ...
};

const updatedStock = CreateYoYArrayData(stock);

// Sample Output for 'yearQuartersData':
// {
//   q1: [5769.19, 5645.11, 2599.06, 3453.03, 4122.78],
//   q2: [4794.61, 2887.03, 2189.69, 3004.02, 4438.40],
//   q3: [5611.83, 3997.70, 1493.01, 3676.93, 4424.30],
//   q4: [6167.45, 3572.58, 6703.72, 3137.73, 0]
// }
```
#### Flowchart
```mermaid
   graph TD
    A["Start"] -->|"CreateYoYArrayData called"| B["Initialize yearsQuarters and yearQuartersData arrays"]
    B --> C["Iterate over quarters"]
    C -->|"For each quarter"| D["Generate year-quarter strings using CreateYoYArray"]
    D --> E["Store year-quarters in stock.chart.yearsQuarters"]
    E --> F["Iterate over year-quarter combinations"]
    F -->|"For each year-quarter"| G{"Fetch financial value for each year-quarter"}
    G --> H["Store values in stock.chart.yearQuartersData"]
    H --> I{"All year-quarters processed for this quarter?"}
    I -->|"Yes"| J{"All quarters processed?"}
    I -->|"No"| F
    J -->|"Yes"| K["Return enhanced stock object"]
    J -->|"No"| C
    K --> L["End"]
```
### `CreateChartData`

#### Purpose
Generates chart-ready data for a given stock by combining year-over-year financial data with corresponding years and quarters. This function serves as a pipeline to prepare stock data specifically for charting purposes.

#### How It Works
- First, the `CreateYoYArrayData` function is called to populate the stock object with year-over-year data arrays (`yearsQuarters` and `yearQuartersData`).
- Then, the `CombineYQData` function from the `FinancialService` is used to merge these arrays into a format that is suitable for charting. This results in an array of objects, each representing a quarter with financial values mapped to their respective years.
- The final output is an array of data points, ready to be utilized in financial charts or graphs.

#### Parameters
- `stock`: any - The stock object containing initial financial data and structures for storing the processed chart data.

#### Returns
- `any`: An array of objects, each representing a quarter, with financial values mapped to respective years, ready for charting.

#### Sample Usage and Output
```typescript
const stock = {
  // ... initial stock data including financial data ...
};

const chartData = CreateChartData(stock);

// Sample Output:
// Assuming the stock contains financial data for multiple quarters over several years,
// the output will be an array of objects formatted for charting, with each object
// representing a quarter and its associated financial values for different years.
```

### `CreateChartDataSets`

#### Purpose
Generates a collection of data sets, each representing a specific year, from the stock's chart data. These data sets are structured to be directly usable in creating time-series charts, such as line graphs, where each line represents a different year.

#### How It Works
- The function iterates over the years and quarters data, specifically starting with the quarters for the first year in `stock.chart.yearsQuarters["q1"]`.
- For each year-quarter combination, it extracts the year and creates a data set:
  - The `label` is set to the year.
  - The `data` array consists of financial values corresponding to that year, extracted from `stock.chart.data`.
  - The `parsing` object defines how the data should be parsed when used in charting libraries.
- Each data set is configured for chart visualization, with properties for labeling and data points relevant to each specific year.

#### Parameters
- `stock`: any - The stock object containing prepared chart data in `stock.chart.yearsQuarters` and `stock.chart.data`.

#### Returns
- `any`: An array of data sets, each representing financial data for a specific year, formatted for use in charts.

#### Sample Usage and Output
```typescript
const stock = {
  // ... initial stock data including prepared chart data ...
};

const datasets = CreateChartDataSets(stock);

// Sample Output:
// [
//   { label: '2019', data: [/* array of values */], parsing: { yAxisKey: '2019' }, borderColor: '...', backgroundColor: '...' },
//   { label: '2020', data: [/* array of values */], parsing: { yAxisKey: '2020' }, borderColor: '...', backgroundColor: '...' },
//   // ... datasets for other years ...
// ]
```
#### Flowchart
```mermaid
    graph TD
        A["Start"] -->|"CreateChartDataSets called"| B["Iterate over yearsQuarters['q1']"]
        B -->|"For each yearQuarter"| C["Extract year from yearQuarter"]
        C --> D["Create chart data set"]
        D --> E["Set label to year"]
        E --> F["Map data from stock.chart.data"]
        F --> G["Set parsing yAxisKey to year"]
        G --> H{"All yearQuarters processed?"}
        H -->|"Yes"| I["Return array of chart data sets"]
        H -->|"No"| C
        I --> J["End"]
```
### `CreateYoYChart`

#### Purpose
Creates a Year-Over-Year (YoY) bar chart for a given stock. This function is designed to generate a chart object using the Chart.js library (or a similar charting library), ready for rendering visual representations of financial data.

#### How It Works
- Initializes a new chart instance using the stock's chart name.
- Configures the chart type as a bar chart.
- Sets the chart data, using predefined quarters as labels and the datasets prepared in the stock's chart object.
- Defines various options for the chart's appearance and behavior, including:
  - Responsiveness settings.
  - Legend configuration, such as position and display.
  - Title settings.
  - Data labels formatting and styling, including color, rotation, and a formatter function to customize the data label display.

#### Parameters
- `stock`: any - The stock object containing the necessary data for chart creation, including `stock.chart.name` and `stock.chart.dataset`.

#### Returns
- `any`: A Chart.js chart instance, configured and ready to be rendered.

#### Sample Usage and Output
```typescript
const stock = {
  chart: {
    name: 'Total Revenue',
    dataset: [
      // ... array of datasets prepared for each year ...
    ]
    // ... other chart properties ...
  },
  // ... other stock properties ...
};

const yoYChart = CreateYoYChart(stock);

// Output:
// A Chart.js chart instance representing a bar chart of the stock's Total Revenue YoY,
// with datasets for each year and quarters as labels.
```

### `GetYoYChart`

#### Purpose
Generates a Year-Over-Year (YoY) chart for a given stock and specified chart name. This function serves as a comprehensive pipeline to create a complete chart object, from data preparation to chart instantiation.

#### How It Works
- Validates the provided stock object to ensure it is valid and of the correct type.
- Initializes an empty array for the stock's chart data.
- Sets the chart name according to the provided `chartName` argument.
- Calls `CreateChartData` to prepare the chart data based on the stock's financial information.
- Calls `CreateChartDataSets` to generate the datasets needed for the chart, each representing a specific year.
- Logs the prepared stock data to the console for debugging or informational purposes.
- Finally, calls `CreateYoYChart` to create and return the actual chart object using the prepared data.

#### Parameters
- `stock`: any - The stock object containing financial data to be visualized.
- `chartName`: string - The name to be assigned to the chart, typically representing the financial metric being visualized.

#### Returns
- `any`: A Chart.js chart instance (or a similar chart instance), ready to be rendered.

#### Sample Usage and Output
```typescript
const stock = {
  // ... stock object with necessary financial data ...
};

const chartName = 'Total Revenue';
const yoYChart = GetYoYChart(stock, chartName);

// Output:
// A complete Chart.js chart instance for the 'Total Revenue' YoY visualization of the provided stock,
// with all data and configurations set up.
```

## Development server
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
