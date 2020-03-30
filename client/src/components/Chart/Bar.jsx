import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Constants
const staticConfig = { margin: { top: 5, right: 15, bottom: 15, left: 15 } };
const colors = ['#FF3333', '#30E324', '#FA7411', '#2F56F3', '#F770E7', '#F1D83B', '#BC44F3'];

const BarChartComp = ({ data, groupBy, options }) => {
  const { xAxis, yAxis } = options;
  const { row, column, value } = groupBy;
  let yKeys = [yAxis]; // Default to an array with 1 index

  // If group by values in place, get other object keys for stacking
  if (row && column && value) {
    yKeys = Object.keys(data[0]).filter(key => key !== xAxis);
  }

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <BarChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} interval={0} />
        <YAxis interval={0} />
        <Tooltip />
        <Legend />
        {yKeys.map((key, index) => {
          return <Bar key={index} stackId="a" dataKey={key} fill={colors[index]} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;
