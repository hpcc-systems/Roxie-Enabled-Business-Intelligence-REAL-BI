import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { GroupedColumn } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../constants';

const GroupColumnChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis } = options;

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [yAxis]: { formatter: v => thousandsSeparator(v) },
    },
    groupField: groupBy,
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={GroupedColumn} config={config} />;
};

export default GroupColumnChart;
