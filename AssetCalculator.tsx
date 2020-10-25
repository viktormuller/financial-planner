import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";

export class AssetCalculator {
  household: Household;

  constructor(household: Household) {
    this.household = household;
  }

  allocateEarnings(year: number, afterTaxSaving: MonetaryValue) {
    console.debug(
      "Allocating earnings of " + afterTaxSaving.value + " for year: " + year
    );

    console.debug(
      "Household savings account: " + this.household.afterTaxAccount
    );
    var account = this.household.afterTaxAccount;
    var prevYearBal = account.closingValue(year - 1);

    console.debug("Previous year balance: " + prevYearBal.value);
    prevYearBal = prevYearBal ? prevYearBal : new MonetaryValue(0);
    account.setValue(year, prevYearBal.add(afterTaxSaving));
    console.debug(
      "This year's balance: " + prevYearBal.add(afterTaxSaving).value
    );
  }

  netWorthSeries() {
    return this.household.afterTaxAccount.allClosingValues();
  }
}
