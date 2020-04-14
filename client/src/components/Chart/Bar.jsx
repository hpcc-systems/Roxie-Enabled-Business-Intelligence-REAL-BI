import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { StackedColumn } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../constants';

const BarChartComp = ({ data, groupBy, options }) => {
  const { xAxis, yAxis } = options;

  const config = {
    data,
    forceFit: true,
    legend: {
      position: 'bottom',
      visible: true,
    },
    meta: {
      [yAxis]: {
        formatter: v => thousandsSeparator(v),
      },
    },
    responsive: true,
    xField: xAxis,
    yAxis: {
      min: 0,
    },
    yField: yAxis,
  };

  // Add key to config object, if groupBy is populated
  if (groupBy) {
    config.stackField = groupBy;
  }

  return <ReactG2Plot Ctor={StackedColumn} config={config} />;
};

export default BarChartComp;
