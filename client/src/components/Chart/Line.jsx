import React from 'react';
import { Line } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

const LineComp = ({ data, config }) => {
  const {
    axis1: { label: xLabel, value: xValue },
    axis2: { label: yLabel, value: yValue },
    groupBy,
  } = config;

  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xValue]: checkForNumber(row[xValue]),
    [yValue]: checkForNumber(row[yValue]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xValue, sortOrder);

  const chartConfig = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'top',
      style: { fontSize: 12 },
      visible: true,
    },
    legend: {
      position: 'bottom',
      visible: true,
    },
    meta: { [yValue]: { formatter: v => thousandsSeparator(v) } },
    point: { visible: true },
    seriesField: groupBy,
    smooth: true,
    xField: xValue,
    xAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: true,
      },
      title: {
        style: { fill: chartFillColor },
        text: customXLabel,
        visible: true,
      },
    },
    yField: yValue,
    yAxis: {
      grid: { visible: true },
      label: {
        style: { fill: chartFillColor },
        visible: true,
      },
      line: {
        style: { fill: chartFillColor },
        visible: true,
      },
      title: {
        style: { fill: chartFillColor },
        text: customYLabel,
        visible: true,
      },
    },
  };

  return <Line {...chartConfig} />;
};

export default LineComp;
