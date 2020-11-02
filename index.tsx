import React, { ChangeEvent, Component } from "react";
import { render } from "react-dom";
import {
  XAxis,
  YAxis,
  VerticalBarSeries,
  FlexibleWidthXYPlot,
  DiscreteColorLegend,
  Hint
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
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { PropertyInput } from "./Property";

interface AppProps {
  household: Household;
}
interface AppState {
  household: Household;
  netWorthSeries: Map<number, MonetaryValue>;
  netWorthHint: Object;
  netWorthHintEnabled: boolean;
}

function hintFormatter(data) {
  return [
    {
      title: "Net worth in " + data.x,
      value: "GBP " + d3.format(".2s")(data.y)
    }
  ];
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
      netWorthSeries: this.calculator.update(),
      netWorthHint: {},
      netWorthHintEnabled: false
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

  renderIncomeComponents(): JSX.Element {
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

  onValueMouseOver(value, event) {
    this.setState({ netWorthHint: value, netWorthHintEnabled: true });
  }

  onSeriesMouseOut(info) {
    this.setState({ netWorthHintEnabled: false });
  }

  renderNetWorth() {
    const myData: any[] = App.convertToXY(this.state.netWorthSeries);

    return (
      <FlexibleWidthXYPlot margin={{ left: 75, right: 75 }} height={220}>
        <VerticalBarSeries
          className="vertical-bar-series"
          data={myData}
          barWidth={0.8}
          onValueMouseOver={this.onValueMouseOver.bind(this)}
          onSeriesMouseOut={this.onSeriesMouseOut.bind(this)}
        />
        <XAxis title="Tax years" tickFormat={tick => d3.format(".0f")(tick)} />
        <YAxis
          tickFormat={tick => d3.format(".2s")(tick)}
          title="Net worth (GBP)"
        />
        {this.state.netWorthHintEnabled && (
          <Hint value={this.state.netWorthHint} format={hintFormatter} />
        )}
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
      <FlexibleWidthXYPlot margin={{ left: 75, right: 75 }} height={220}>
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
        <XAxis title="Tax years" tickFormat={tick => d3.format(".0f")(tick)} />
        <YAxis
          tickFormat={tick => d3.format(".2s")(tick)}
          title="Income / expense (GBP)"
        />
      </FlexibleWidthXYPlot>
    );
  }

  renderAssets() {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="assets">
          Things you own (Assets)
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="assets">
          <Card.Body>
            <Form>
              <PropertyInput
                property={this.state.household.home}
                onChange={this.onChange}
              />
              <hr />
              <SavingsAccountInput
                account={this.state.household.afterTaxAccount}
                onChange={this.onChange}
              />
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  render() {
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>How much is enough?</Navbar.Brand>
        </Navbar>
        <Container className="mt-2">
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
                {this.renderIncomeComponents()}
                {this.renderAssets()}
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
      </React.Fragment>
    );
  }
}

render(<App household={new Household()} />, document.getElementById("root"));
