import React from 'react';
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

const staticConfig = { margin: { top: 40, right: 30, left: 10 } };

const LineChartComp = ({ data, options }) => {
  const { title, xAxis, yAxis } = options;

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <LineChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis}>
          <Label value={title} offset={235} position="top" />
        </XAxis>
        <YAxis interval="preserveStartEnd" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComp;
