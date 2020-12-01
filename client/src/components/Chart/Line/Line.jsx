import React from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';

// Utils
import { thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const LineComp = ({ data, chartID, configuration, hasClickEvent, interactiveClick, interactiveObj }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue },
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue },
    groupBy: { type: groupByType = 'string', value: groupByValue },
    showDataLabels = false,
    sortBy = {},
  } = configuration;
  const { order: sortOrder = 'asc', type: sortType = 'string', value: sortValue = '' } = sortBy;

  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [groupByValue]:
      groupByType === 'date'
        ? moment(String(row[groupByValue])).format('L')
        : groupByType === 'number'
        ? Number(row[groupByValue])
        : String(row[groupByValue]),
    [xValue]:
      xType === 'date'
        ? moment(String(row[xValue])).format('L')
        : xType === 'number'
        ? Number(row[xValue])
        : String(row[xValue]),
    [yValue]:
      yType === 'date'
        ? moment(String(row[yValue])).format('L')
        : yType === 'number'
        ? Number(row[yValue])
        : String(row[yValue]),
  }));

  // Determine how to sort data array
  if (sortValue === '' || sortValue === xValue) {
    data = sortArr(data, xValue, sortOrder);
  } else {
    // Convert necessary values to specified data type
    data = data.map(row => ({
      ...row,
      [sortValue]:
        sortType === 'date'
          ? moment(String(row[sortValue])).format('L')
          : sortType === 'number'
          ? Number(row[sortValue])
          : String(row[sortValue]),
    }));

    data = sortArr(data, sortValue, sortOrder);
  }

  const chartConfig = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'top',
      style: { fontSize: 12 },
      visible: showDataLabels,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    lineStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Change non-clicked lines to dashed and reduce opacity
      if (chartID === objID && (field === customXLabel || field === groupByValue) && d !== value) {
        return { lineDash: [3, 3], opacity: 0.3 };
      }

      return;
    },
    meta: { [yValue]: { formatter: v => thousandsSeparator(v) } },
    point: { visible: true },
    seriesField: groupByValue,
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
  if (hasClickEvent) {
    chartConfig.events = {
      onLineClick: ({ data }) =>
        groupByValue ? interactiveClick(chartID, groupByValue, data[0][groupByValue]) : null,
      onPointClick: ({ data }) =>
        groupByValue
          ? interactiveClick(chartID, groupByValue, data[groupByValue])
          : interactiveClick(chartID, customXLabel, data[xValue]),
    };
  }

  return <Line {...chartConfig} />;
};

export default LineComp;
