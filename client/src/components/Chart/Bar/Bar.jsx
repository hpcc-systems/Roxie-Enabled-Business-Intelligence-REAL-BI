import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Bar } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../constants';

const BarChart = ({ data, options }) => {
  const { xAxis, yAxis } = options;

  const config = {
    data,
    forceFit: true,
    interactions: [{ type: 'scrollbar' }],
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
    xAxis: { min: 0 },
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
