import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Heatmap } from '@antv/g2plot';

const colorList = ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'];

const HeatMap = ({ data, options }) => {
  const { colorField, xAxis, yAxis, xAxis_Label, yAxis_Label } = options;

  let customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  let customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

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

  return <ReactG2Plot Ctor={Heatmap} config={config} />;
};

export default HeatMap;
