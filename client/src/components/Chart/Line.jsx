import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Line } from '@antv/g2plot';

// Utils
import { checkForNumber, thousandsSeparator } from '../../utils/misc';

const LineChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label } = options;
  let customXLabel = xAxis_Label ? xAxis_Label : xAxis;
  let customYLabel = yAxis_Label ? yAxis_Label : yAxis;

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
    seriesField: groupBy,
    smooth: true,
    xField: xAxis,
    xAxis: {
      min: 0,
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    yField: yAxis,
    yAxis: {
      min: 0,
      title: {
        visible: true,
        text: customYLabel,
      },
    },
  };

  return <ReactG2Plot Ctor={Line} config={config} />;
};

export default LineChart;
