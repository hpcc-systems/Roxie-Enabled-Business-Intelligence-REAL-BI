import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Column } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../utils/misc';

const ColumnChart = ({ data, options }) => {
  const { xAxis, yAxis } = options;

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'top',
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
    xAxis: { min: 0 },
    xField: xAxis,
    yAxis: { min: 0 },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={Column} config={config} />;
};

export default ColumnChart;
