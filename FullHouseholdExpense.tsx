import React from "react";
import { Component } from "react";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";

export class FullHouseholdExpense extends HouseholdComponent {
  startingExpense: number = 30000;

  expense(year: number): MonetaryValue {
    return new MonetaryValue(this.startingExpense);
  }
}

class FullHHExpenseProps {
  expense: FullHouseholdExpense;
  onChange;
  eventKey: string;
}

export class FullHHExpenseInput extends Component<FullHHExpenseProps> {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    this.props.expense.startingExpense = event.target.value;
    this.props.onChange(event, this.props.expense);
  }

  render() {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.eventKey}>
          Expenses
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.eventKey}>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Annual expense</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="30000"
                  value={this.props.expense.startingExpense}
                  onChange={this.onChange.bind(this)}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
