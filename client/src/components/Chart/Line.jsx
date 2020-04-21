import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Line } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../constants';

const LineChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis } = options;

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'top',
      style: {
        fontSize: 12,
      },
      visible: true,
    },
    legend: {
      position: 'bottom',
      visible: true,
    },
    meta: {
      [yAxis]: {
        formatter: v => thousandsSeparator(v),
      },
    },
    point: {
      visible: true,
    },
    seriesField: groupBy,
    smooth: true,
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={Line} config={config} />;
};

export default LineChart;
