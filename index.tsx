import React, { ChangeEvent, Component } from "react";
import { render } from "react-dom";
import { XYPlot, XAxis, YAxis, VerticalBarSeries } from "react-vis";
import findDomain from "./utils";
import "./style.css";
import { MonetaryValue } from "./MonetaryValue";
import { Household } from "./Household";
import Job, { JobInputs } from "./Job";
import { FullHouseholdExpense } from "./FullHouseholdExpense";
import { InputForm } from "./InputForm";

interface AppProps {
  household: Household;
}
interface AppState {
  name: string;
  household: Household;
}

class App extends Component<AppProps, AppState> {
  //TODO: refactor this to be dynamically loaded from household
  private job: Job;
  constructor(props) {
    super(props);
    var household = props.household;
    var job = new Job(2020, 2055);
    var hhExpense = new FullHouseholdExpense();
    job.register(household);
    hhExpense.register(household);
    this.job = job;

    this.state = {
      name: "React",
      household: household
    };
    this.onIncomeChange.bind(this);
  }

  onIncomeChange(event: React.ChangeEvent<HTMLInputElement>, job: Job) {
    job.startingIncome = Number(event.target.value);
    var newHH: Household = this.state.household;
    this.setState({ household: newHH });
  }

  render() {
    const myData: any[] = new Array<any>();
    const netWorthSeriesEntries = this.state.household
      .netWorthSeries()
      .entries();
    for (let netWorthPoint of netWorthSeriesEntries) {
      myData.push({
        x: netWorthPoint[0],
        y: netWorthPoint[1].value
      });
    }
    return (
      <div>
        <div>
          <JobInputs job={this.job} onIncomeChange={this.onIncomeChange} />
        </div>
        <div>
          <XYPlot margin={{ left: 75 }} width={800} height={600}>
            <VerticalBarSeries
              className="vertical-bar-series"
              data={myData}
              barWidth={0.8}
            />
            <XAxis />
            <YAxis />
          </XYPlot>
        </div>
      </div>
    );
  }
}

render(<App household={new Household()} />, document.getElementById("root"));
