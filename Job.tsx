import { CurrencyCode } from "./CurrencyCode";
import Household from "./Household";
import HouseholdComponent from "./HouseholdComponent";
import IncomeSource from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";

export default class Job implements IncomeSource, HouseholdComponent {
  income(year: number): MonetaryValue {
    return {
      currency: CurrencyCode.GBP,
      value: 50000
    }
  }
  register(household: Household) {
    household.addIncomeSource(this);
  }
}
