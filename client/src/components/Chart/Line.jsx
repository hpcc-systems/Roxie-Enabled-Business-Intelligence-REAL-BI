import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Line } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../constants';

const LineChart = ({ data, groupBy, options }) => {
  const { xAxis, yAxis } = options;

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
    smooth: true,
    xField: xAxis,
    yField: yAxis,
  };

  // Add key to config object, if groupBy is populated
  if (groupBy) {
    config.seriesField = groupBy;
  }

  return <ReactG2Plot Ctor={Line} config={config} />;
};

export default LineChart;
