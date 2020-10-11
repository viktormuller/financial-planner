import { CurrencyCode } from "./CurrencyCode";
import IncomeSource from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";

export default class Household {
  private incomeSources: IncomeSource[] = new Array<IncomeSource>();
  private startYear = 2021;
  private endYear = 2121;
  private startingNetWorth = 0;

  addIncomeSource(incomeSource: IncomeSource) {
    this.incomeSources.push(incomeSource);
  }

  netWorthSeries(): Array<MonetaryValue> {
    var ret: MonetaryValue[] = new Array<MonetaryValue>();
    ret.push({
      year: this.startYear - 1,
      currency: CurrencyCode.GBP,
      value: this.startingNetWorth
    });
    for (var year = this.startYear; year < this.endYear + 1; year++) {
      //TODO: use Household default currency instead of hardcoded GBP
      var incomeForYear = { year: year, currency: CurrencyCode.GBP, value: 0 };
      for (let incomeSource of this.incomeSources) {
        //TODO: convert currency if needed
        incomeForYear.value += incomeSource.income(year).value;
      }
      var netWorthForYear = {
        year: year,
        currency: CurrencyCode.GBP,
        value: ret[ret.length - 1].value + incomeForYear.value
      };
      ret.push(netWorthForYear);
    }
    return ret;
  }
}
