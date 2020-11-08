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
    console.debug("Sources of income for year: " + year);
    var ret: MonetaryValue = new MonetaryValue(0);
    var incomeSeriesEntry: MonetaryValue = new MonetaryValue(0);

    for (let adult of this.household.adults) {
      var incomeFromJob =
        adult.yearOfJoining <= year && year <= adult.job.endYear
          ? adult.job.income(year)
          : new MonetaryValue(0);

      /*var pension = {
        taxableIncome: incomeFromJob,
        pensionContribution: new MonetaryValue(0)
      }; */
      var pension = this.pensionStrategy.contributeToPension(
        adult,
        year,
        incomeFromJob
      );

      var netIncomeFromJob = this.taxCalculator.tax(pension.taxableIncome);

      ret = ret.add(netIncomeFromJob);
      console.debug("Gross income from job: " + incomeFromJob.value);
      console.debug("Taxable income from job: " + pension.taxableIncome.value);
      console.debug("Net income from job: " + netIncomeFromJob.value);
      console.debug(
        "Pension contribution: " + pension.pensionContribution.value
      );
      console.debug(
        "Pension return: " + adult.pensionAccount.income(year).value
      );
      incomeSeriesEntry = incomeSeriesEntry
        .add(netIncomeFromJob)
        .add(pension.pensionContribution)
        .add(adult.pensionAccount.income(year));
    }

    ret = ret.add(this.household.afterTaxAccount.income(year));
    incomeSeriesEntry = incomeSeriesEntry.add(
      this.household.afterTaxAccount.income(year)
    );

    console.debug(
      "After tax savings return: " +
        this.household.afterTaxAccount.income(year).value
    );

    this.incomeSeries.set(year, incomeSeriesEntry);

    return ret;
  }
}
