import { CurrencyCode } from "./CurrencyCode";
import { Expense } from "./Expense";
import { IncomeSource } from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";
import { SavingsAccount } from "./SavingsAccount";

export  class Household {
  private incomeSources: IncomeSource[] = new Array<IncomeSource>();
  private expenses: Expense[] = new Array<Expense>();
  private startYear = 2021;
  private endYear = 2100;
  private savingsAcc : SavingsAccount = new SavingsAccount({currency: CurrencyCode.GBP, value: 1000000}, 0.02, 2020);
  

  constructor(pStartYear?: number, pEndYear?: number){
    if (pStartYear) this.startYear = pStartYear;
    if (pEndYear) this.endYear = pEndYear;
    this.savingsAcc.register(this);
  }

  addIncomeSource(incomeSource: IncomeSource) {
    this.incomeSources.push(incomeSource);
  }

  addExpense(expense: Expense) {
    this.expenses.push(expense);
  }

  netWorthSeries(): Map<number, MonetaryValue> {

    //Iterate over each year
    for (var year = this.startYear; year < this.endYear + 1; year++) {
      //TODO: use Household default currency instead of hardcoded GBP
      var incomeForYear = { year: year, currency: CurrencyCode.GBP, value: 0 };

      var expenseForYear = { year: year, currency: CurrencyCode.GBP, value: 0 };

      //Iterate over each incomeSource
      for (let incomeSource of this.incomeSources) {
        //TODO: convert currency if needed
        incomeForYear.value += incomeSource.income(year).value;
      }

      //Iterate over each expense
      for (let expense of this.expenses) {
        //TODO: convert currency if needed
        expenseForYear.value += expense.expense(year).value;
      }      

      var netWorthForLastYear = this.savingsAcc.getClosingBalance(year-1);
      if (!netWorthForLastYear) {
        netWorthForLastYear = {currency: CurrencyCode.GBP, value:0};
        this.savingsAcc.setClosingBalance(year-1,netWorthForLastYear);
      }

      var netWorthForYear = {
        currency: CurrencyCode.GBP,
        value: netWorthForLastYear.value + incomeForYear.value - expenseForYear.value
      };

      this.savingsAcc.setClosingBalance(year, netWorthForYear);
    }
    return this.savingsAcc.getAllClosingBalances();
  }
}
