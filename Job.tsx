import React from "react";
import { Component } from "react";

import { HouseholdComponent } from "./HouseholdComponent";

import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import * as d3 from "d3-format";

export default class Job extends HouseholdComponent {
  private startYear: number = new Date().getFullYear();
  endYear: number;
  startingIncome: number = 50000;

  constructor(pStartYear?: number, pEndYear?: number) {
    super();
    if (pEndYear) this.endYear = pEndYear;
    if (pStartYear) this.startYear = pStartYear;
  }

  income(year: number): MonetaryValue {
    return new MonetaryValue(
      year <= this.endYear && year >= this.startYear ? this.startingIncome : 0
    );
  }
}

class JobProps {
  job: Job;
  onChange;
  eventKey: string;
}

export class JobInputs extends Component<JobProps> {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    switch (event.target.name) {
      case "startingIncome": {
        this.props.job.startingIncome = Number(
          event.target.value.replace(/,/g, "")
        );
        break;
      }
      case "endYear": {
        this.props.job.endYear = event.target.value;
        break;
      }
    }
    this.props.onChange(event, this.props.job);
  }

  render() {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.eventKey}>
          Job
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.eventKey}>
          <Card.Body>
            <Form>
              <Form.Group>
                <div className="row">
                  <Form.Label className="col-md-8">
                    Annual income (after tax)
                  </Form.Label>
                  <Form.Control
                    className="col-md-4 text-right"
                    type="text"
                    name="startingIncome"
                    placeholder="50000"
                    value={d3.format(",")(this.props.job.startingIncome)}
                    onChange={this.onChange.bind(this)}
                  />
                </div>
                <div className="row">
                  <Form.Label className="col-md-8">
                    Year of retirment
                  </Form.Label>
                  <Form.Control
                    className="col-md-4 text-right"
                    name="endYear"
                    type="number"
                    value={this.props.job.endYear}
                    onChange={this.onChange.bind(this)}
                  />
                </div>
              </Form.Group>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
