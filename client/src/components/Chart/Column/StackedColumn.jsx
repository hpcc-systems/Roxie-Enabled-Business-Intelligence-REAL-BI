import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { StackedColumn } from '@antv/g2plot';

// Utils
import { checkForNumber, thousandsSeparator } from '../../../utils/misc';

const StackedColumnChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis } = options;

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

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
      [yAxis]: { formatter: v => thousandsSeparator(v) },
    },
    stackField: groupBy,
    xField: xAxis,
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={StackedColumn} config={config} />;
};

export default StackedColumnChart;
