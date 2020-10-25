import { Adult } from "./Adult";
import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";

export class IncomeCalculator {
  household: Household;

  constructor(household: Household) {
    this.household = household;
  }

  income(year: number) {
    var ret: MonetaryValue = new MonetaryValue(0);

    for (let adult of this.household.adults) {
      if (adult.yearOfJoining <= year && year <= adult.job.endYear)
        ret = ret.add(adult.job.income(year));
    }

    ret = ret.add(this.household.afterTaxAccount.income(year));

    return ret;
  }
}
