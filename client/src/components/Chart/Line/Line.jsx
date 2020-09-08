import React from 'react';
import { Line } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const LineComp = ({ data, chartID, config, interactiveClick, interactiveObj, relations }) => {
  const {
    axis1: { label: xLabel, value: xValue, showTickLabels: xShowTickLabels },
    axis2: { label: yLabel, value: yValue, showTickLabels: yShowTickLabels },
    groupBy,
  } = config;

  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue) {
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
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'top',
      style: { fontSize: 12 },
      visible: groupBy ? false : true,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    lineStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Change non-clicked lines to dashed and reduce opacity
      if (chartID === objID && (field === customXLabel || field === groupBy) && d !== value) {
        return { lineDash: [3, 3], opacity: 0.3 };
      }

      return;
    },
    meta: { [yValue]: { formatter: v => thousandsSeparator(v) } },
    point: { visible: true },
    seriesField: groupBy,
    smooth: true,
    xField: xValue,
    xAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: xShowTickLabels,
      },
      title: {
        style: { fill: chartFillColor },
        text: customXLabel,
        visible: true,
      },
    },
    yField: yValue,
    yAxis: {
      grid: { visible: true },
      label: {
        style: { fill: chartFillColor },
        visible: yShowTickLabels,
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

  // Add click events
  if (relations[chartID]) {
    chartConfig.events = {
      onLineClick: ({ data }) => (groupBy ? interactiveClick(chartID, groupBy, data[0][groupBy]) : null),
      onPointClick: ({ data }) =>
        groupBy
          ? interactiveClick(chartID, groupBy, data[groupBy])
          : interactiveClick(chartID, customXLabel, data[xValue]),
    };
  }

  return <Line {...chartConfig} />;
};

export default LineComp;
