import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Bar } from '@antv/g2plot';

// Utils
import { checkForNumber, thousandsSeparator } from '../../../utils/misc';

const BarChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis } = options;

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'right',
      style: { fontSize: 12 },
      visible: true,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    stackField: groupBy,
    xAxis: {
      grid: { visible: true },
      label: { visible: true },
      min: 0,
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      min: 0,
    },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={Bar} config={config} />;
};

export default BarChart;
