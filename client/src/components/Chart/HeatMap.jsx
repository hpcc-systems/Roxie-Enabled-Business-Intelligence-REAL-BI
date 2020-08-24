import React from 'react';
import { Heatmap } from '@ant-design/charts';

// Utils
import { thousandsSeparator, sortArr } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

const colorList = ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'];

const HeatMapComp = ({ data, config }) => {
  const { colorField, xAxis, yAxis, xAxis_Label, yAxis_Label } = config;
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !colorField || !xAxis || !yAxis) {
    return null;
  }

  // Convert necessary values to a string
  data.forEach(row => {
    row[xAxis] = String(row[xAxis]);
    row[yAxis] = String(row[yAxis]);
  });

  // Sort data in ascending order
  data = sortArr(data, xAxis, 'asc');

  const chartConfig = {
    color: colorList,
    colorField: colorField,
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      visible: true,
    },
    meta: { [xAxis]: { type: 'cat' } },
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
    xField: xAxis,
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
    yField: yAxis,
  };

  return <Heatmap {...chartConfig} />;
};

export default HeatMapComp;
