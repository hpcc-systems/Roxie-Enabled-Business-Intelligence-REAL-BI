import React from 'react';
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

const staticConfig = { margin: { top: 40, right: 30, left: 10 } };

const BarChartComp = ({ data, options }) => {
  const { title, xAxis, yAxis } = options;

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <BarChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis}>
          <Label value={title} offset={230} position="top" />
        </XAxis>
        <YAxis interval="preserveStartEnd" />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxis} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;
