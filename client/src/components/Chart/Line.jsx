import React from 'react';
import { Line } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

const LineComp = ({ data, config }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label } = config;

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
    meta: { [yAxis]: { formatter: v => thousandsSeparator(v) } },
    point: { visible: true },
    seriesField: groupBy,
    smooth: true,
    xField: xAxis,
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
    yField: yAxis,
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
