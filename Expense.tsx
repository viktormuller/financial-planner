import { MonetaryValue } from "./MonetaryValue";

export interface Expense{
  expense(year: number): MonetaryValue;
}

