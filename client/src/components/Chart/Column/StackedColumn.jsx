import React from 'react';
import { StackedColumn } from '@ant-design/charts';
import moment from 'moment';

// Utils
import { thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const StackedColumnComp = ({ chartID, data, config, interactiveClick, interactiveObj, relations }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue },
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue },
    groupBy: { type: groupByType = 'string', value: groupByValue },
  } = config;

  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue || !groupByValue) {
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

  // Sort data in ascending order
  data = sortArr(data, xValue, sortOrder);

  const chartConfig = {
    columnStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Highlight columns from click event
      if (chartID === objID && field === groupByValue && d === value) {
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
    meta: { [yValue]: { formatter: v => thousandsSeparator(v) } },
    stackField: groupByValue,
    xAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: xShowTickLabels,
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
      grid: { visible: true },
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
      onColumnClick: ({ data }) => interactiveClick(chartID, groupByValue, data[groupByValue]),
    };
  }

  return <StackedColumn {...chartConfig} />;
};

export default StackedColumnComp;
