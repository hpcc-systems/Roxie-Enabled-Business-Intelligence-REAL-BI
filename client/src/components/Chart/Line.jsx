import React from 'react';
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Utils
import { getRandomColor } from '../../utils/misc';

const staticConfig = { margin: { top: 40, right: 30, left: 10 } };

const LineChartComp = ({ data, options }) => {
  const { xAxis, yAxis } = options;

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <LineChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis interval="preserveStartEnd" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yAxis} stroke={getRandomColor()} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComp;
