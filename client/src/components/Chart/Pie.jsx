import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Constants
const RADIAN = Math.PI / 180;
const colors = ['#FF3333', '#30E324', '#FA7411', '#2F56F3', '#F770E7', '#F1D83B', '#BC44F3'];
const staticConfig = { margin: { top: 5, right: 15, bottom: 15, left: 15 } };

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComp = ({ data, options }) => {
  const { xAxis, yAxis } = options;

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <PieChart {...staticConfig}>
        <Pie
          data={data}
          nameKey={xAxis}
          dataKey={yAxis}
          paddingAngle={3}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((obj, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComp;
