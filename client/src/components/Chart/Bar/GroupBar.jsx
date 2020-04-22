import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { GroupedBar } from '@antv/g2plot';

// Constants
import { thousandsSeparator } from '../../../constants';

const GroupBarChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis } = options;

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'middle',
      style: { fontSize: 12 },
      visible: true,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    groupField: groupBy,
    xAxis: { min: 0 },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      min: 0,
    },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={GroupedBar} config={config} />;
};

export default GroupBarChart;