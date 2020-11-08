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
    console.log(
      "Trying to withdraw " + amount.value + " from pension accounts."
    );

    var fundingFound = new MonetaryValue(0, amount.currency);

    var pensioners: Adult[] = hh.pensioners(year);
    /*
    while (fundingFound.value < amount.value) {
      var adultWithMinBalance: Adult = pensioners.reduce(
        (min: Adult, cur: Adult) =>
          min.pensionAccount.closingValue(year) >
            cur.pensionAccount.closingValue(year) &&
          cur.pensionAccount.closingValue(year).value > 0
            ? cur
            : min
      );

      if (adultWithMinBalance) {
        console.debug(
          "Adult with min Balnace found: " +
            adultWithMinBalance.pensionAccount.closingValue(year).value
        );
        /* var minBalance = adultWithMinBalance.pensionAccount.closingValue(year);
        for (let pensioner of pensioners) {
          if (pensioner.pensionAccount.closingValue(year).value > 0) {
            pensioner.pensionAccount.addValue(year, minBalance.multiply(-1));
            fundingFound = fundingFound.add(minBalance);
          }
        }
      } else {
        console.debug("No more pension left, terminating loop.");

        break;
      }
    }*/

    if (fundingFound.value < amount.value)
      console.debug("Unfunded balance: " + (amount.value - fundingFound.value));

    console.debug("Withdrawn " + fundingFound.value);

    return fundingFound;
  }
}
