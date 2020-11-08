import { Adult } from "./Adult";
import { CurrencyCode } from "./CurrencyCode";
import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";

//TODO: add lifetime lifetime allowance
//TODO: optimise contribution
//TODO: consider eligible amount
const UKAnnualAllowance = new MonetaryValue(40000, CurrencyCode.GBP);
const UKEmployeeMinContr = 0.05;
const UKEmployerMinContr = 0.03;

export class PensionStrategy {
  contributeToPension(
    earner: Adult,
    year: number,
    grossIncome: MonetaryValue
  ): { taxableIncome: MonetaryValue; pensionContribution: MonetaryValue } {
    var ret = {
      taxableIncome: new MonetaryValue(grossIncome.value, grossIncome.currency),
      pensionContribution: new MonetaryValue(0)
    };

    const contr: MonetaryValue = MonetaryValue.min(
      UKAnnualAllowance,
      grossIncome.multiply(UKEmployeeMinContr + UKEmployerMinContr)
    );
    const thisYearsClosingBalance = earner.pensionAccount
      .closingValue(year - 1)
      .add(earner.pensionAccount.income(year))
      .add(contr);
    earner.pensionAccount.setValue(year, thisYearsClosingBalance);
    ret.taxableIncome = grossIncome.subtract(
      grossIncome.multiply(UKEmployeeMinContr)
    );
    ret.pensionContribution = contr;

    return ret;
  }

  /**
   * Strategy: fund first equally from all available accounts. Then fund equally from accounts with remaining balances, repeat until balances run out or amount is fully funded.
   */
  //TODO tax withdrawals, add to income graph
  withdraw(hh: Household, amount: MonetaryValue, year: number): MonetaryValue {
    var unfundedBalance: MonetaryValue = new MonetaryValue(
      amount.value,
      amount.currency
    );

    console.log(
      "Trying to withdraw " + amount.value + " from pension accounts."
    );

    while (unfundedBalance.value > 0) {
      var fundingFound = new MonetaryValue(0, unfundedBalance.currency);

      var adultWithMinBalance: Adult = hh.adults.reduce(
        (min: Adult, cur: Adult) =>
          min.pensionAccount.closingValue(year) >
            cur.pensionAccount.closingValue(year) &&
          cur.pensionAccount.closingValue(year).value > 0
            ? cur
            : min
      );
      if (adultWithMinBalance) {
        var minBalance = adultWithMinBalance.pensionAccount.closingValue(year);
        for (let adult of hh.adults) {
          if (adult.pensionAccount.closingValue(year).value > 0) {
            adult.pensionAccount.addValue(year, minBalance);
            fundingFound = fundingFound.add(minBalance);
          }
        }
      }
      if (fundingFound.value <= 0) break;
      else unfundedBalance.subtract(fundingFound);
    }

    if (unfundedBalance.value > 0)
      console.debug("Unfunded balance: " + unfundedBalance.value);

    return unfundedBalance;
  }
}