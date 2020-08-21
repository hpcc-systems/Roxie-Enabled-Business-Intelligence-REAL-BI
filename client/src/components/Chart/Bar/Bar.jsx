import React from 'react';
import { Bar } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const BarComp = ({ data, config }) => {
  const { xAxis, yAxis, xAxis_Label, yAxis_Label } = config;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xAxis || !yAxis) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xAxis, sortOrder);

  const chartConfig = {
    data,
    forceFit: true,
    label: { visible: false },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    xAxis: {
      grid: { visible: true },
      label: { visible: true },
      min: 0,
      title: {
        visible: true,
        text: customXLabel,
        fill: chartFillColor,
      },
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      min: 0,
      title: {
        visible: true,
        text: customYLabel,
        fill: chartFillColor,
      },
    },
    yField: yAxis,
  };

  return <Bar {...chartConfig} />;
};

export default BarComp;
