import { MonetaryValue } from "./MonetaryValue";

export interface IncomeSource {
  income(year: number): MonetaryValue;
}