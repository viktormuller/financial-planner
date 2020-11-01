import { MonetaryValue } from "./MonetaryValue";

export class Property {
  yearOfPurchase: number = new Date().getFullYear() + 10;
  purchasePrice: MonetaryValue = new MonetaryValue(500000);

  constructor(yearOfPurchase?: number, purchasePrice?: MonetaryValue) {
    if (yearOfPurchase) this.yearOfPurchase = yearOfPurchase;
    if (purchasePrice) this.purchasePrice = purchasePrice;
  }
}
