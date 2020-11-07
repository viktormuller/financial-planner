import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";
import { PensionStrategy } from "./PensionStrategy";
import { UKTax } from "./UKTax";

export class AssetCalculator {
  household: Household;
  pensionStrategy: PensionStrategy = new PensionStrategy();
  taxCalc: UKTax = new UKTax();

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
      finalNetSaving = finalNetSaving.subtract(
        this.household.home.purchasePrice
      );
    }

    if (finalNetSaving.value < 0) {
      var numOfPensioners = this.household.adults.filter(
        adult => adult.job.endYear < year
      ).length;
      if (numOfPensioners > 0) {
        finalNetSaving = this.taxCalc.tax(
          this.pensionStrategy.withdraw(
            this.household,
            this.taxCalc.grossForNet(finalNetSaving).multiply(-1),
            year
          )
        );
      }
    }
    account.setValue(year, prevYearBal.add(finalNetSaving));
    console.debug(
      "This year's balance: " + prevYearBal.add(finalNetSaving).value
    );
  }

  netWorthSeries() {
    var netWorthSeries = this.household.afterTaxAccount.allClosingValues();
    for (let [year, balance] of netWorthSeries.entries()) {
      var newBalance: MonetaryValue = new MonetaryValue(
        balance.value,
        balance.currency
      );
      if (year >= this.household.home.yearOfPurchase)
        newBalance = newBalance.add(this.household.home.purchasePrice);

      for (let earner of this.household.adults) {
        console.debug(
          "Adding pension account to net worth: " +
            earner.pensionAccount.closingValue(year).value
        );
        newBalance = newBalance.add(earner.pensionAccount.closingValue(year));
        console.debug("Update net worth: " + newBalance.value);
      }
      netWorthSeries.set(year, newBalance);
    }
    return netWorthSeries;
  }
}
