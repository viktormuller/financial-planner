import React from "react";
import { Component } from "react";
import { CurrencyCode } from "./CurrencyCode";
import { Expense } from "./Expense";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";

export class FullHouseholdExpense extends HouseholdComponent
  implements Expense {
  startingExpense: number = 30000;

  expense(year: number): MonetaryValue {
    return new MonetaryValue(this.startingExpense);
  }
}

class FullHHExpenseProps {
  expense: FullHouseholdExpense;
  onIncomeChange;
}

export class FullHHExpenseInput extends Component<FullHHExpenseProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <label>
        Expense:
        <input
          name="expense"
          type="number"
          value={this.props.expense.startingExpense}
          onChange={() => this.props.onIncomeChange(event, this.props.expense)}
        />
      </label>
    );
  }
}
