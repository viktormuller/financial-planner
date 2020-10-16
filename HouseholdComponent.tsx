import { Household } from "./Household";
import { v4 as uuidv4 } from "uuid";
import { MonetaryValue } from "./MonetaryValue";
import { CurrencyCode } from "./CurrencyCode";

export abstract class HouseholdComponent {
  id: string = uuidv4();
  pension(year: number): MonetaryValue {
    return new MonetaryValue(0);
  }
  income(year: number): MonetaryValue {
    return new MonetaryValue(0);
  }
  capitalGain(year: number): MonetaryValue {
    return new MonetaryValue(0);
  }
  expense(year: number): MonetaryValue {
    return new MonetaryValue(0);
  }
  closingValue(year: number): MonetaryValue {
    return new MonetaryValue(0);
  }
}
