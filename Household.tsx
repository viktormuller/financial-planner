import { Adults } from "./Adults";
import { Asset } from "./Asset";
import { Children } from "./Children";
import { CurrencyCode } from "./CurrencyCode";

import { HouseholdComponent } from "./HouseholdComponent";

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
  children: Children = new Children([]);
  adults: Adults = new Adults(2, []);

  netWorthByYear: Map<number, MonetaryValue> = new Map<number, MonetaryValue>();

  private startYear = 2021;
  private endYear = 2100;

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
    console.debug("Updating household");
    for (var year = this.startYear; year < this.endYear + 1; year++) {
      console.debug("Year: " + year);

      //TODO: use Household default currency instead of hardcoded GBP
      var incomeForYear = new MonetaryValue(0);

      var expenseForYear = new MonetaryValue(0);

      //Iterate over each incomeSource
      for (let [id, component] of this.hhComponents) {
        //TODO: convert currency if needed
        incomeForYear = incomeForYear.add(component.income(year));
        expenseForYear = expenseForYear.add(component.expense(year));
      }

      console.debug("Income for year:  " + incomeForYear.value);
      console.debug("Expense for year: " + expenseForYear.value);

      this.allocateEarnings(
        year,
        incomeForYear.add(
          new MonetaryValue(expenseForYear.value * -1, expenseForYear.currency)
        )
      );
    }
  }

  allocateEarnings(year: number, afterTaxSaving: MonetaryValue) {
    console.debug(
      "Allocating earnings of " + afterTaxSaving.value + " for year: " + year
    );
    var account = this.afterTaxAccounts[0];
    var prevYearBal = account.closingValue(year - 1);

    console.debug("Previous year balance: " + prevYearBal.value);
    prevYearBal = prevYearBal ? prevYearBal : new MonetaryValue(0);
    account.setValue(year, prevYearBal.add(afterTaxSaving));
    console.debug(
      "This year's balance: " + prevYearBal.add(afterTaxSaving).value
    );
  }

  netWorthSeries(): Map<number, MonetaryValue> {
    return this.afterTaxAccounts[0].allClosingValues();
  }
}
