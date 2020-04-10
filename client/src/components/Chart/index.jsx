import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

//React Components
import BarChart from './Bar';
import LineChart from './Line';
import PieChart from './Pie';
import NoData from './NoData';

// Create styles
const useStyles = makeStyles({
  progress: { margin: '0 0 10px 10px' },
});

const ChartComp = ({ chart, dataObj }) => {
  const { data = {}, loading = true } = dataObj;
  const { dataset, options, type } = chart;
  const { progress } = useStyles();
  let chartData = [];
  let err = null;

  // Determine if chart data is available
  if (Object.keys(data).length > 0) {
    if (data.Exception) {
      err = data.Exception.Message;
    } else if (data[dataset]) {
      chartData = data[dataset].Row;
    }
  }

  return loading ? (
    <CircularProgress className={progress} />
  ) : chartData.length > 0 && !err ? (
    (() => {
      switch (type) {
        case 'bar':
          return <BarChart data={chartData} options={options} />;
        case 'line':
          return <LineChart data={chartData} options={options} />;
        case 'pie':
          return <PieChart data={chartData} options={options} />;
        default:
          return 'Unknown chart type';
      }
    })()
  ) : (
    <NoData err={err} />
  );
};

export default ChartComp;
