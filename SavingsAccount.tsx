import React, { Component } from "react";
import { Asset } from "./Asset";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";

export class SavingsAccount extends Asset {
  interest: number = 0.02;
  private openingBalance: MonetaryValue;
  yearOfOpening: number;

  constructor(
    openingBalance: MonetaryValue = new MonetaryValue(0),
    pInterest: number = 0.02,
    year = 2020
  ) {
    super();
    this.closingValues.set(year, openingBalance);
    this.interest = pInterest;
    this.openingBalance = openingBalance;
    this.yearOfOpening = year;
  }

  income(year: number): MonetaryValue {
    var prevYearClosingBal: MonetaryValue = this.closingValue(year - 1);
    if (prevYearClosingBal) {
      return new MonetaryValue(
        prevYearClosingBal.value * this.interest,
        prevYearClosingBal.currency
      );
    } else {
      return new MonetaryValue(0);
    }
  }

  closingValue(year: number): MonetaryValue {
    var ret = this.closingValues.get(year);
    if (ret) return ret;
    else {
      ret = new MonetaryValue(0);
    }
    this.closingValues.set(year, ret);
    return ret;
  }

  getOpeningBalance(): MonetaryValue {
    return this.openingBalance;
  }

  setOpeningBalance(amount: MonetaryValue) {
    this.openingBalance = amount;
    this.setValue(this.yearOfOpening, this.openingBalance);
  }
}

class SavingsAccountProps {
  account: SavingsAccount;
  onChange;
  eventKey: string;
}

export class SavingsAccountInput extends Component<SavingsAccountProps> {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    this.props.account.setOpeningBalance(new MonetaryValue(event.target.value));
    this.props.onChange(event, this.props.account);
  }

  render() {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.eventKey}>
          After tax savings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.eventKey}>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>
                  Balance at the end of {this.props.account.yearOfOpening}
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="50000"
                  value={this.props.account.getOpeningBalance().value}
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
