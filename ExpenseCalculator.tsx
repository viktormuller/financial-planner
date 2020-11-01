import React from "react";
import { Component } from "react";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import * as d3 from "d3-format";
import { Household } from "./Household";

export class ExpenseCalculator {
  household: Household;
  expenseSeries: Map<number, MonetaryValue> = new Map<number, MonetaryValue>();
  static rentSaving: number = 0.03; // 3% of homes purchase price assumed to be rent
  static childSupportMaxAge: number = 23;
  constructor(household: Household) {
    this.household = household;
  }

  /**
   * Returns expense for a given tax year.
   * Scale starting expense inline with adults joining and kids born and leaving the household.
   * Currently using the OECD's latest squareroot model.
   */
  expense(year: number): MonetaryValue {
    var startingExpense = this.household.startingExpense;
    var startingAdults = this.household.adults.filter(
      adult => adult.yearOfJoining <= this.household.startYear
    ).length;
    var startingChildren = this.household.children.yearsOfBirth.filter(
      yearOfBirth => yearOfBirth <= this.household.startYear
    ).length;
    var startingHouseholdEquivalent = Math.sqrt(
      startingAdults + startingChildren
    );

    var inYearAdults = this.household.adults.filter(
      adult => adult.yearOfJoining <= year
    ).length;
    //Assuming cost for Children for year 0 to 18, i.e. in 19 years
    var inYearChildren = this.household.children.yearsOfBirth.filter(
      (yearOfBirth: number) => {
        console.debug(
          "yearOfBirth +19: " +
            (yearOfBirth + ExpenseCalculator.childSupportMaxAge)
        );
        console.debug(
          "year < yearOfBirth + 19: " +
            (year < yearOfBirth + ExpenseCalculator.childSupportMaxAge)
        );
        return (
          yearOfBirth <= year &&
          year < yearOfBirth + ExpenseCalculator.childSupportMaxAge
        );
      }
    ).length;
    console.debug("In year children: " + inYearChildren);

    var inYearHouseholdEquivalent = Math.sqrt(inYearAdults + inYearChildren);

    var inYearExpense = new MonetaryValue(
      (startingExpense * inYearHouseholdEquivalent) /
        startingHouseholdEquivalent
    );
    if (
      this.household.home &&
      this.household.home.yearOfPurchase <= year &&
      this.household.home.yearOfPurchase > this.household.startYear
    ) {
      inYearExpense = inYearExpense.add(
        new MonetaryValue(
          -1 *
            ExpenseCalculator.rentSaving *
            this.household.home.purchasePrice.value
        )
      );
    }

    this.expenseSeries.set(year, inYearExpense);
    return inYearExpense;
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
