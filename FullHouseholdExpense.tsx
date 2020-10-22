import React from "react";
import { Component } from "react";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import * as d3 from "d3-format";
import { Children, ChildrenInput } from "./Children";

export class FullHouseholdExpense extends HouseholdComponent {
  startingExpense: number = 30000;
  children: Children = new Children();

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
    this.onChange = this.onChange.bind(this);
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
        <Accordion.Toggle as={Card.Header} eventKey="expenses">
          Expenses
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="expenses">
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
                    onChange={this.onChange}
                  />
                </div>
              </Form.Group>
              <hr />

              <Accordion defaultActiveKey="current_members">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="current_members">
                    Current members
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="current_members">
                    <Card.Body>
                      <ChildrenInput
                        children={this.props.expense.children}
                        onChange={this.onChange}
                      />
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
