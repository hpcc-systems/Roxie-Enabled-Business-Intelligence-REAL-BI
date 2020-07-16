import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Bar } from '@antv/g2plot';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

const BarChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label, chartDescription, dateAndTime } = options;

  const sortOrder = 'asc';
  const description = chartDescription ? chartDescription : '' + ' Created: ' + dateAndTime;
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xAxis, sortOrder);

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'right',
      style: { fontSize: 12 },
      visible: true,
    },
    description: {
      visible: true,
      text: description,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    stackField: groupBy,
    xAxis: {
      grid: { visible: true },
      label: { visible: true },
      min: 0,
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      min: 0,
      title: {
        visible: true,
        text: customYLabel,
      },
    },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={Bar} config={config} />;
};

export default BarChart;
