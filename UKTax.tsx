import { MonetaryValue } from "./MonetaryValue";

const taxBrackets = [
  { threshold: 12500, rate: 0 },
  { threshold: 50000, rate: 0.2 },
  { threshold: 100000, rate: 0.4 },
  { threshold: 125000, rate: 0.6 },
  { threshold: 150000, rate: 0.4 },
  { threshold: Number.MAX_VALUE, rate: 0.45 }
];

const nIBrackets = [
  { threshold: 9500, rate: 0 },
  { threshold: 50000, rate: 0.12 },
  { threshold: Number.MAX_VALUE, rate: 0.02 }
];

export class UKTax {
  private applyBracket(preTaxIncome: MonetaryValue, brackets): MonetaryValue {
    var ret: MonetaryValue = new MonetaryValue(0);
    for (var i = 0; i < brackets.length; i++) {
      var curBracket = brackets[i];
      var prevBracketThreshold = i == 0 ? 0 : brackets[i - 1].threshold;
      var taxableInBracket = 0;

      taxableInBracket =
        Math.min(curBracket.threshold, preTaxIncome.value) -
        prevBracketThreshold;

      ret = ret.add(new MonetaryValue(taxableInBracket * curBracket.rate));
      //Stop iterating if current bracket threshold is greater or equal to the pretax income
      if (curBracket.threshold >= preTaxIncome.value) break;
    }

    return ret;
  }

  tax(preTaxIncome: MonetaryValue): MonetaryValue {
    var ret: MonetaryValue = new MonetaryValue(preTaxIncome.value);
    ret = ret.add(
      new MonetaryValue(-1 * this.applyBracket(preTaxIncome, taxBrackets).value)
    );
    ret = ret.add(
      new MonetaryValue(-1 * this.applyBracket(preTaxIncome, nIBrackets).value)
    );
    return ret;
  }
}
