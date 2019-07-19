import React from 'react';
// import ShowcaseButton from '../showcase-components/showcase-button';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    HorizontalBarSeries,
    HorizontalBarSeriesCanvas,
    LineSeries
} from 'react-vis';
import { Button } from '@material-ui/core';

export default class ProjectStatistics extends React.Component {
    state = {
        useCanvas: false
    };
    render() {
        const data = [
            { x: 4, y: 1 },
            { x: 5, y: 7 },
            { x: 6, y: 6 },
            { x: 7, y: 3 },
            { x: 8, y: 2 },
            { x: 9, y: 0 }
        ];
        return (
            <XYPlot height={500} width={500} stackBy="x">
                <HorizontalGridLines />
                <VerticalGridLines />
                <XAxis />
                <YAxis />

                <HorizontalBarSeries data={data} />
            </XYPlot>

        );

        // const {useCanvas} = this.state;
        // const BarSeries = useCanvas
        //   ? HorizontalBarSeriesCanvas
        //   : HorizontalBarSeries;
        // const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
        // return (
        //   <div>
        //     <Button
        //       onClick={() => this.setState({useCanvas: !useCanvas})}
        //     >{content}</Button>
        //     <XYPlot width={500} height={200} stackBy="x">
        //       <VerticalGridLines />
        //       <HorizontalGridLines />
        //       <XAxis />
        //       <YAxis />
        //       <BarSeries data={[{y: 2, x: 10}, {y: 4, x: 5}, {y: 5, x: 15}]} />
        //       <BarSeries data={[{y: 2, x: 12}, {y: 4, x: 2}, {y: 5, x: 11}]} />
        //     </XYPlot>
        //   </div>
        // );
    }
}