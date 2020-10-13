import { CurrencyCode } from "./CurrencyCode";
import { Expense } from "./Expense";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";

export class FullHouseholdExpense extends HouseholdComponent
  implements Expense {
  //TODO: do not hardcode GBP
  expense(year: number): MonetaryValue {
    return {
      value: 30000,
      currency: CurrencyCode.GBP
    };
  }
  register(hh: Household): Household {
    hh.addExpense(this);
    return hh;
  }
}
