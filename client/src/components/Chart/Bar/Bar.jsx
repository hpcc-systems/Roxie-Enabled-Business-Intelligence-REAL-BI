import React, { useRef } from 'react';
import { BarChart } from '@opd/g2plot-react';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

const Bar = ({ data, options }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label, description } = options;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xAxis, sortOrder);

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'right',
      style: { fontSize: 12 },
      visible: true,
    },
    description: {
      visible: true,
      text: description,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    stackField: groupBy,
    xAxis: {
      grid: { visible: true },
      label: { visible: true },
      min: 0,
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      min: 0,
      title: {
        visible: true,
        text: customYLabel,
      },
    },
    yField: yAxis,
  };

  const chartRef = useRef();
  return <BarChart {...config} chartRef={chartRef} />;
};

export default Bar;
