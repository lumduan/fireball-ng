# Fireball-NG Project Documentation

## Function: CreateYoYArray(startYear: string, numberOfYears: number): string[]

### Purpose:
Generates an array of years and quarters in a year-over-year (YoY) format, useful for creating time series data for specific quarters across multiple years.

### How it works:
Takes a starting year and quarter (e.g., '2023 Q3') and a number of years.
Iteratively decrements the year while keeping the quarter constant.
Constructs an array of these year-quarter combinations.
Parameters:
startYear: string: The starting year and quarter in the format 'YYYY QX'.
numberOfYears: number: The number of years to include in the array, counting backwards from the start year.
Returns:
string[]: An array of year-quarter strings in reverse chronological order.


## Function: createFinancialItem
 * Function: createFinancialItem
 * Purpose:
 *   Creates an object representing a financial item with its values for the past three years.
 *
 * How it works:
 *   - Takes a display name, a corresponding key in the data object, the data object itself, and an array of years.
 *   - Fetches the financial values from the data object based on the provided key and year indices.
 *   - Returns an object with the display name and financial values for each of the last three years.
 *
 * Parameters:
 *   - displayName: The name to be displayed for the financial item.
 *   - dataKey: The key corresponding to the item in the data object.
 *   - data: The data object containing financial information.
 *   - lastYears: An array containing indices for the last three years.
 *
 * Returns:
 *   - An object containing the display name of the financial item and its values for the past three years.
 *
 * Sample Usage and Output:
 *   // Assuming data is an object with financial data and lastYears is [2021, 2022, 2023]
 *   const item = createFinancialItem('Revenue', 'Revenue From Operations', data, lastYears);
 *   // Output: { item: 'Revenue', 2: '100.00', 1: '200.00', 0: '300.00' }
 *
 */
