import { Adult } from "./Adult";
import { Children } from "./Children";

import { SavingsAccount } from "./SavingsAccount";

export class Household {
  afterTaxAccount: SavingsAccount = new SavingsAccount();
  children: Children = new Children([]);
  adults: Adult[] = [new Adult()];
  startingExpense: number = 30000;
}
