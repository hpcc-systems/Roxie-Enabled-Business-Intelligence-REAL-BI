import React from 'react';
import ReactChart from './ReactChart';

const colorList = ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'];

const HeatMap = ({ data, options }) => {
  const { colorField, xAxis, yAxis, xAxis_Label, yAxis_Label } = options;

  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Convert necessary values to String
  data = data.map(row => ({
    ...row,
    [xAxis]: String(row[xAxis]),
    [yAxis]: String(row[yAxis]),
  }));

  const config = {
    data,
    forceFit: false,
    shapeType: 'rect',
    color: colorList,
    xAxis: {
      min: 2,
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    yAxis: {
      min: 2,
      title: {
        visible: true,
        text: customYLabel,
      },
    },
    xField: xAxis,
    yField: yAxis,
    colorField: colorField,
    meta: {
      [xAxis]: {
        type: 'cat',
      },
    },
  };

  return <ReactChart config={config} />;
};

export default HeatMap;
