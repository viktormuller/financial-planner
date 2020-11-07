import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";
import { PensionStrategy } from "./PensionStrategy";
import { UKTax } from "./UKTax";

export class IncomeCalculator {
  taxCalculator: UKTax = new UKTax();
  pensionStrategy: PensionStrategy = new PensionStrategy();
  household: Household;
  incomeSeries: Map<number, MonetaryValue> = new Map<number, MonetaryValue>();

  constructor(household: Household) {
    this.household = household;
  }

  income(year: number): MonetaryValue {
    var ret: MonetaryValue = new MonetaryValue(0);

    for (let adult of this.household.adults) {
      var incomeFromJob =
        adult.yearOfJoining <= year && year <= adult.job.endYear
          ? adult.job.income(year)
          : new MonetaryValue(0);

      ret = ret.add(
        this.taxCalculator.tax(
          this.pensionStrategy.apply(adult, year, incomeFromJob)
        )
      );
    }

    ret = ret.add(this.household.afterTaxAccount.income(year));

    this.incomeSeries.set(year, ret);

    return ret;
  }
}
