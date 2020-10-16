import { CurrencyCode } from "./CurrencyCode";
import { Expense } from "./Expense";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";

export class FullHouseholdExpense extends HouseholdComponent
  implements Expense {
  //TODO: do not hardcode GBP
  expense(year: number): MonetaryValue {
    return new MonetaryValue(30000);
  }
}
