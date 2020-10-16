import { Asset } from "./Asset";
import { CurrencyCode } from "./CurrencyCode";
import { Expense } from "./Expense";
import { HouseholdComponent } from "./HouseholdComponent";
import { IncomeSource } from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";
import { SavingsAccount } from "./SavingsAccount";

export class Household {
  hhComponents: Map<string, HouseholdComponent> = new Map<
    string,
    HouseholdComponent
  >();
  pensionAccounts: Asset[] = new Array<Asset>();
  taxfreeAccounts: Asset[] = new Array<Asset>();
  afterTaxAccounts: Asset[] = new Array<Asset>();

  netWorthByYear: Map<number, MonetaryValue> = new Map<number, MonetaryValue>();

  private startYear = 2021;
  private endYear = 2033;

  constructor(pStartYear?: number, pEndYear?: number) {
    if (pStartYear) this.startYear = pStartYear;
    if (pEndYear) this.endYear = pEndYear;
    const sAcc: SavingsAccount = new SavingsAccount();
    this.hhComponents.set(sAcc.id, sAcc);
    this.afterTaxAccounts.push(sAcc);
  }

  addComponent(component: HouseholdComponent) {
    this.hhComponents.set(component.id, component);
  }

  addAfterTaxAccount(account: Asset) {
    this.addComponent(account);
    this.afterTaxAccounts.push(account);
  }

  update() {
    //Iterate over each year
    for (var year = this.startYear; year < this.endYear + 1; year++) {
      //TODO: use Household default currency instead of hardcoded GBP
      var incomeForYear = new MonetaryValue(0);

      var expenseForYear = new MonetaryValue(0);

      //Iterate over each incomeSource
      for (let [id, component] of this.hhComponents) {
        //TODO: convert currency if needed
        incomeForYear = incomeForYear.add(component.income(year));
        expenseForYear = expenseForYear.add(component.expense(year));
      }

      this.allocateEarnings(
        year,
        incomeForYear.add(
          new MonetaryValue(expenseForYear.value * -1, expenseForYear.currency)
        )
      );
    }
  }

  allocateEarnings(year: number, afterTaxSaving: MonetaryValue) {
    console.log(
      "After tax saving in year: " + year + " is: " + afterTaxSaving.value
    );
    var account = this.afterTaxAccounts[0];
    var prevYearBal = account.closingValue(year - 1);
    prevYearBal = prevYearBal ? prevYearBal : new MonetaryValue(0);
    console.log("prevYearBal in year: " + year + " is :" + prevYearBal.value);
    account.setValue(year, prevYearBal.add(afterTaxSaving));
    console.log(
      "Closing value in year: " +
        year +
        " is: " +
        account.closingValue(year).value
    );
    for (let [year, monValue] of this.afterTaxAccounts[0].allClosingValues()) {
      console.log("allocateEarnings: " + year + ", " + monValue.value);
    }
  }

  netWorthSeries(): Map<number, MonetaryValue> {
    return this.afterTaxAccounts[0].allClosingValues();
  }
}
