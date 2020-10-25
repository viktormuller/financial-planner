import { AssetCalculator } from "./AssetCalculator";
import { FullHouseholdExpense } from "./FullHouseholdExpense";
import { Household } from "./Household";
import { IncomeCalculator } from "./IncomeCalculator";
import { MonetaryValue } from "./MonetaryValue";

export class Calculator {
  startYear = new Date().getFullYear();
  endYear = new Date().getFullYear() + 80;

  household: Household;
  expenses: FullHouseholdExpense;
  incomes: IncomeCalculator;
  assets: AssetCalculator;

  constructor(household: Household) {
    this.household = household;
    this.expenses = new FullHouseholdExpense(household);
    this.incomes = new IncomeCalculator(household);
    this.assets = new AssetCalculator(household);
  }

  update() {
    //Iterate over each year
    console.debug("Updating household");
    for (var year = this.startYear; year < this.endYear + 1; year++) {
      console.debug("Year: " + year);

      //TODO: use Household default currency instead of hardcoded GBP
      var incomeForYear = this.incomes.income(year);

      var expenseForYear = this.expenses.expense(year);

      console.debug("Income for year:  " + incomeForYear.value);
      console.debug("Expense for year: " + expenseForYear.value);

      this.assets.allocateEarnings(
        year,
        incomeForYear.add(
          new MonetaryValue(expenseForYear.value * -1, expenseForYear.currency)
        )
      );
    }
  }

  netWorthSeries(): Map<number, MonetaryValue> {
    return this.assets.netWorthSeries();
  }
}
