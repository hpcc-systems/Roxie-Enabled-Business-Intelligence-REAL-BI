import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

//React Components
import { BarChart, GroupBarChart, StackedBarChart } from './Bar';
import { ColumnChart, GroupColumnChart, StackedColumnChart } from './Column';
import Gauge from './Gauge';
import HeatMap from './HeatMap';
import HistogramChart from './Histogram';
import { LineChart, DualLineChart } from './Line';
import NoData from './NoData';
import { DonutChart, PieChart } from './Pie';
import ScatterChart from './Scatter';
import Table from './Table';
import TextBox from './TextBox';

// Create styles
const useStyles = makeStyles({
  progress: { margin: '0 0 10px 10px' },
});

const ChartComp = ({
  chart: { config = {}, id: chartID },
  dataObj: { data = {}, error, loading = true },
  eclDataset = '',
  interactiveClick,
  interactiveObj = {},
}) => {
  const { dataset, ecl = {}, groupBy, horizontal, stacked, isStatic = false, type } = config;
  const { progress } = useStyles();
  let { relations = {} } = useSelector(state => state.dashboard.dashboard);
  let chartData = [];
  let chartType = type;
  let err = null;

  eclDataset = eclDataset === '' && ecl.dataset ? ecl.dataset : eclDataset;

  // Determine if chart data is available
  if (Object.keys(data).length > 0) {
    if (data.Exception) {
      err = data.Exception.Message;
    } else if (data[dataset] || eclDataset !== '') {
      if (eclDataset !== '') {
        chartData = data[eclDataset].Row;
      } else {
        chartData = data[dataset].Row;
      }

      // Confirm chart type
      if (chartType === 'bar') {
        if (horizontal) {
          chartType = stacked ? 'bar-stacked' : groupBy ? 'bar-group' : 'bar';
        } else {
          chartType = stacked ? 'column-stacked' : groupBy ? 'column-group' : 'column';
        }
      }
    }
  } else if (error !== '') {
    err = error;
  }

  // Confirm relations exist else default to {}
  relations = relations || {};

  // Don't render the progress wheel if the chart is a static textbox
  return loading && (chartType !== 'textBox' || (chartType === 'textBox' && !isStatic)) ? (
    <CircularProgress className={progress} />
  ) : (chartData.length > 0 || (chartType === 'textBox' && isStatic)) && !err ? (
    (() => {
      switch (chartType) {
        case 'bar':
          return (
            <BarChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'bar-group':
          return (
            <GroupBarChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'bar-stacked':
          return (
            <StackedBarChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'column':
          return (
            <ColumnChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'column-group':
          return (
            <GroupColumnChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'column-stacked':
          return (
            <StackedColumnChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'donut':
          return (
            <DonutChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'line':
          return (
            <LineChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        case 'histogram':
          return <HistogramChart data={chartData} config={config} />;
        case 'dualline':
          return <DualLineChart data={chartData} config={config} />;
        case 'pie':
          return <PieChart data={chartData} config={config} />;
        case 'scatter':
          return <ScatterChart data={chartData} config={config} />;
        case 'textBox':
          return <TextBox data={chartData} config={config} />;
        case 'heatmap':
          return <HeatMap data={chartData} config={config} />;
        case 'gauge':
          return <Gauge data={chartData} config={config} />;
        case 'table':
          return (
            <Table
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
        default:
          return 'Unknown chart type';
      }
    })()
  ) : (
    <NoData err={err} />
  );
};

export default ChartComp;
