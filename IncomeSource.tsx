import { MonetaryValue } from "./MonetaryValue";

export default interface IncomeSource {
  income(year: number): MonetaryValue;
}