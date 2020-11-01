import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";

export class AssetCalculator {
  household: Household;

  constructor(household: Household) {
    this.household = household;
  }

  allocateEarnings(year: number, afterTaxSaving: MonetaryValue) {
    var finalNetSaving: MonetaryValue = afterTaxSaving;

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

    // If home is purchased this year then account for it
    if (this.household.home && this.household.home.yearOfPurchase == year) {
      finalNetSaving = finalNetSaving.add(
        new MonetaryValue(-1 * this.household.home.purchasePrice.value)
      );
    }

    account.setValue(year, prevYearBal.add(finalNetSaving));
    console.debug(
      "This year's balance: " + prevYearBal.add(finalNetSaving).value
    );
  }

  netWorthSeries() {
    return this.household.afterTaxAccount.allClosingValues();
  }
}
