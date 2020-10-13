import { CurrencyCode } from "./CurrencyCode";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { IncomeSource } from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";

export class SavingsAccount extends HouseholdComponent implements IncomeSource {
  private closingBalances: Map<number, MonetaryValue> = new Map<
    number,
    MonetaryValue
  >();
  private interest: number = 0.02;

  constructor(
    openingBalance?: MonetaryValue,
    pInterest: number = 0.02,
    year = new Date().getFullYear() - 1
  ) {
    super();
    this.closingBalances.set(
      year,
      openingBalance ? openingBalance : { value: 0, currency: CurrencyCode.GBP }
    );
    if (pInterest) this.interest = pInterest;
  }

  register(household: Household): Household {
    household.addIncomeSource(this);
    return household;
  }
  income(year: number): MonetaryValue {
    var prevYearClosingBal: MonetaryValue = this.closingBalances.get(year - 1);
    return {
      currency: prevYearClosingBal.currency,
      value: prevYearClosingBal.value * this.interest
    };
  }

  setClosingBalance(year: number, balance: MonetaryValue) {
    this.closingBalances.set(year, balance);
  }

  getClosingBalance(year: number): MonetaryValue {
    return this.closingBalances.get(year);
  }

  getAllClosingBalances(): Map<number, MonetaryValue> {
    return this.closingBalances;
  }
}
