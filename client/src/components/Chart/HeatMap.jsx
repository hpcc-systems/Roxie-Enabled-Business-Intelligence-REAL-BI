import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Heatmap } from '@antv/g2plot';

// Utils
import { checkForNumber } from '../../utils/misc';

const colorList = ['#174c83', '#7eb6d4', '#efefeb', '#efa759', '#9b4d16'];

const HeatMap = ({ data, options }) => {
  const { colorField, xAxis, yAxis } = options;

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

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
  };

  return <ReactG2Plot Ctor={Heatmap} config={config} />;
};

export default HeatMap;
