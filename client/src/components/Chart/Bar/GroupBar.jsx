import React from 'react';
import { GroupedBar } from '@ant-design/charts';
import moment from 'moment';

// Utils
import { thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const GroupBarComp = ({ chartID, data, config, interactiveClick, interactiveObj, relations }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue },
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue },
    groupBy: { type: groupByType = 'string', value: groupByValue },
    sortBy = {},
  } = config;
  const { order: sortOrder = 'asc', type: sortType = 'string', value: sortValue = '' } = sortBy;

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

  // Have to reverse sortOrder due to groupbar chart sorting inversely from other charts
  const reverseSort = sortOrder === 'asc' ? 'desc' : 'asc';

  // Determine how to sort data array
  if (sortValue === '' || sortValue === yValue) {
    data = sortArr(data, yValue, reverseSort);
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

    data = sortArr(data, sortValue, reverseSort);
  }

  console.log(data);

  const chartConfig = {
    barStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Highlight columns from click event
      if (chartID === objID && field === groupByValue && d === value) {
        return { stroke: 'red' };
      }

      return;
    },
    data,
    forceFit: true,
    groupField: groupByValue,
    label: { visible: false },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: { [xValue]: { formatter: v => thousandsSeparator(v) } },
    xAxis: {
      grid: { visible: true },
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
      onBarClick: ({ data }) => interactiveClick(chartID, groupByValue, data[groupByValue]),
    };
  }

  return <GroupedBar {...chartConfig} />;
};

export default GroupBarComp;
