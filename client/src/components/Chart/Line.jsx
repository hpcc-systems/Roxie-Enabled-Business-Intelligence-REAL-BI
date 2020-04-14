import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Line } from '@antv/g2plot';

// Constants
import { thousandsSeparater } from '../../constants';

const LineChartComp = ({ data, groupBy, options }) => {
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

export default LineChartComp;
