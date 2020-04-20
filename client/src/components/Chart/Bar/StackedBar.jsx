import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { StackedBar } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../constants';

const StackedBarChart = ({ data, groupBy, options }) => {
  const { xAxis, yAxis } = options;

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'middle',
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
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={StackedBar} config={config} />;
};

export default StackedBarChart;
