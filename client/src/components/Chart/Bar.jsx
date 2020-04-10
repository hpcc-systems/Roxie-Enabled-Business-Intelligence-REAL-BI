import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { StackedColumn } from '@antv/g2plot';

// Constants
import { thousandsSeparater } from '../../constants';

const BarChartComp = ({ data, options }) => {
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
        formatter: v => thousandsSeparater(v),
      },
    },
    responsive: true,
    stackField: 'state',
    xField: xAxis,
    yAxis: {
      min: 0,
    },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={StackedColumn} config={config} />;
};

export default BarChartComp;
