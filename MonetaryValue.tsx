import { CurrencyCode } from "./CurrencyCode";

export class MonetaryValue {
  currency: CurrencyCode;
  value: number;

  constructor(value: number, currency: CurrencyCode = CurrencyCode.GBP) {
    this.currency = currency;
    this.value = value;
  }

  static min(first: MonetaryValue, second: MonetaryValue): MonetaryValue {
    return first.value < second.value
      ? new MonetaryValue(first.value, first.currency)
      : new MonetaryValue(second.value, second.currency);
  }

  //TODO: add conversion;
  add(amount: MonetaryValue): MonetaryValue {
    return new MonetaryValue(this.value + amount.value, this.currency);
  }

  //TODO: add conversion;
  subtract(amount: MonetaryValue): MonetaryValue {
    return new MonetaryValue(this.value - amount.value, this.currency);
  }

  multiply(mutiplier: number): MonetaryValue {
    return new MonetaryValue(this.value * mutiplier, this.currency);
  }
}
