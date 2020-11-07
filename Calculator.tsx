import { AssetCalculator } from "./AssetCalculator";
import { ExpenseCalculator } from "./ExpenseCalculator";
import { Household } from "./Household";
import { IncomeCalculator } from "./IncomeCalculator";
import { MonetaryValue } from "./MonetaryValue";

export class Calculator {
  household: Household;
  expenses: ExpenseCalculator;
  incomes: IncomeCalculator;
  assets: AssetCalculator;

  constructor(household: Household) {
    this.household = household;
    this.expenses = new ExpenseCalculator(household);
    this.incomes = new IncomeCalculator(household);
    this.assets = new AssetCalculator(household);
  }

  update() {
    //Iterate over each year
    console.debug("Updating household");
    for (
      var year = this.household.startYear;
      year < this.household.endYear + 1;
      year++
    ) {
      console.debug("Year: " + year);

      //TODO: use Household default currency instead of hardcoded GBP
      var incomeForYear = this.incomes.income(year);

      var expenseForYear = this.expenses.expense(year);

      console.debug("Income for year (excl. pension):  " + incomeForYear.value);
      console.debug("Expense for year: " + expenseForYear.value);

      this.assets.allocateEarnings(
        year,
        incomeForYear.add(
          new MonetaryValue(expenseForYear.value * -1, expenseForYear.currency)
        )
      );
    }
    return this.assets.netWorthSeries();
  }

  netWorthSeries(): Map<number, MonetaryValue> {
    return this.assets.netWorthSeries();
  }
}
