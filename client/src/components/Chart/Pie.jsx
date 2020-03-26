import React from 'react';
import {  
  Label,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const staticConfig = { margin: { top: 10, right: 30, left: 10 } };

const PieChartComp = ({ data, options }) => {
  const { title, xAxis, yAxis } = options;

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <PieChart {...staticConfig}>        
        <Pie isAnimationActive={false} data={data} nameKey={xAxis} dataKey={yAxis} fill="#8884d8" label/>
        <Tooltip />           
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComp;
