import React, { Component } from "react";
import {
  Accordion,
  Card,
  Col,
  Form,
  FormGroup,
  Row,
  ToggleButton,
  ToggleButtonGroup
} from "react-bootstrap";
import { Adult } from "./Adult";
import { Children, ChildrenInput } from "./Children";
import { Household } from "./Household";

interface HouseholdMembersProps {
  household: Household;
  onChange;
}

interface HouseholdMembersState {
  household: Household;
  currentAdults: Adult[];
  futureAdults: Adult[];
}

export class HouseholdMembers extends Component<
  HouseholdMembersProps,
  HouseholdMembersState
> {
  constructor(props) {
    super(props);
    if (this.props.household.adults) {
      var currentAdults = this.props.household.adults.filter(
        adult => adult.yearOfJoining < 0
      );
      var futureAdults = this.props.household.adults.filter(
        adult => adult.yearOfJoining >= 0
      );
    }

    this.state = {
      household: this.props.household,
      currentAdults: currentAdults,
      futureAdults: futureAdults
    };
  }

  //TODO: refactor this into the expense calculator
  scaleStartingExpense(oldMembers: number, newMembers: number) {
    this.state.household.startingExpense =
      Math.round(
        (this.state.household.startingExpense * Math.sqrt(newMembers)) /
          Math.sqrt(oldMembers) /
          1000
      ) * 1000;
  }

  onCurrentAdultsChanged(value) {
    console.debug(
      "Updating number of Adults from: " + this.state.household.adults.length
    );
    console.debug("New target number of current adults: " + value);
    var adultsToAdd = Math.max(0, value - this.state.currentAdults.length);
    var adultsToRemove = Math.max(0, this.state.currentAdults.length - value);

    var newAdultsArray = new Array(...this.state.currentAdults);

    var currentMembers =
      this.state.household.adults.length +
      this.state.household.children.yearsOfBirth.length;

    this.scaleStartingExpense(
      currentMembers,
      currentMembers + adultsToAdd - adultsToRemove
    );

    for (let i: number = 0; i < adultsToAdd; i++) {
      var newAdult = new Adult();
      newAdultsArray.push(newAdult);
      this.state.household.adults.push(newAdult);
    }

    for (let i: number = 0; i < adultsToRemove; i++) {
      var adultToRemove = newAdultsArray.pop();
      this.state.household.adults.splice(
        this.state.household.adults.indexOf(adultToRemove),
        1
      );
    }
    console.debug("Updating adults to: " + this.state.household.adults.length);

    this.setState({
      household: this.state.household,
      currentAdults: newAdultsArray
    });
    this.props.onChange(event);
  }
  onFutureAdultsChanged(event) {
    var adultsToAdd = Math.max(
      0,
      event.target.value - this.state.futureAdults.length
    );
    var adultsToRemove = Math.max(
      0,
      this.state.futureAdults.length - event.target.value
    );

    var newAdultsArray = new Array(...this.state.futureAdults);

    for (let i: number = 0; i < adultsToAdd; i++) {
      //Add a new member in 2 years by default

      var newAdult = new Adult(new Date().getFullYear() + 2);
      newAdultsArray.push(newAdult);
      this.state.household.adults.push(newAdult);
    }

    for (let i: number = 0; i < adultsToRemove; i++) {
      var adultToRemove = newAdultsArray.pop();
      this.state.household.adults.splice(
        this.state.household.adults.indexOf(adultToRemove),
        1
      );
    }

    this.setState({
      household: this.state.household,
      futureAdults: newAdultsArray
    });
    this.props.onChange(event);
  }

  onYearOfJoiningChange(event) {
    this.state.futureAdults[event.target.name].yearOfJoining =
      event.target.value;
    this.setState({
      household: this.state.household,
      futureAdults: this.state.futureAdults
    });
    this.props.onChange(event);
  }

  render() {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="members">
          Household Members
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="members">
          <Card.Body>
            <Form>
              <FormGroup as={Row}>
                <Col className="col-sm-6">
                  <Form.Label>You are currently: </Form.Label>
                </Col>
                <Col className="col-sm-6">
                  <ToggleButtonGroup
                    name="current_adults"
                    type="radio"
                    value={this.state.currentAdults.length}
                    onChange={this.onCurrentAdultsChanged.bind(this)}
                  >
                    <ToggleButton
                      variant="outline-secondary"
                      size="sm"
                      value={1}
                    >
                      Single
                    </ToggleButton>
                    <ToggleButton
                      variant="outline-secondary"
                      size="sm"
                      value={2}
                    >
                      Couple
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Col>
              </FormGroup>
              <hr />
              <FormGroup as={Row}>
                <Col className="col-sm-8">
                  <Form.Label>
                    Any other adults expected to join in the future?
                  </Form.Label>
                </Col>
                <Col className="col-sm-4">
                  <Form.Control
                    className="text-right"
                    as="select"
                    type="number"
                    value={this.state.futureAdults.length}
                    onChange={this.onFutureAdultsChanged.bind(this)}
                  >
                    <option>0</option>
                    <option>1</option>
                  </Form.Control>
                </Col>
              </FormGroup>
              {this.state.futureAdults.map((adult, index) => (
                <FormGroup>
                  <Row>
                    <Col className="col-sm-8">
                      <Form.Label>
                        Joining year for Adult{" "}
                        {index + this.state.currentAdults.length + 1}
                      </Form.Label>
                    </Col>
                    <Col className="col-sm-4">
                      <Form.Control
                        className="text-right"
                        type="number"
                        value={adult.yearOfJoining}
                        name={index}
                        onChange={this.onYearOfJoiningChange.bind(this)}
                      />
                    </Col>
                  </Row>
                </FormGroup>
              ))}
              <hr />
              <ChildrenInput
                children={this.state.household.children}
                onChange={this.props.onChange}
              />
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
