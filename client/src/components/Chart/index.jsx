import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';

//React Components
import BarChart from './Bar';
import LineChart from './Line';
import NoData from './NoData';

// Utils
import { getChartData } from '../../utils/chart';

// Create styles
const useStyles = makeStyles({
  progress: { margin: '0 0 10px 20px' },
});

const ChartComp = ({ chart, dashboard }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: chartID, type } = chart;
  const { clusterID } = dashboard;
  const { progress } = useStyles();

  // Parse chart options string from DB
  let options = JSON.parse(chart.options);

  // ComponentDidMount -> get data from hpcc query
  useEffect(() => {
    getChartData(chartID, clusterID).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [chartID, clusterID]);

  return loading ? (
    <CircularProgress className={progress} />
  ) : data.length > 0 ? (
    (() => {
      switch (type) {
        case 'bar':
          return <BarChart data={data} options={options} />;
        case 'line':
          return <LineChart data={data} options={options} />;
        default:
          return 'Unknown chart type';
      }
    })()
  ) : (
    <NoData />
  );
};

export default ChartComp;
