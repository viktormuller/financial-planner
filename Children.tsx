import React from "react";
import { Component } from "react";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";

export class Children extends HouseholdComponent {
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
    super();
    this.yearsOfBirth = yearsOfBirth;
  }

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
  }
}

class ChildrenProps {
  children: Children;
  onChange;
}

export class ChildrenInput extends Component<ChildrenProps> {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    var index: number = Number(event.target.name);
    this.props.children.yearsOfBirth[index] = event.target.value;
    this.props.onChange(event, this.props.children);
  }

  render() {
    return (
      /*<Card>        
        <Accordion.Toggle as={Card.Header} eventKey={this.props.eventKey}>
          Children
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.eventKey}>
          <Card.Body>*/
      //<Form>
      <React.Fragment>
        {this.props.children.yearsOfBirth.map((year, index) => (
          <Form.Group>
            <div className="row">
              <Form.Label className="col-md-8">
                Child {index + 1} year of birth
              </Form.Label>
              <Form.Control
                className="col-md-4 text-right"
                type="number"
                name={String(index)}
                value={year}
                onChange={this.onChange.bind(this)}
              />
            </div>
          </Form.Group>
        ))}
      </React.Fragment>
      //     </Form>
      /*    </Card.Body>
        </Accordion.Collapse>
      </Card>*/
    );
  }
}
