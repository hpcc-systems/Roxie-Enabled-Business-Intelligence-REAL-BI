import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Heatmap } from '@antv/g2plot';

const colorList = ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'];

const HeatMap = ({ data, options }) => {
  const { colorField, xAxis, yAxis, xAxis_Label, yAxis_Label } = options;

  let customXLabel = xAxis_Label ? xAxis_Label : xAxis;
  let customYLabel = yAxis_Label ? yAxis_Label : yAxis;

  // Convert necessary values to String
  data.forEach(row => {
    row[xAxis] = String(row[xAxis]);
    row[yAxis] = String(row[yAxis]);
  });

  const config = {
    data,
    forceFit: false,
    width: 600,
    xField: xAxis,
    yField: yAxis,
    colorField: colorField,
    shapeType: 'rect',
    color: colorList,
    meta: {
      [xAxis]: {
        type: 'cat',
      },
    },
    xAxis: {
      min: 0,
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    yAxis: {
      min: 0,
      title: {
        visible: true,
        text: customYLabel,
      },
    },
  };

  return <ReactG2Plot Ctor={Heatmap} config={config} />;
};

export default HeatMap;
