import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { RangeColumn } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../constants';

const RangeColumnChart = ({ data, options }) => {
  const { xAxis, yAxis } = options;

  // Change xAxis value to array with a 0 for proper chart rendering
  data = data.map(obj => ({ ...obj, [yAxis]: [0, obj[yAxis]] }));

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
      [yAxis]: { formatter: v => thousandsSeparator(v) },
    },
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={RangeColumn} config={config} />;
};

export default RangeColumnChart;
