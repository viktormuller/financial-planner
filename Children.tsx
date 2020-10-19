import React from "react";
import { Component } from "react";
import { HouseholdComponent } from "./HouseholdComponent";
import { MonetaryValue } from "./MonetaryValue";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";

export class Children extends HouseholdComponent {
  yearsOfBirth: number[];
  private numberOfChildren: number = 0;
  private static maxNumOfChildren = 1;

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
    ]
  ];
  //Handle out of order yearsOfBirth by sorting yearsOfBirth array
  expense(year: number): MonetaryValue {
    console.debug("Caculating expense for Children for year " + year);
    var ret: MonetaryValue = new MonetaryValue(0);
    for (let i = 0; i < this.numberOfChildren; i++) {
      console.debug("Child number " + i);
      var age: number = year - this.yearsOfBirth[i];
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
  eventKey: string;
}

export class ChildrenInput extends Component<ChildrenProps> {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    /*  switch (event.target.name){
      case "chil"
    }
    this.props.children.startingExpense = event.target.value;
    this.props.onChange(event, this.props.expense);*/
  }

  render() {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey={this.props.eventKey}>
          Children
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={this.props.eventKey}>
          <Card.Body>
            <Form>
              <Form.Group>
                {this.props.children.yearsOfBirth.map(year => (
                  <div>
                    <Form.Label>First child</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="2022"
                      value={year}
                      onChange={this.onChange.bind(this)}
                    />
                  </div>
                ))}
              </Form.Group>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }
}
