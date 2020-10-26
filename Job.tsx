import React from "react";
import { Component } from "react";
import { MonetaryValue } from "./MonetaryValue";

import Form from "react-bootstrap/Form";

import * as d3 from "d3-format";
import { Col, Row } from "react-bootstrap";

export default class Job {
  private startYear: number = new Date().getFullYear();
  endYear: number = 2055;
  startingIncome: number = 50000;

  constructor(pStartYear?: number, pEndYear?: number) {
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
  index: string;
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
      <React.Fragment>
        <Row>
          <Form.Label>{"Job " + this.props.index}</Form.Label>
        </Row>
        <Form.Group>
          <Row>
            <Col className="col-sm-8">
              <Form.Label>Annual income (after tax)</Form.Label>
            </Col>
            <Col className="col-sm-4">
              <Form.Control
                className="text-right"
                type="text"
                name="startingIncome"
                placeholder="50000"
                value={d3.format(",")(this.props.job.startingIncome)}
                onChange={this.onChange.bind(this)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col className="col-sm-8">
              <Form.Label>Year of retirment</Form.Label>
            </Col>
            <Col className="col-sm-4">
              <Form.Control
                className="text-right"
                name="endYear"
                type="number"
                value={this.props.job.endYear}
                onChange={this.onChange.bind(this)}
              />
            </Col>
          </Row>
        </Form.Group>
      </React.Fragment>
    );
  }
}
