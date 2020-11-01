import { Adult } from "./Adult";
import { Children } from "./Children";
import { MonetaryValue } from "./MonetaryValue";
import { Property } from "./Property";

import { SavingsAccount } from "./SavingsAccount";

export class Household {
  afterTaxAccount: SavingsAccount = new SavingsAccount();
  children: Children = new Children([]);
  adults: Adult[] = [new Adult()];
  startingExpense: number = 30000;
  startYear = new Date().getFullYear();
  endYear = new Date().getFullYear() + 80;
  home: Property = new Property(
    new Date().getFullYear() + 10,
    new MonetaryValue(300000)
  );
}
