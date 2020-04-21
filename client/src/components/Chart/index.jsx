import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

//React Components
import { BarChart, GroupBarChart, RangeBarChart, StackedBarChart } from './Bar';
import { ColumnChart, GroupColumnChart, RangeColumnChart, StackedColumnChart } from './Column';
import LineChart from './Line';
import PieChart from './Pie';
import NoData from './NoData';

// Create styles
const useStyles = makeStyles({
  progress: { margin: '0 0 10px 10px' },
});

const ChartComp = ({ chart, dataObj }) => {
  const { data = {}, loading = true } = dataObj;
  const { dataset, options } = chart;
  const { groupBy, horizontal, stacked } = options;
  let { type } = chart; // Move this nested key to a 'let' so it could be changed
  const { progress } = useStyles();
  let chartData = [];
  let err = null;

  // Determine if chart data is available
  if (Object.keys(data).length > 0) {
    if (data.Exception) {
      err = data.Exception.Message;
    } else if (data[dataset]) {
      chartData = data[dataset].Row;

      // Confirm chart type
      if (type === 'bar') {
        if (horizontal) {
          type = stacked ? 'bar-stacked' : groupBy ? 'bar-group' : 'bar';
        } else {
          type = stacked ? 'column-stacked' : groupBy ? 'column-group' : 'column';
        }
      } else if (type === 'range') {
        type = horizontal ? 'range-bar' : 'range-column';
      }
    }
  }

  return loading ? (
    <CircularProgress className={progress} />
  ) : chartData.length > 0 && !err ? (
    (() => {
      switch (type) {
        case 'bar':
          return <BarChart data={chartData} options={options} />;
        case 'bar-group':
          return <GroupBarChart data={chartData} options={options} />;
        case 'bar-stacked':
          return <StackedBarChart data={chartData} options={options} />;
        case 'column':
          return <ColumnChart data={chartData} options={options} />;
        case 'column-group':
          return <GroupColumnChart data={chartData} options={options} />;
        case 'column-stacked':
          return <StackedColumnChart data={chartData} options={options} />;
        case 'line':
          return <LineChart data={chartData} options={options} />;
        case 'pie':
          return <PieChart data={chartData} options={options} />;
        case 'range-bar':
          return <RangeBarChart data={chartData} options={options} />;
        case 'range-column':
          return <RangeColumnChart data={chartData} options={options} />;
        default:
          return 'Unknown chart type';
      }
    })()
  ) : (
    <NoData err={err} />
  );
};

export default ChartComp;
