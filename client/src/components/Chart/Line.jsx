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

// Constants
const staticConfig = { margin: { top: 40, right: 30, left: 10 } };
const colors = ['#FF3333', '#30E324', '#FA7411', '#2F56F3', '#F770E7', '#F1D83B', '#BC44F3'];

const LineChartComp = ({ data, groupBy, options }) => {
  const { xAxis, yAxis } = options;
  const { row, column, value } = groupBy;
  let yKeys = [yAxis]; // Default to an array with 1 index

  // If group by values in place, get other object keys for stacking
  if (row && column && value) {
    yKeys = Object.keys(data[0]).filter(key => key !== xAxis);
  }

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <LineChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis interval="preserveStartEnd" />
        <Tooltip />
        <Legend />
        {yKeys.map((key, index) => {
          return <Line key={index} type="monotone" dataKey={key} stroke={colors[index]} />;
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComp;
