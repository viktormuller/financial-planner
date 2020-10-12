import { CurrencyCode } from "./CurrencyCode";
import Household from "./Household";
import HouseholdComponent from "./HouseholdComponent";
import {IncomeSource} from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";

export default class Job implements IncomeSource, HouseholdComponent {
  private startYear: number = new Date().getFullYear();
  private endYear: number;

  constructor (pStartYear?: number, pEndYear?: number){
    if (pEndYear)
      this.endYear = pEndYear;
    if (pStartYear)
      this.startYear = pStartYear;
  }
  
  income(year: number): MonetaryValue {
    return {
      currency: CurrencyCode.GBP,
      value: (year <= this.endYear && year >= this.startYear ? 30000 : 0 )
    }
  }
  register(household: Household) {
    household.addIncomeSource(this);
  }
}
