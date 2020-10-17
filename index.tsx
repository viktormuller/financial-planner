import React, { ChangeEvent, Component } from "react";
import { render } from "react-dom";
import { XYPlot, XAxis, YAxis, VerticalBarSeries } from "react-vis";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MonetaryValue } from "./MonetaryValue";
import { Household } from "./Household";
import Job, { JobInputs } from "./Job";
import {
  FullHHExpenseInput,
  FullHouseholdExpense
} from "./FullHouseholdExpense";
import { HouseholdComponent } from "./HouseholdComponent";
import { SavingsAccount, SavingsAccountInput } from "./SavingsAccount";
import * as d3 from "d3-format";

interface AppProps {
  household: Household;
}
interface AppState {
  household: Household;
  recalcTimeout: number;
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    var household = props.household;

    var job = new Job(2020, 2055);
    household.addComponent(job);

    var hhExpense = new FullHouseholdExpense();
    household.addComponent(hhExpense);

    this.onChange = this.onChange.bind(this);
    household.update();
    this.state = {
      household: household,
      recalcTimeout: 0
    };
  }

  onChange(
    event: React.ChangeEvent<HTMLInputElement>,
    comp: HouseholdComponent
  ) {
    if (this.state.recalcTimeout) clearTimeout(this.state.recalcTimeout);
    switch (comp.constructor) {
      case Job: {
        (comp as Job).startingIncome = Number(event.target.value);
        break;
      }
      case FullHouseholdExpense: {
        (comp as FullHouseholdExpense).startingExpense = Number(
          event.target.value
        );
        break;
      }
      case SavingsAccount: {
        console.debug("Change to SavingsAccount: " + event.target.value);
        (comp as SavingsAccount).setOpeningBalance(
          new MonetaryValue(Number(event.target.value))
        );
        break;
      }
    }
    this.setState({
      household: this.state.household,
      recalcTimeout: setTimeout(() => {
        this.state.household.update();
        this.setState({ household: this.state.household });
      }, 500)
    });
  }

  renderHouseholdComponent(comp: HouseholdComponent): JSX.Element {
    var ret = <div />;

    switch (comp.constructor) {
      case Job: {
        ret = (
          <div>
            <JobInputs job={comp as Job} onChange={this.onChange} />
          </div>
        );
        break;
      }
      case FullHouseholdExpense: {
        ret = (
          <div>
            <FullHHExpenseInput
              expense={comp as FullHouseholdExpense}
              onChange={this.onChange}
            />
          </div>
        );
        break;
      }
      case SavingsAccount: {
        ret = (
          <div>
            <SavingsAccountInput
              account={comp as SavingsAccount}
              onChange={this.onChange}
            />
          </div>
        );
        break;
      }
      default: {
        ret = <div />;
      }
    }

    return ret;
  }

  render() {
    const myData: any[] = new Array<any>();
    const netWorthSeriesEntries = this.state.household
      .netWorthSeries()
      .entries();
    for (let [year, amount] of netWorthSeriesEntries) {
      myData.push({
        x: year,
        y: amount.value
      });
    }

    return (
      <div className="grid-container">
        <div className="item1">
          {Array.from(this.state.household.hhComponents.values()).map(
            this.renderHouseholdComponent,
            this
          )}
        </div>
        <div className="item2">
          <XYPlot margin={{ left: 75, right: 75 }} width={800} height={600}>
            <VerticalBarSeries
              className="vertical-bar-series"
              data={myData}
              barWidth={0.8}
            />
            <XAxis />
            <YAxis tickFormat={tick => d3.format(".2s")(tick)} />
          </XYPlot>
        </div>
      </div>
    );
  }
}

render(<App household={new Household()} />, document.getElementById("root"));
