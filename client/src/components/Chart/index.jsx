import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

//React Components
import BarChart from './Bar';
import LineChart from './Line';
import PieChart from './Pie';
import NoData from './NoData';

// Utils
import { groupByField } from '../../utils/chart';

// Create styles
const useStyles = makeStyles({
  progress: { margin: '0 0 10px 10px' },
});

const ChartComp = ({ chart, dataObj }) => {
  const { data = {}, loading = true } = dataObj;
  const { dataset, groupBy, options, type } = chart;
  const { row, column, value } = groupBy;
  const { progress } = useStyles();

  // Determine if chart data is available
  let chartData = Object.keys(data).length > 0 ? data[dataset].Row : [];

  // Group data by designated field
  if (row && column && value) {
    chartData = groupByField(chartData, groupBy);
  }

  return loading ? (
    <CircularProgress className={progress} />
  ) : chartData.length > 0 ? (
    (() => {
      switch (type) {
        case 'bar':
          return <BarChart data={chartData} groupBy={groupBy} options={options} />;
        case 'line':
          return <LineChart data={chartData} groupBy={groupBy} options={options} />;
        case 'pie':
          return <PieChart data={chartData} groupBy={groupBy} options={options} />;  
        default:
          return 'Unknown chart type';
      }
    })()
  ) : (
    <NoData />
  );
};

export default ChartComp;
