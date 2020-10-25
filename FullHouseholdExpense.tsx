import React from "react";
import { Component } from "react";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import * as d3 from "d3-format";
import { Household } from "./Household";

export class FullHouseholdExpense {
  household: Household;

  constructor(household: Household) {
    this.household = household;
  }

  expense(year: number): MonetaryValue {
    return new MonetaryValue(this.household.startingExpense);
  }

  setStartingExpense(startingExpense: number) {
    this.household.startingExpense = startingExpense;
  }

  getStartingExpense() {
    return this.household.startingExpense;
  }
}

class FullHHExpenseProps {
  household: Household;
  onChange;
  eventKey: string;
}

export class FullHHExpenseInput extends Component<FullHHExpenseProps> {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.household.startingExpense = Number(
      event.target.value.replace(/,/g, "")
    );
    this.props.onChange(event, this.props.household);
  }

  render() {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="expenses">
          Expenses
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="expenses">
          <Card.Body>
            <Form>
              <Form.Group>
                <div className="row">
                  <Form.Label className="col-md-8">
                    Annual expense today
                  </Form.Label>
                  <Form.Control
                    className="col-md-4 text-right"
                    type="text"
                    placeholder="30000"
                    value={d3.format(",")(this.props.household.startingExpense)}
                    onChange={this.onChange}
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
