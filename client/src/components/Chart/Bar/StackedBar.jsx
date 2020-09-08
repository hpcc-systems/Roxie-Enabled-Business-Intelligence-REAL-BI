import React from 'react';
import { StackedBar } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const StackedBarComp = ({ chartID, data, config, interactiveClick, interactiveObj, relations }) => {
  const {
    axis1: { label: xLabel, value: xValue, showTickLabels: xShowTickLabels },
    axis2: { label: yLabel, value: yValue, showTickLabels: yShowTickLabels },
    groupBy,
  } = config;

  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue || !groupBy) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xValue]: checkForNumber(row[xValue]),
    [yValue]: checkForNumber(row[yValue]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xValue, sortOrder);

  const chartConfig = {
    barStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Highlight columns from click event
      if (chartID === objID && field === groupBy && d === value) {
        return { stroke: 'red' };
      }

      return;
    },
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'middle',
      style: { fontSize: 12 },
      visible: true,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: { [xValue]: { formatter: v => thousandsSeparator(v) } },
    stackField: groupBy,
    xAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: xShowTickLabels,
      },
      line: {
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
    xField: xValue,
    yAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: yShowTickLabels,
      },
      line: {
        style: { fill: chartFillColor },
        visible: true,
      },
      min: 0,
      title: {
        style: { fill: chartFillColor },
        text: customYLabel,
        visible: true,
      },
    },
    yField: yValue,
  };

  // Add click events
  if (relations[chartID]) {
    chartConfig.events = {
      onBarClick: ({ data }) => interactiveClick(chartID, groupBy, data[groupBy]),
    };
  }

  return <StackedBar {...chartConfig} />;
};

export default StackedBarComp;
