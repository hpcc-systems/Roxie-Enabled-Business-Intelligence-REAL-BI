import React from 'react';
import { Bar } from '@ant-design/charts';
import _ from 'lodash';

// Utils
import { thousandsSeparator, formatValue } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const BarComp = ({
  chartID,
  data,
  configuration,
  hasClickEvent,
  interactiveClick,
  interactiveObj,
  pdfPreview,
}) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue },
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue },
    showDataLabels = false,
    sortBy = {},
  } = configuration;
  const { order: sortOrder = 'asc', type: sortType = 'string', value: sortValue = yValue } = sortBy;

  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [xValue]: formatValue(xType, row[xValue]),
    [yValue]: formatValue(yType, row[yValue]),
  }));

  // Determine how to sort data array
  /*
    If sortValue === yValue then when mapping over array, create a new key in object to prevent overwriting
    the formatted ouput the user sees on the chart
  */
  if (sortValue === yValue) {
    data = data.map(row => ({ ...row, [`sort${sortValue}`]: formatValue(sortType, row[sortValue], true) }));
    data = _.orderBy(data, [`sort${sortValue}`], [sortOrder]);
  } else {
    data = data.map(row => ({ ...row, [sortValue]: formatValue(sortType, row[sortValue], true) }));
    data = _.orderBy(data, [sortValue], [sortOrder]);
  }

  const chartConfig = {
    barStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Highlight columns from click event
      if (chartID === objID && field === customYLabel && d === value) {
        return { stroke: 'red' };
      }

      return;
    },
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'right',
      style: { fontSize: 12 },
      visible: showDataLabels,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: { [xValue]: { formatter: v => thousandsSeparator(v) } },
    tooltip: { visible: !pdfPreview },
    xAxis: {
      grid: { visible: true },
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
  if (hasClickEvent) {
    chartConfig.events = {
      onBarClick: ({ data }) => interactiveClick(chartID, customYLabel, data[yValue]),
    };
  }

  return <Bar {...chartConfig} />;
};

export default BarComp;
