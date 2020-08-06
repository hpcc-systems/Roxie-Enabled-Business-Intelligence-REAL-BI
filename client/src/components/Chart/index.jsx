import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

//React Components
import { BarChart, GroupBarChart, StackedBarChart } from './Bar';
import { ColumnChart, GroupColumnChart, StackedColumnChart } from './Column';
import LineChart from './Line';
import PieChart from './Pie';
import Table from './Table';
import NoData from './NoData';
import TextBox from './TextBox';
import HeatMap from './HeatMap';

// Utils
import { createDateTimeStamp } from '../../utils/misc';

// Create styles
const useStyles = makeStyles({
  progress: { margin: '0 0 10px 10px' },
});

const ChartComp = ({
  chart: { config = {} },
  dashboard = { params: [] },
  dataObj: { data = {}, error, loading = true },
  dispatch,
}) => {
  const { dataset, groupBy, horizontal, stacked, isStatic = false, type } = config;
  const { progress } = useStyles();
  let chartData = [];
  let chartType = type;
  let err = null;

  // Determine if chart data is available
  if (Object.keys(data).length > 0) {
    if (data.Exception) {
      err = data.Exception.Message;
    } else if (data[dataset]) {
      chartData = data[dataset].Row;

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

  // Inject datetime stamp into config as new description
  config = { ...config, description: createDateTimeStamp(config.chartDescription) };

  // Don't render the progress wheel if the chart is a static textbox
  return loading && (chartType !== 'textBox' || (chartType === 'textBox' && !isStatic)) ? (
    <CircularProgress className={progress} />
  ) : (chartData.length > 0 || (chartType === 'textBox' && isStatic)) && !err ? (
    (() => {
      switch (chartType) {
        case 'bar':
          return <BarChart data={chartData} config={config} />;
        case 'bar-group':
          return <GroupBarChart data={chartData} config={config} />;
        case 'bar-stacked':
          return <StackedBarChart data={chartData} config={config} />;
        case 'column':
          return <ColumnChart data={chartData} config={config} />;
        case 'column-group':
          return <GroupColumnChart data={chartData} config={config} />;
        case 'column-stacked':
          return <StackedColumnChart data={chartData} config={config} />;
        case 'line':
          return <LineChart data={chartData} config={config} />;
        case 'pie':
          return <PieChart data={chartData} config={config} />;
        case 'textBox':
          return <TextBox data={chartData} config={config} />;
        case 'heatmap':
          return <HeatMap data={chartData} config={config} />;
        case 'table':
          return <Table data={chartData} dispatch={dispatch} config={config} params={dashboard.params} />;
        default:
          return 'Unknown chart type';
      }
    })()
  ) : (
    <NoData err={err} />
  );
};

export default ChartComp;
