import { Household } from "./Household";
import { Income } from "./IncomeCalculator";
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

  allocateEarnings(year: number, netSavings: MonetaryValue) {
    var finalNetSaving: MonetaryValue = netSavings;

    console.debug(
      "Allocating after tax savings of " +
        netSavings.value +
        " for year: " +
        year
    );

    var account = this.household.afterTaxAccount;
    var prevYearBal = account.closingValue(year - 1);

    console.debug("Previous year balance: " + prevYearBal.value);
    prevYearBal = prevYearBal ? prevYearBal : new MonetaryValue(0);

    if (finalNetSaving.value < 0) {
      if (this.household.pensioners(year).length > 0) {
        finalNetSaving = finalNetSaving.add(
          this.pensionStrategy.withdrawNet(
            this.household,
            finalNetSaving.multiply(-1),
            year,
            this.taxCalc
          )
        );
      }
    }

    // If home is purchased this year then account for it
    if (this.household.home && this.household.home.yearOfPurchase == year) {
      finalNetSaving = finalNetSaving.subtract(
        this.household.home.purchasePrice
      );
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
        newBalance = newBalance.add(earner.pensionAccount.closingValue(year));
      }
      netWorthSeries.set(year, newBalance);
    }
    return netWorthSeries;
  }
}
