import React, { Component } from "react";
import { Asset } from "./Asset";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import * as d3 from "d3-format";

export class SavingsAccount extends Asset {
  interest: number = 0.02;
  private openingBalance: MonetaryValue;
  yearOfOpening: number;

  constructor(
    openingBalance: MonetaryValue = new MonetaryValue(0),
    year = 2019,
    pInterest: number = 0.02
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
  //eventKey: string;
}

export class SavingsAccountInput extends Component<SavingsAccountProps> {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    this.props.account.setOpeningBalance(
      new MonetaryValue(Number(event.target.value.replace(/,/g, "")))
    );
    this.props.onChange(event, this.props.account);
  }

  render() {
    return (
      /* <Card>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.eventKey}>
          Savings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.eventKey}>
          <Card.Body>
            <Form>*/
      <Form.Group>
        <div className="row">
          <Form.Label className="col-md-8">
            Balance at the end of {this.props.account.yearOfOpening}
          </Form.Label>
          <Form.Control
            className="col-md-4 text-right"
            type="text"
            placeholder="50000"
            value={d3.format(",")(this.props.account.getOpeningBalance().value)}
            onChange={this.onChange.bind(this)}
          />
        </div>
      </Form.Group>
      /*   </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>*/
    );
  }
}
