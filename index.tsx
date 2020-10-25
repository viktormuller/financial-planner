import React, { ChangeEvent, Component } from "react";
import { render } from "react-dom";
import {
  XAxis,
  YAxis,
  VerticalBarSeries,
  FlexibleWidthXYPlot
} from "react-vis";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Household } from "./Household";
import Job, { JobInputs } from "./Job";
import {
  FullHHExpenseInput,
  FullHouseholdExpense
} from "./FullHouseholdExpense";
import { SavingsAccountInput } from "./SavingsAccount";
import * as d3 from "d3-format";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Children } from "./Children";
import { HouseholdMembers } from "./HouseholdMembers";
import { Calculator } from "./Calculator";
import { Adult } from "./Adult";
import { MonetaryValue } from "./MonetaryValue";

interface AppProps {
  household: Household;
}
interface AppState {
  household: Household;
  netWorthSeries: Map<number, MonetaryValue>;
}

class App extends Component<AppProps, AppState> {
  recalcTimeout: number;
  calculator: Calculator;

  constructor(props) {
    super(props);
    var household = props.household;
    var headOfHH = new Adult();

    var job = new Job(2020, 2055);
    headOfHH.job = job;
    var adults = [headOfHH];

    var children = new Children([2022, 2024]);

    household.children = children;
    household.adults = adults;

    this.calculator = new Calculator(household);

    this.onChange = this.onChange.bind(this);
    this.state = {
      household: household,
      netWorthSeries: this.calculator.update()
    };
    this.recalcTimeout = 0;
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.recalcTimeout) clearTimeout(this.recalcTimeout);

    this.setState({ household: this.state.household });
    this.recalcTimeout = setTimeout(() => {
      this.setState({ netWorthSeries: this.calculator.update() });
    }, 500);
  }

  renderIncomeComponents(household: Household): JSX.Element {
    var ret = (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="income">
          Income
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="income">
          <Card.Body>
            <Form>
              {household.adults.map((adult, index) => (
                <JobInputs
                  job={adult.job}
                  onChange={this.onChange}
                  index={String(index + 1)}
                />
              ))}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
    return ret;
  }

  render() {
    const myData: any[] = new Array<any>();
    const netWorthSeriesEntries = this.state.netWorthSeries.entries();
    for (let [year, amount] of netWorthSeriesEntries) {
      myData.push({
        x: year,
        y: amount.value
      });
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Accordion defaultActiveKey="members">
              <HouseholdMembers
                household={this.state.household}
                onChange={this.onChange}
              />
              <FullHHExpenseInput
                household={this.state.household}
                onChange={this.onChange}
                eventKey="hh_expense"
              />
              {this.renderIncomeComponents(this.state.household)}
              <SavingsAccountInput
                account={this.state.household.afterTaxAccount}
                onChange={this.onChange}
                eventKey="savings"
              />
            </Accordion>
          </div>
          <div className="col-md-8">
            <FlexibleWidthXYPlot margin={{ left: 75, right: 75 }} height={480}>
              <VerticalBarSeries
                className="vertical-bar-series"
                data={myData}
                barWidth={0.8}
              />
              <XAxis title="Tax years" />
              <YAxis
                tickFormat={tick => d3.format(".2s")(tick)}
                title="Net worth (GBP)"
              />
            </FlexibleWidthXYPlot>
          </div>
        </div>
      </div>
    );
  }
}

render(<App household={new Household()} />, document.getElementById("root"));
