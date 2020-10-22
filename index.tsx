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
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Children, ChildrenInput } from "./Children";

interface AppProps {
  household: Household;
}
interface AppState {
  household: Household;
}

class App extends Component<AppProps, AppState> {
  recalcTimeout: number;

  constructor(props) {
    super(props);
    var household = props.household;

    var job = new Job(2020, 2055);
    household.addComponent(job);
    var children = new Children();
    children.yearsOfBirth = [2022, 2024];
    household.addComponent(children);

    var hhExpense = new FullHouseholdExpense();
    household.addComponent(hhExpense);

    hhExpense.children = children;

    this.onChange = this.onChange.bind(this);
    this.addJob = this.addJob.bind(this);
    household.update();
    this.state = {
      household: household
    };
    this.recalcTimeout = 0;
  }

  onChange(
    event: React.ChangeEvent<HTMLInputElement>,
    comp: HouseholdComponent
  ) {
    if (this.recalcTimeout) clearTimeout(this.recalcTimeout);

    this.setState({ household: this.state.household });
    this.recalcTimeout = setTimeout(() => {
      this.state.household.update();
      this.setState({ household: this.state.household });
    }, 500);
  }

  addJob() {
    var job = new Job(2020, 2055);
    this.state.household.addComponent(job);
    this.setState({ household: this.state.household });
  }

  renderIncomeComponents(
    hhComponents: Map<string, HouseholdComponent>,
    index: string = "0"
  ): JSX.Element {
    var ret = (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={index}>
          Income
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={index}>
          <Card.Body>
            <Form>
              {Array.from(hhComponents.values()).map(
                (comp: HouseholdComponent, index) =>
                  comp instanceof Job ? (
                    <JobInputs
                      job={comp as Job}
                      onChange={this.onChange}
                      index={String(index)}
                    />
                  ) : (
                    ""
                  )
              )}
              <div className="row">
                <Button variant="outline-secondary" block onClick={this.addJob}>
                  Add another job
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
    return ret;
  }

  renderHouseholdComponent(
    comp: HouseholdComponent,
    index: number
  ): JSX.Element {
    var ret = <div />;

    switch (comp.constructor) {
      case FullHouseholdExpense: {
        ret = (
          <div>
            <FullHHExpenseInput
              expense={comp as FullHouseholdExpense}
              onChange={this.onChange}
              eventKey={String(index)}
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
              eventKey={String(index)}
            />
          </div>
        );
        break;
      }
      case Children: {
        ret = (
          <ChildrenInput
            children={comp as Children}
            onChange={this.onChange}
            eventKey={String(index)}
          />
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
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <Accordion defaultActiveKey="0">
              {this.renderIncomeComponents(this.state.household.hhComponents)}
              {Array.from(this.state.household.hhComponents.values()).map(
                this.renderHouseholdComponent,
                this
              )}
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
