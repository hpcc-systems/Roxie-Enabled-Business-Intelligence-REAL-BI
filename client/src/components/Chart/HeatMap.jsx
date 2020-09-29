import React from 'react';
import { Heatmap } from '@ant-design/charts';

// Utils
import { thousandsSeparator, sortArr } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

const colorList = ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'];

const HeatMapComp = ({ data, config }) => {
  const {
    axis1: { label: xLabel, value: xValue },
    axis2: { label: yLabel, value: yValue },
    colorField,
  } = config;

  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !colorField || !xValue || !yValue) {
    return null;
  }

  // Convert necessary values to strings
  data = data.map(row => ({
    ...row,
    [xValue]: String(row[xValue]),
    [yValue]: String(row[yValue]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xValue, sortOrder);

  const chartConfig = {
    color: colorList,
    colorField: colorField,
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      visible: true,
    },
    meta: { [xValue]: { type: 'cat' } },
    shapeType: 'rect',
    sizeField: colorField,
    tooltip: {
      formatter: v => ({
        name: colorField,
        value: thousandsSeparator(v),
      }),
      style: { fill: chartFillColor },
      title: ' ', // Have to pass in a space or it will duplicate information
    },
    xAxis: {
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
        text: customXLabel,
        visible: true,
      },
    },
    xField: xValue,
    yAxis: {
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
    yField: yValue,
  };

  return <Heatmap {...chartConfig} />;
};

export default HeatMapComp;
