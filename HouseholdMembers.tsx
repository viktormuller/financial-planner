import React, { Component } from "react";
import { Accordion, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Household } from "./Household";

interface HouseholdMembersProps {
  household: Household;
}

interface HouseholdMembersState {
  currentAdults: number;
  futureAdults: number[];
}

export class HouseholdMembers extends Component<
  HouseholdMembersProps,
  HouseholdMembersState
> {
  constructor(props) {
    super(props);
    this.state = {
      currentAdults: 2,
      futureAdults: [2022]
    };
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
                      value={String(this.state.currentAdults)}
                    >
                      <option>1</option>
                      <option>2</option>
                    </Form.Control>
                  </Col>
                </Row>
              </FormGroup>
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
                      value={this.state.futureAdults.length}
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </Form.Control>
                  </Col>
                </Row>
              </FormGroup>
              {this.state.futureAdults.map((year: number, index) => (
                <FormGroup>
                  <Row>
                    <Col className="col-sm-8">
                      {" "}
                      <Form.Label>
                        Joining year for Adult{" "}
                        {index + this.state.currentAdults + 1}
                      </Form.Label>
                    </Col>
                    <Col className="col-sm-4">
                      <Form.Control type="number" value={year} />
                    </Col>{" "}
                  </Row>
                </FormGroup>
              ))}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
