import React from "react";
import { Component } from "react";
import { Household } from "./Household";

export interface InputFormProps {
  income: number;
  expense: number;
  onIncomeChange;
  onExpenseChange;
}

export class InputForm extends Component<InputFormProps> {
  constructor(props) {
    super(props);
  }

  handleChange(event) {
    var name: string = event.target.name;
    var state = {};
    switch (name) {
      case "income": {
        state = { income: event.target.value };
        break;
      }
      case "expense": {
        state = { expense: event.target.value };
        break;
      }
      default: {
        console.log("Unknown change event target: " + event.target.name);
      }
    }
  }

  render() {
    return (
      <form>
        <label>
          Income:
          <input
            name="income"
            type="number"
            value={this.props.income}
            onChange={this.props.onIncomeChange}
          />
        </label>
        <br />
      </form>
    );
  }
}
