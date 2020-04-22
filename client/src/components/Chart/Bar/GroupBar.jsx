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
      position: 'right',
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
    xAxis: {
      grid: { visible: true },
      label: { visible: true },
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
    },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={GroupedBar} config={config} />;
};

export default GroupBarChart;
