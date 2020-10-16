import React from "react";
import { Component } from "react";
import { CurrencyCode } from "./CurrencyCode";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { IncomeSource } from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";

export default class Job extends HouseholdComponent implements IncomeSource {
  private startYear: number = new Date().getFullYear();
  private endYear: number;
  startingIncome: number = 50000;

  constructor(pStartYear?: number, pEndYear?: number) {
    super();
    if (pEndYear) this.endYear = pEndYear;
    if (pStartYear) this.startYear = pStartYear;
  }

  income(year: number): MonetaryValue {
    return new MonetaryValue(
      year <= this.endYear && year >= this.startYear ? this.startingIncome : 0
    );
  }
}

class JobProps {
  job: Job;
  onIncomeChange;
}

export class JobInputs extends Component<JobProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <label>
        Income:
        <input
          name="income"
          type="number"
          value={this.props.job.startingIncome}
          onChange={() => this.props.onIncomeChange(event, this.props.job)}
        />
      </label>
    );
  }
}
