import React from "react";
import { Component } from "react";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import * as d3 from "d3-format";

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
    this.props.expense.startingExpense = Number(
      event.target.value.replace(/,/g, "")
    );
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
                <div className="row">
                  <Form.Label className="col-md-8">Annual expense</Form.Label>
                  <Form.Control
                    className="col-md-4 text-right"
                    type="text"
                    placeholder="30000"
                    value={d3.format(",")(this.props.expense.startingExpense)}
                    onChange={this.onChange.bind(this)}
                  />
                </div>
              </Form.Group>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
