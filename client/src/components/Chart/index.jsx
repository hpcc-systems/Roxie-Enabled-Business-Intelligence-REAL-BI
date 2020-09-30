import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';
import classnames from 'classnames';

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
const useStyles = makeStyles(theme => ({
  progress: { margin: '0 0 10px 10px' },
  warningMsg: {
    backgroundColor: theme.palette.warning.dark,
    color: theme.palette.warning.contrastText,
    margin: '0 auto',
    padding: theme.spacing(0.15, 0.75),
    textAlign: 'center',
  },
  typography: { maxWidth: '70%' },
}));

const ChartComp = ({
  chart: { config = {}, id: chartID },
  dataObj: { data = {}, error, loading = true },
  eclDataset = '',
  interactiveClick,
  interactiveObj = {},
}) => {
  const { dataset, ecl = {}, groupBy = {}, horizontal, stacked, isStatic = false, type } = config;
  const { progress, typography, warningMsg } = useStyles();
  let { relations = {} } = useSelector(state => state.dashboard.dashboard);
  let chartData = [];
  let chartType = type;
  let err = null;

  const newEclDataset = eclDataset === '' && ecl.dataset ? ecl.dataset : eclDataset;

  // Determine if chart data is available
  if (Object.keys(data).length > 0) {
    if (data.Exception) {
      err = data.Exception.Message;
    } else if (data[dataset] || newEclDataset !== '') {
      if (newEclDataset !== '') {
        chartData = data[newEclDataset].Row;
      } else {
        chartData = data[dataset].Row;
      }

      // Confirm chart type
      if (chartType === 'bar') {
        if (horizontal) {
          chartType = stacked ? 'bar-stacked' : groupBy.value ? 'bar-group' : 'bar';
        } else {
          chartType = stacked ? 'column-stacked' : groupBy.value ? 'column-group' : 'column';
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
      let chartComp;
      switch (chartType) {
        case 'bar':
          chartComp = (
            <BarChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'bar-group':
          chartComp = (
            <GroupBarChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'bar-stacked':
          chartComp = (
            <StackedBarChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'column':
          chartComp = (
            <ColumnChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'column-group':
          chartComp = (
            <GroupColumnChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'column-stacked':
          chartComp = (
            <StackedColumnChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'donut':
          chartComp = (
            <DonutChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'line':
          chartComp = (
            <LineChart
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        case 'histogram':
          chartComp = <HistogramChart data={chartData} config={config} />;
          break;
        case 'dualline':
          chartComp = <DualLineChart data={chartData} config={config} />;
          break;
        case 'pie':
          chartComp = <PieChart data={chartData} config={config} />;
          break;
        case 'scatter':
          chartComp = <ScatterChart data={chartData} config={config} />;
          break;
        case 'textBox':
          chartComp = <TextBox data={chartData} config={config} />;
          break;
        case 'heatmap':
          chartComp = <HeatMap data={chartData} config={config} />;
          break;
        case 'gauge':
          chartComp = <Gauge data={chartData} config={config} />;
          break;
        case 'table':
          chartComp = (
            <Table
              chartID={chartID}
              config={config}
              data={chartData}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
              relations={relations}
            />
          );
          break;
        default:
          chartComp = <Typography align='center'>Unknown chart type</Typography>;
      }

      return (
        <Fragment>
          {chartComp}
          {chartData.length >= 5000 && (
            <Typography
              className={classnames(warningMsg, { [typography]: eclDataset === '' })}
              display='block'
            >
              Displaying 5,000+ rows of data is not recommended. Please consider filtering your data further
              to improve app performance and chart render time.
            </Typography>
          )}
        </Fragment>
      );
    })()
  ) : (
    <NoData err={err} />
  );
};

export default ChartComp;
