import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Utils
import { getChartData } from '../../utils/chart';

const staticConfig = { margin: { top: 40, right: 30, left: 10 } };

const BarChartComp = ({ chart, dashboard }) => {
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
      <BarChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis}>
          <Label value={title} offset={230} position="top" />
        </XAxis>
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxis} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;
