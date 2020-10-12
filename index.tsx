import React, { Component } from 'react';
import { render } from 'react-dom';
import {XYPlot, 
  XAxis,
  YAxis,
  VerticalBarSeries} from 'react-vis';
import findDomain from './utils';
import './style.css';
import { MonetaryValue } from './MonetaryValue';
import {Household} from './Household';
import Job from './Job';
import { FullHouseholdExpense } from './FullHouseholdExpense';


interface AppProps {
  netWorthSeries: Map<number, MonetaryValue>
 }
interface AppState {
  name: string
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'React'
    };

  }

  render() {
    //TODO: Fix findDomain to return lower end of range and then override here with 0
    //const yDmn = findDomain(this.state.myData);
    const myData: any[] = new Array<any>(); 
    for (let netWorthPoint of this.props.netWorthSeries.entries()){
      myData.push({
        x: netWorthPoint[0],
        y: netWorthPoint[1].value
      })
    }
    return (
      <div>
        <XYPlot
          margin={{left: 75}}
          width={800}
          height={600}
        >
          <VerticalBarSeries className="vertical-bar-series" data={myData} barWidth={0.8}/>
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>  
    );
  }
}

const household = new Household();
const job = new Job(2020, 2055);
const hhExpense = new FullHouseholdExpense();
job.register(household);
hhExpense.register(household);

render(<App netWorthSeries = {household.netWorthSeries()} />, document.getElementById('root'));
