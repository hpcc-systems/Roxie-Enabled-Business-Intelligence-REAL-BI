import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { StackedColumn } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../utils/misc';

const StackedColumnChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis } = options;

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
      [yAxis]: { formatter: v => thousandsSeparator(v) },
    },
    stackField: groupBy,
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={StackedColumn} config={config} />;
};

export default StackedColumnChart;
