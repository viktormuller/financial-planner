import React, { ChangeEvent, Component } from "react";
import { render } from "react-dom";
import {
  XAxis,
  YAxis,
  VerticalBarSeries,
  FlexibleWidthXYPlot,
  DiscreteColorLegend
} from "react-vis";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Household } from "./Household";
import Job, { JobInputs } from "./Job";
import { FullHHExpenseInput } from "./ExpenseCalculator";
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
import { Col, Container, Row } from "react-bootstrap";

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

    var children = new Children([]);

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
    console.debug("Invoking renderIncomeComponents");
    console.debug(
      "# of adults in household: " + this.state.household.adults.length
    );

    var ret = (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="income">
          Income
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="income">
          <Card.Body>
            <Form>
              {this.state.household.adults.map((adult, index) => (
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

  static convertToXY(inputData: Map<number, MonetaryValue>): any[] {
    const myData: any[] = new Array<any>();
    const entries = inputData.entries();
    for (let [year, amount] of entries) {
      myData.push({
        x: year,
        y: amount.value
      });
    }
    return myData;
  }

  renderNetWorth() {
    const myData: any[] = App.convertToXY(this.state.netWorthSeries);

    return (
      <FlexibleWidthXYPlot margin={{ left: 75, right: 75 }} height={240}>
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
    );
  }

  renderNetIncome() {
    var incomeSeries: any[] = App.convertToXY(
      this.calculator.incomes.incomeSeries
    );
    var expenseSeries: any[] = App.convertToXY(
      this.calculator.expenses.expenseSeries
    );
    return (
      <FlexibleWidthXYPlot margin={{ left: 75, right: 75 }} height={240}>
        <DiscreteColorLegend
          items={["Income", "Expense"]}
          orientation="vertical"
        />
        <VerticalBarSeries
          className="vertical-bar-series"
          data={incomeSeries}
          barWidth={0.8}
        />
        <VerticalBarSeries
          className="vertical-bar-series"
          data={expenseSeries}
          barWidth={0.8}
        />
        <XAxis title="Tax years" />
        <YAxis
          tickFormat={tick => d3.format(".2s")(tick)}
          title="Income / expense (GBP)"
        />
      </FlexibleWidthXYPlot>
    );
  }

  render() {
    return (
      <Container>
        <Row>
          <Col className="col-md-4">
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
          </Col>
          <Col className="col-md-8">
            <Container>
              <Row>{this.renderNetWorth()}</Row>
              <Row>{this.renderNetIncome()}</Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}

render(<App household={new Household()} />, document.getElementById("root"));
