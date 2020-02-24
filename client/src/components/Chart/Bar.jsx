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
  const { groupBy, title, xAxis, yAxis } = options;
  const { row, column, value } = groupBy;
  let etlData = data;

  // If group by values in place, transform data
  if (row !== '' && column !== '' && value !== '') {
    etlData = data.map(row => {
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
      <BarChart {...staticConfig} data={etlData}>
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
