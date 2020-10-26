import { MonetaryValue } from "./MonetaryValue";

export class Asset {
  protected closingValues: Map<number, MonetaryValue> = new Map<
    number,
    MonetaryValue
  >();

  closingValue(year: number): MonetaryValue {
    return this.closingValues.get(year);
  }
  addValue(year: number, amount: MonetaryValue) {
    var value = this.closingValues.get(year);
    if (value) {
      this.closingValues.set(year, value.add(amount));
    } else {
      this.closingValues.set(year, amount);
    }
  }

  setValue(year: number, amount: MonetaryValue) {
    this.closingValues.set(year, amount);
  }

  allClosingValues(): Map<number, MonetaryValue> {
    return this.closingValues;
  }
}
