import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { GroupedBar } from '@antv/g2plot';

// Utils
import { checkForNumber, thousandsSeparator } from '../../../utils/misc';

const GroupBarChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label } = options;

  let customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  let customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

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
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      title: {
        visible: true,
        text: customYLabel,
      },
    },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={GroupedBar} config={config} />;
};

export default GroupBarChart;
