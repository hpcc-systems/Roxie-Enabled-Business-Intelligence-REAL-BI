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

// https://stackoverflow.com/questions/1484506/random-color-generator
const getRandomColor = () => `#${Math.floor(Math.random() * 16777216).toString(16)}`;

const staticConfig = { margin: { top: 40, right: 30, left: 10 } };

const BarChartComp = ({ data, groupBy, options }) => {
  const { title, xAxis, yAxis } = options;
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
        <XAxis dataKey={xAxis}>
          <Label value={title} offset={230} position="top" />
        </XAxis>
        <YAxis />
        <Tooltip />
        <Legend />
        {yKeys.map((key, index) => {
          return <Bar key={index} stackId="a" dataKey={key} fill={getRandomColor()} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;
