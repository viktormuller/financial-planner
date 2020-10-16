import { CurrencyCode } from "./CurrencyCode";

export class MonetaryValue {
  currency: CurrencyCode;
  value: number;

  constructor(value: number, currency: CurrencyCode = CurrencyCode.GBP) {
    this.currency = currency;
    this.value = value;
  }

  //TODO: add conversion;
  add(amount: MonetaryValue): MonetaryValue {
    return new MonetaryValue(this.value + amount.value, this.currency);
  }
}
