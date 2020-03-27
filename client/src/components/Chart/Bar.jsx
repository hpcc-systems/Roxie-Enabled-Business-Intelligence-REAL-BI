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

// Utils
import { getRandomColor } from '../../utils/misc';

const staticConfig = { margin: { top: 40, right: 30, left: 10 } };

const BarChartComp = ({ data, groupBy, options }) => {
  const { xAxis, yAxis } = options;
  const { row, column, value } = groupBy;

  // If group by values in place, transform data
  if (row && column && value) {
    data = data.map(row => {
      // Get all object keys except for the xAxis row
      const keys = Object.keys(row).filter(key => key !== xAxis);

      // Sum all object key values
      const sum = keys.reduce((acc, val) => acc + row[val], 0);

      // Return an object with the xAxis key and the yAxis key summation
      return { [xAxis]: row[xAxis], [yAxis]: sum };
    });
  }

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <BarChart {...staticConfig} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxis} fill={getRandomColor()} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;
