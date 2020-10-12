import { CurrencyCode } from "./CurrencyCode";
import { Expense } from "./Expense";
import Household from "./Household";
import HouseholdComponent from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";

export class FullHouseholdExpense implements Expense, HouseholdComponent {
  //TODO: do not hardcode
  expense(year: number): MonetaryValue {
    return {
      year: year,
      value: 30000,
      currency: CurrencyCode.GBP
    };
  }
  register(hh: Household): Household {
    hh.addExpense(this);
    return hh;
  }
}
