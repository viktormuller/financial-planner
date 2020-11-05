import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";
import { UKTax } from "./UKTax";

export class IncomeCalculator {
  taxCalculator: UKTax = new UKTax();
  household: Household;
  incomeSeries: Map<number, MonetaryValue> = new Map<number, MonetaryValue>();

  constructor(household: Household) {
    this.household = household;
  }

  income(year: number): MonetaryValue {
    var ret: MonetaryValue = new MonetaryValue(0);

    for (let adult of this.household.adults) {
      if (adult.yearOfJoining <= year && year <= adult.job.endYear) {
        ret = ret.add(this.taxCalculator.tax(adult.job.income(year)));
      }
    }

    ret = ret.add(this.household.afterTaxAccount.income(year));

    this.incomeSeries.set(year, ret);

    return ret;
  }
}
