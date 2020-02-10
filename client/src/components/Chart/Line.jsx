import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import {
  CartesianGrid,
  Label,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Utils
import { getChartData } from '../../utils/chart';

const staticConfig = { margin: { top: 40, right: 30, left: 10 } };

const LineChartComp = ({ chart, dashboard }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id: chartID, options } = chart;
  const { clusterID } = dashboard;

  // Parse chart options string from DB
  const { title, xAxis, yAxis } = JSON.parse(options);

  // ComponentDidMount -> get data from hpcc query
  useEffect(() => {
    getChartData(chartID, clusterID).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [chartID, clusterID]);

  return loading ? (
    <CircularProgress />
  ) : (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <LineChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis}>
          <Label value={title} offset={235} position="top" />
        </XAxis>
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComp;