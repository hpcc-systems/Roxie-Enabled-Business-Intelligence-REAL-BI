import React from 'react';
import { Heatmap } from '@ant-design/charts';

// Utils
import { thousandsSeparator, sortArr } from '../../utils/misc';

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
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      visible: true,
    },
    shapeType: 'rect',
    sizeField: colorField,
    color: colorList,
    colorField: colorField,
    meta: {
      [xAxis]: {
        type: 'cat',
      },
    },
    xAxis: {
      title: {
        visible: true,
        text: customXLabel,
        fill: '#333',
      },
    },
    xField: xAxis,
    yAxis: {
      title: {
        visible: true,
        text: customYLabel,
        fill: '#333',
      },
    },
    yField: yAxis,
  };

  return <Heatmap {...chartConfig} />;
};

export default HeatMapComp;
