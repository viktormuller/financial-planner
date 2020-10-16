import { Asset } from "./Asset";
import { CurrencyCode } from "./CurrencyCode";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { IncomeSource } from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";

export class SavingsAccount extends Asset {
  private interest: number = 0.02;

  constructor(
    openingBalance?: MonetaryValue,
    pInterest: number = 0.02,
    year = new Date().getFullYear() - 1
  ) {
    super();
    this.closingValues.set(
      year,
      openingBalance ? openingBalance : new MonetaryValue(0)
    );
    if (pInterest) this.interest = pInterest;
  }

  income(year: number): MonetaryValue {
    var prevYearClosingBal: MonetaryValue = this.closingValues.get(year - 1);
    if (prevYearClosingBal) {
      return new MonetaryValue(
        prevYearClosingBal.value * this.interest,
        prevYearClosingBal.currency
      );
    } else {
      return new MonetaryValue(0);
    }
  }

  closingValue(year: number): MonetaryValue {
    var ret = this.closingValues.get(year);
    if (ret) return ret;
    else {
      ret = new MonetaryValue(0);
    }
    this.closingValues.set(year, ret);
    return ret;
  }
}
