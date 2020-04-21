import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { RangeBar } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../constants';

const RangeBarChart = ({ data, options }) => {
  const { xAxis, yAxis } = options;

  // Change xAxis value to array with a 0 for proper chart rendering
  data = data.map(obj => ({ ...obj, [xAxis]: [0, obj[xAxis]] }));

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      visible: true,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={RangeBar} config={config} />;
};

export default RangeBarChart;
