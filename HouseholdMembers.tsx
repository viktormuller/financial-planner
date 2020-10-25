import React, { Component } from "react";
import { Accordion, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Adults } from "./Adults";
import { Children, ChildrenInput } from "./Children";

interface HouseholdMembersProps {
  adults: Adults;
  children: Children;
  onChange;
}

interface HouseholdMembersState {
  adults: Adults;
  children: Children;
}

export class HouseholdMembers extends Component<
  HouseholdMembersProps,
  HouseholdMembersState
> {
  constructor(props) {
    super(props);
    this.state = {
      adults: this.props.adults,
      children: this.props.children
    };
    console.debug(
      "Current children: " + this.props.children.yearsOfBirth.length
    );
  }

  onCurrentAdultsChanged(event) {
    this.state.adults.currentAdults = Number(event.target.value);
    this.setState({
      adults: this.state.adults
    });
    this.props.onChange(event);
  }
  onFutureAdultsChanged(event) {
    var newFutureAdults = new Array<number>();
    for (let i: number = 0; i < event.target.value; i++) {
      newFutureAdults.push(this.state.adults.futureAdults[i]);
    }
    this.state.adults.futureAdults = newFutureAdults;
    this.setState({
      adults: this.state.adults
    });
    this.props.onChange(event);
  }

  onYearOfJoiningChange(event) {
    this.state.adults.futureAdults[event.target.name] = event.target.value;
    this.setState({ adults: this.state.adults });
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
              <FormGroup>
                <Row>
                  <Col className="col-sm-8">
                    <Form.Label>Adults in the household today </Form.Label>
                  </Col>
                  <Col className="col-sm-4">
                    <Form.Control
                      as="select"
                      type="number"
                      value={String(this.state.adults.currentAdults)}
                      onChange={this.onCurrentAdultsChanged.bind(this)}
                    >
                      <option>1</option>
                      <option>2</option>
                    </Form.Control>
                  </Col>
                </Row>
              </FormGroup>
              <hr />
              <FormGroup>
                <Row>
                  <Col className="col-sm-8">
                    <Form.Label>
                      Any other adults expected to join in the future?
                    </Form.Label>
                  </Col>
                  <Col className="col-sm-4">
                    <Form.Control
                      as="select"
                      type="number"
                      value={this.state.adults.futureAdults.length}
                      onChange={this.onFutureAdultsChanged.bind(this)}
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </Form.Control>
                  </Col>
                </Row>
              </FormGroup>
              {this.state.adults.futureAdults.map((year: number, index) => (
                <FormGroup>
                  <Row>
                    <Col className="col-sm-8">
                      <Form.Label>
                        Joining year for Adult
                        {index + this.state.adults.currentAdults + 1}
                      </Form.Label>
                    </Col>
                    <Col className="col-sm-4">
                      <Form.Control
                        type="number"
                        value={year}
                        name={index}
                        onChange={this.onYearOfJoiningChange.bind(this)}
                      />
                    </Col>
                  </Row>
                </FormGroup>
              ))}
              <hr />
              <ChildrenInput
                children={this.state.children}
                onChange={this.props.onChange}
              />
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
