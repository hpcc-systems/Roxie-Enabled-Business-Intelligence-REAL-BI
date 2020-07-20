import React, { useRef } from 'react';
import { LineChart } from '@opd/g2plot-react';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../utils/misc';

const Line = ({ data, options }) => {
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
      position: 'top',
      style: {
        fontSize: 12,
      },
      visible: true,
    },
    description: {
      visible: true,
      text: description,
    },
    legend: {
      position: 'bottom',
      visible: true,
    },
    meta: {
      [yAxis]: {
        formatter: v => thousandsSeparator(v),
      },
    },
    point: {
      visible: true,
    },
    seriesField: groupBy,
    smooth: true,
    xField: xAxis,
    xAxis: {
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    yField: yAxis,
    yAxis: {
      title: {
        visible: true,
        text: customYLabel,
      },
    },
  };

  const chartRef = useRef();
  return <LineChart {...config} chartRef={chartRef} />;
};

export default Line;
