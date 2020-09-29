import React from 'react';
import { Histogram } from '@ant-design/charts';
import moment from 'moment';

// Utils
import { sortArr } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

const HistogramComp = ({ data, config }) => {
  const {
    axis1: { label: xLabel, type: xType = 'string', value: xValue },
    binNumber,
  } = config;

  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !binNumber || isNaN(binNumber)) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [xValue]:
      xType === 'date'
        ? moment(String(row[xValue])).format('L')
        : xType === 'number'
        ? Number(row[xValue])
        : String(row[xValue]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xValue, sortOrder);

  const chartConfig = {
    data,
    forceFit: true,
    label: { visible: false },
    legend: {
      position: 'right-top',
      visible: true,
    },
    xAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: true,
      },
      min: 0,
      title: {
        style: { fill: chartFillColor },
        text: customXLabel,
        visible: true,
      },
    },
    binField: xValue,
    binNumber: binNumber,
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
      min: 0,
      title: {
        style: { fill: chartFillColor },
        visible: true,
      },
    },
  };

  return <Histogram {...chartConfig} />;
};

export default HistogramComp;
