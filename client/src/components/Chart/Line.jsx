import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Line } from '@antv/g2plot';

// Constants
import { thousandsSeparater } from '../../constants';

const LineChartComp = ({ data, options }) => {
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
    seriesField: 'state',
    smooth: true,
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={Line} config={config} />;
};

export default LineChartComp;
