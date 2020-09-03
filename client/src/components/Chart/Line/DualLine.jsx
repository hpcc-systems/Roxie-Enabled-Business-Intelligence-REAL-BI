import React from 'react';
import { DualLine } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const DualLineComp = ({ data, config }) => {
  const {
    axis1: { label: xLabel, value: xValue },
    axis2: { value: yValue1 },
    axis3: { value: yValue2 },
  } = config;

  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue1 || !yValue2) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xValue]: checkForNumber(row[xValue]),
    [yValue1]: checkForNumber(row[yValue1]),
    [yValue2]: checkForNumber(row[yValue2]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xValue, sortOrder);

  const chartConfig = {
    data: [data, data],
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
    meta: {
      yValue1: { formatter: v => thousandsSeparator(v) },
      yValue2: { formatter: v => thousandsSeparator(v) },
    },
    lineConfigs: [
      {
        smooth: true,
        point: { visible: true },
        color: '#5c90f9',
      },
      {
        smooth: true,
        point: { visible: true },
        color: '#e76c5e',
      },
    ],
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
    yField: [yValue1, yValue2],
  };

  return <DualLine {...chartConfig} />;
};

export default DualLineComp;
