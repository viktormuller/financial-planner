import React from "react";
import { Component } from "react";
import { CurrencyCode } from "./CurrencyCode";
import { Expense } from "./Expense";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export class FullHouseholdExpense extends HouseholdComponent
  implements Expense {
  startingExpense: number = 30000;

  expense(year: number): MonetaryValue {
    return new MonetaryValue(this.startingExpense);
  }
}

class FullHHExpenseProps {
  expense: FullHouseholdExpense;
  onChange;
}

export class FullHHExpenseInput extends Component<FullHHExpenseProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card>
        <Card.Header>Expense</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>Annual expense</Form.Label>
              <Form.Control
                type="number"
                placeholder="30000"
                value={this.props.expense.startingExpense}
                onChange={() => this.props.onChange(event, this.props.expense)}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    );
  }
  /*
  render() {
    return (
      <label>
        Expense:
        <input
          name="expense"
          type="number"
          value={this.props.expense.startingExpense}
          onChange={() => this.props.onChange(event, this.props.expense)}
        />
      </label>
    );
  }*/
}
