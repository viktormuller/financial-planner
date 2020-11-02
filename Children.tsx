import React from "react";
import { Component } from "react";
import { MonetaryValue } from "./MonetaryValue";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

export class Children {
  yearsOfBirth: number[];

  //TODO: add single parent version, inflate , move to config file
  //Source: cpag.org 2019 https://cpag.org.uk/sites/default/files/files/policypost/CostofaChild2019_web.pdf
  static costOfChild = [
    [
      266.48 * 52,
      266.48 * 52,
      159.68 * 52,
      159.68 * 52,
      159.68 * 52,
      132.67 * 52,
      132.67 * 52,
      132.67 * 52,
      132.67 * 52,
      132.67 * 52,
      132.67 * 52,
      178.09 * 52,
      178.09 * 52,
      178.09 * 52,
      94.88 * 52,
      94.88 * 52,
      94.88 * 52,
      94.88 * 52
    ],
    [
      294.84 * 52,
      294.84 * 52,
      188.07 * 52,
      188.07 * 52,
      188.07 * 52,
      152.95 * 52,
      152.95 * 52,
      152.95 * 52,
      153.8 * 52,
      153.8 * 52,
      153.8 * 52,
      200.1 * 52,
      200.1 * 52,
      200.1 * 52,
      94.88 * 52,
      94.88 * 52,
      94.88 * 52,
      94.88 * 52
    ],
    [
      307.41 * 52,
      307.41 * 52,
      200.64 * 52,
      200.64 * 52,
      200.64 * 52,
      165.54 * 52,
      165.54 * 52,
      165.54 * 52,
      166.34 * 52,
      166.34 * 52,
      166.34 * 52,
      211.23 * 52,
      211.23 * 52,
      200.1 * 52,
      200.1 * 52,
      94.88 * 52,
      94.88 * 52,
      94.88 * 52
    ],
    [
      291.54 * 52,
      291.54 * 52,
      184.72 * 52,
      184.46 * 52,
      184.46 * 52,
      149.47 * 52,
      149.47 * 52,
      149.47 * 52,
      150.32 * 52,
      150.32 * 52,
      129.44 * 52,
      211.23 * 52,
      200.1 * 52,
      200.1 * 52,
      200.1 * 52,
      94.88 * 52,
      94.88 * 52,
      94.88 * 52
    ]
  ];

  constructor(yearsOfBirth: number[]) {
    this.yearsOfBirth = yearsOfBirth;
  }
  /*
  //Handle out of order yearsOfBirth by sorting yearsOfBirth array
  expense(year: number): MonetaryValue {
    console.debug("Caculating expense for Children for year " + year);
    var sortedYoB = this.yearsOfBirth.sort(function(a, b) {
      return a - b;
    });
    var ret: MonetaryValue = new MonetaryValue(0);
    for (let i = 0; i < this.yearsOfBirth.length; i++) {
      console.debug("Child number " + i);
      var age: number = year - sortedYoB[i];
      console.debug("Child number " + i + " age: " + age);
      if (0 < age && age < 18) {
        var childIndex = Math.min(i, Children.costOfChild.length - 1);
        console.debug("Child number " + i + " index: " + childIndex);
        var childCost = Children.costOfChild[childIndex][age];
        console.debug("Child number " + i + " costs: " + childCost);
        ret = ret.add(new MonetaryValue(childCost));
      }
    }
    return ret;
  }*/
}

class ChildrenProps {
  children: Children;
  onChange;
}

class ChildrenState {
  children: Children;
}

export class ChildrenInput extends Component<ChildrenProps, ChildrenState> {
  constructor(props) {
    super(props);
    this.state = {
      children: this.props.children
    };
  }

  onChange(event) {
    var index: number = Number(event.target.name);

    console.debug(
      "Updating year of birth for Child " +
        event.target.name +
        " from: " +
        this.state.children.yearsOfBirth[index] +
        " to : " +
        event.target.value
    );

    this.state.children.yearsOfBirth[index] = Number(event.target.value);
    this.setState({ children: this.state.children });
    this.props.onChange(event, this.props.children);
  }

  addChild(event) {
    this.state.children.yearsOfBirth.push(
      this.state.children.yearsOfBirth.length > 0
        ? Math.max(...this.state.children.yearsOfBirth) + 2
        : new Date().getFullYear() + 2
    );
    this.setState({ children: this.state.children });
    this.props.onChange(event, this.props.children);
  }

  removeChild(event) {
    this.state.children.yearsOfBirth.splice(event.target.value, 1);
    this.setState({ children: this.state.children });
    this.props.onChange(event, this.props.children);
  }

  render() {
    return (
      <React.Fragment>
        {this.state.children.yearsOfBirth.map((year, index) => (
          <Form.Group>
            <Row>
              <Col className="col-sm-8">
                <Form.Label>
                  Child {index + 1} year of birth{" "}
                  <Button
                    variant="light"
                    onClick={this.removeChild.bind(this)}
                    value={index}
                  >
                    <BsTrash />
                  </Button>
                </Form.Label>
              </Col>

              <Col className="col-sm-4">
                <Form.Control
                  type="number"
                  className="text-right"
                  name={String(index)}
                  value={year}
                  onChange={this.onChange.bind(this)}
                />
              </Col>
            </Row>
          </Form.Group>
        ))}
        <Button block variant="secondary" onClick={this.addChild.bind(this)}>
          Add a child
        </Button>
      </React.Fragment>
    );
  }
}
