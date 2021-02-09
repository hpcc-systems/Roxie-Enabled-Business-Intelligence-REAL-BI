import React from 'react';
import { DualAxes } from '@ant-design/charts';
import _ from 'lodash';
import { formatValue } from '../../../utils/misc';
import { chartFillColor } from '../../../constants';

const DualAxesLineChart = ({ data, configuration, pdfPreview }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue } = {},
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue } = {},
    axis3: { label: yLabel2, showTickLabels: yShowTickLabels2, type: yType2 = 'string', value: yValue2 } = {},
    sortBy: { order = 'asc', type: sortType = 'string', value: sortValue = xValue } = {},
  } = configuration;
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;
  const customYLabel2 = yLabel2 ? yLabel2 : yValue2;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue || !yValue2) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [xValue]: formatValue(xType, row[xValue]),
    [yValue]: formatValue(yType, row[yValue]),
    [yValue2]: formatValue(yType2, row[yValue2]),
  }));

  // Determine how to sort data array
  /*
    If sortValue === xValue then when mapping over array, create a new key in object to prevent overwriting
    the formatted ouput the user sees on the chart
  */
  if (sortValue === xValue) {
    data = data.map(row => ({ ...row, [`sort${sortValue}`]: formatValue(sortType, row[sortValue], true) }));
    data = _.orderBy(data, [`sort${sortValue}`], [order]);
  } else {
    data = data.map(row => ({ ...row, [sortValue]: formatValue(sortType, row[sortValue], true) }));
    data = _.orderBy(data, [sortValue], [order]);
  }

  const chartConfig = {
    data: [data, data],
    forceFit: true,
    geometryOptions: [
      { geometry: 'line', point: 4 },
      { geometry: 'line', point: 4 },
    ],
    legend: { position: 'right-top' },
    meta: {
      [yValue]: {
        formatter: value => (isNaN(value) ? value : Intl.NumberFormat('en-US').format(value)),
      },
      [yValue2]: {
        formatter: value => (isNaN(value) ? value : Intl.NumberFormat('en-US').format(value)),
      },
    },
    tooltip: { showContent: !pdfPreview },
    xAxis: { title: { style: { fill: chartFillColor }, text: customXLabel } },
    xField: xValue,
    yAxis: {
      [yValue]: { title: { style: { fill: chartFillColor }, text: customYLabel } },
      [yValue2]: { title: { style: { fill: chartFillColor }, text: customYLabel2 } },
    },
    yField: [yValue, yValue2],
  };

  if (xShowTickLabels) {
    chartConfig.xAxis.label = { style: { fill: chartFillColor } };
  } else {
    chartConfig.xAxis.label = null;
  }

  if (yShowTickLabels) {
    chartConfig.yAxis[yValue].label = { style: { fill: chartFillColor } };
  } else {
    chartConfig.yAxis[yValue].label = null;
  }

  if (yShowTickLabels2) {
    chartConfig.yAxis[yValue2].label = { style: { fill: chartFillColor } };
  } else {
    chartConfig.yAxis[yValue2].label = null;
  }

  return <DualAxes {...chartConfig} />;
};

export default DualAxesLineChart;
