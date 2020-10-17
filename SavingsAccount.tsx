import React, { Component } from "react";
import { Asset } from "./Asset";
import { CurrencyCode } from "./CurrencyCode";
import { Household } from "./Household";
import { HouseholdComponent } from "./HouseholdComponent";
import { IncomeSource } from "./IncomeSource";
import { MonetaryValue } from "./MonetaryValue";

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
}

export class SavingsAccountInput extends Component<SavingsAccountProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <label>
        Opening balance:
        <input
          name="opening_balance"
          type="number"
          value={this.props.account.getOpeningBalance().value}
          onChange={() => this.props.onChange(event, this.props.account)}
        />
      </label>
    );
  }
}
