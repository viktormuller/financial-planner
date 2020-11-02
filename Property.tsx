import React from "react";
import { Component } from "react";
import { Col, Form, FormGroup, Row } from "react-bootstrap";
import { MonetaryValue } from "./MonetaryValue";
import * as d3 from "d3-format";

export class Property {
  yearOfPurchase: number = new Date().getFullYear() + 10;
  purchasePrice: MonetaryValue = new MonetaryValue(500000);

  constructor(yearOfPurchase?: number, purchasePrice?: MonetaryValue) {
    if (yearOfPurchase) this.yearOfPurchase = yearOfPurchase;
    if (purchasePrice) this.purchasePrice = purchasePrice;
  }
}

export interface PropertyInputProps {
  property: Property;
  onChange;
}

export interface PropertyInputState {
  property: Property;
}

export class PropertyInput extends Component<
  PropertyInputProps,
  PropertyInputState
> {
  constructor(props) {
    super(props);
    this.state = { property: props.property };
  }

  onChange(event) {
    switch (event.target.name) {
      case "purchasePrice": {
        this.state.property.purchasePrice = new MonetaryValue(
          Number(event.target.value.replace(/,/g, ""))
        );
        break;
      }
      case "yearOfPurchase": {
        this.state.property.yearOfPurchase = event.target.value;
        break;
      }
    }
    this.props.onChange(event);
  }

  render() {
    return (
      <React.Fragment>
        <Row>
          <Form.Label>Home</Form.Label>
        </Row>
        <FormGroup>
          <Row>
            <Col className="col-sm-7">
              <Form.Label>Year of purchase</Form.Label>
            </Col>
            <Col className="col-sm-5">
              <Form.Control
                className="text-right"
                name="yearOfPurchase"
                type="number"
                value={this.state.property.yearOfPurchase}
                onChange={this.onChange.bind(this)}
              />
            </Col>
          </Row>
        </FormGroup>
        <Form.Group>
          <Row>
            <Col className="col-sm-7">
              <Form.Label>
                Purchase price (in {new Date().getFullYear()} GBP)
              </Form.Label>
            </Col>
            <Col className="col-sm-5">
              <Form.Control
                className="text-right"
                type="text"
                name="purchasePrice"
                placeholder="500000"
                value={d3.format(",")(this.state.property.purchasePrice.value)}
                onChange={this.onChange.bind(this)}
              />
            </Col>
          </Row>
        </Form.Group>
      </React.Fragment>
    );
  }
}
