import { Adult } from "./Adult";
import { CurrencyCode } from "./CurrencyCode";
import { Household } from "./Household";
import { MonetaryValue } from "./MonetaryValue";
import { UKTax } from "./UKTax";

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
    grossIncome: MonetaryValue,
    expenses: MonetaryValue,
    taxCalc: UKTax
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
  /** Optimally reduces pension balances of all pensioners to withdraw enough for the net amount after tax. Returns the net, taxed amount  */
  withdrawNet(
    hh: Household,
    netAmount: MonetaryValue,
    year: number,
    taxCalc: UKTax
  ) {
    console.log(
      "Trying to withdraw net " + netAmount.value + " from pension accounts."
    );

    var fundingFound = new MonetaryValue(0, netAmount.currency);

    var pensioners: Adult[] = hh.pensioners(year);

    while (fundingFound.value < netAmount.value) {
      var netRemainingToWithdraw = netAmount.subtract(fundingFound);
      console.debug(
        "Net amount remaining for withdrawal: " + netRemainingToWithdraw.value
      );

      var pensionersWithBalance = pensioners.filter(
        pensioner => pensioner.pensionAccount.closingValue(year).value > 0
      );
      if (pensionersWithBalance.length > 0) {
        var adultWithMinBalance: Adult = pensionersWithBalance.reduce(
          (min: Adult, cur: Adult) =>
            min.pensionAccount.closingValue(year).value >
              cur.pensionAccount.closingValue(year).value &&
            cur.pensionAccount.closingValue(year).value > 0
              ? cur
              : min
        );
        pensionersWithBalance.map((pensioner, index) =>
          console.debug(
            "Pensioner " +
              index +
              " balance: " +
              pensioner.pensionAccount.closingValue(year).value +
              " "
          )
        );

        var minBalance = adultWithMinBalance.pensionAccount.closingValue(year);

        console.debug("Min balance: " + minBalance.value);
        var amtToWithdrawPerPensioner = MonetaryValue.min(
          minBalance,
          taxCalc.grossForNet(
            netRemainingToWithdraw.multiply(1 / pensionersWithBalance.length)
          )
        );

        console.debug(
          "Gross amount to withdraw per pensioner: " +
            amtToWithdrawPerPensioner.value
        );

        for (let pensioner of pensioners) {
          if (pensioner.pensionAccount.closingValue(year).value > 0) {
            pensioner.pensionAccount.addValue(
              year,
              amtToWithdrawPerPensioner.multiply(-1)
            );
            fundingFound = fundingFound.add(
              taxCalc.tax(amtToWithdrawPerPensioner)
            );
            console.debug("Net funding found: " + fundingFound.value);
          }
        }
      } else {
        console.debug("No more pension left, terminating loop.");

        break;
      }
    }

    if (fundingFound.value < netAmount.value)
      console.debug(
        "Unfunded balance: " + (netAmount.value - fundingFound.value)
      );

    console.debug("Withdrawn " + fundingFound.value);

    return fundingFound;
  }

  /**
   * Strategy: fund first equally from all available accounts. Then fund equally from accounts with remaining balances, repeat until balances run out or amount is fully funded.
   */
  withdraw(hh: Household, amount: MonetaryValue, year: number): MonetaryValue {
    console.log(
      "Trying to withdraw " + amount.value + " from pension accounts."
    );

    var fundingFound = new MonetaryValue(0, amount.currency);

    var pensioners: Adult[] = hh.pensioners(year);

    while (fundingFound.value < amount.value) {
      var amountToWithdraw = amount.subtract(fundingFound);
      var pensionersWithBalance = pensioners.filter(
        pensioner => pensioner.pensionAccount.closingValue(year).value > 0
      );
      if (pensionersWithBalance.length > 0) {
        var adultWithMinBalance: Adult = pensionersWithBalance.reduce(
          (min: Adult, cur: Adult) =>
            min.pensionAccount.closingValue(year).value >
              cur.pensionAccount.closingValue(year).value &&
            cur.pensionAccount.closingValue(year).value > 0
              ? cur
              : min
        );
        pensionersWithBalance.map((pensioner, index) =>
          console.debug(
            "Pensioner " +
              index +
              " balance: " +
              pensioner.pensionAccount.closingValue(year).value +
              " "
          )
        );

        var minBalance = adultWithMinBalance.pensionAccount.closingValue(year);

        console.debug("Min balance: " + minBalance.value);
        var amtToWithdrawPerPensioner = MonetaryValue.min(
          minBalance,
          amountToWithdraw.multiply(1 / pensionersWithBalance.length)
        );

        console.debug(
          "Amount to withdraw per pensioner: " + amtToWithdrawPerPensioner.value
        );

        for (let pensioner of pensioners) {
          if (pensioner.pensionAccount.closingValue(year).value > 0) {
            pensioner.pensionAccount.addValue(
              year,
              amtToWithdrawPerPensioner.multiply(-1)
            );
            fundingFound = fundingFound.add(amtToWithdrawPerPensioner);
            console.debug("Funding found: " + fundingFound.value);
          }
        }
      } else {
        console.debug("No more pension left, terminating loop.");

        break;
      }
    }

    if (fundingFound.value < amount.value)
      console.debug("Unfunded balance: " + (amount.value - fundingFound.value));

    console.debug("Withdrawn " + fundingFound.value);

    return fundingFound;
  }
}
