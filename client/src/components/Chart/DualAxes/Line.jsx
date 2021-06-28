import React from 'react';
import { DualAxes } from '@ant-design/charts';
import _orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { formatValue } from '../../../utils/misc';
import { chartFillColor } from '../../../constants';

const DualAxesLineChart = ({ configuration, data, pdfPreview }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue } = {},
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue } = {},
    axis3: { label: yLabel2, showTickLabels: yShowTickLabels2, type: yType2 = 'string', value: yValue2 } = {},
    groupBy: { type: groupByType = 'string', value: groupByValue = '' } = {},
    groupBy2: { type: groupByType2 = 'string', value: groupByValue2 = '' } = {},
    showDataLabels,
    showDataLabels2,
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
    [groupByValue]: formatValue(groupByType, row[groupByValue]),
    [groupByValue2]: formatValue(groupByType2, row[groupByValue2]),
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
    data = _orderBy(data, [`sort${sortValue}`], [order]);
  } else {
    data = data.map(row => ({ ...row, [sortValue]: formatValue(sortType, row[sortValue], true) }));
    data = _orderBy(data, [sortValue], [order]);
  }

  const chartConfig = {
    appendPadding: [40, 0, 0, 0],
    autoFit: true,
    legend: { position: 'right-top' },
    data: [data, data],
    geometryOptions: [
      { geometry: 'line', point: 4 },
      {
        geometry: 'line',
        lineStyle: { lineDash: [10, 5] },
        point: 4,
      },
    ],
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

  // Add data labels property
  if (showDataLabels) {
    chartConfig.geometryOptions[0].label = {
      formatter: row => {
        const value = row[yValue];
        return isNaN(value) ? value : Intl.NumberFormat('en-US').format(value);
      },
      style: { fill: chartFillColor, fontSize: 12 },
    };
  } else {
    chartConfig.geometryOptions[0].label = null;
  }

  if (showDataLabels2) {
    chartConfig.geometryOptions[1].label = {
      formatter: row => {
        const value = row[yValue2];
        return isNaN(value) ? value : Intl.NumberFormat('en-US').format(value);
      },
      style: { fill: chartFillColor, fontSize: 12 },
    };
  } else {
    chartConfig.geometryOptions[1].label = null;
  }

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

  // Add groupby
  if (groupByValue) {
    chartConfig.geometryOptions[0].seriesField = groupByValue;
  } else {
    chartConfig.geometryOptions[0].seriesField = null;
  }

  if (groupByValue2) {
    chartConfig.geometryOptions[1].seriesField = groupByValue2;
  } else {
    chartConfig.geometryOptions[1].seriesField = null;
  }

  return <DualAxes {...chartConfig} />;
};

DualAxesLineChart.defaultProps = {
  configuration: {},
  data: [],
  pdfPreview: false,
};

DualAxesLineChart.propTypes = {
  configuration: PropTypes.shape({
    axis1: PropTypes.shape({
      label: PropTypes.string,
      showTickLabels: PropTypes.bool,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    axis2: PropTypes.shape({
      label: PropTypes.string,
      showTickLabels: PropTypes.bool,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    axis3: PropTypes.shape({
      label: PropTypes.string,
      showTickLabels: PropTypes.bool,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    groupBy: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    }),
    groupBy2: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    }),
    showDataLabels: PropTypes.bool,
    showDataLabels2: PropTypes.bool,
    sortBy: PropTypes.shape({
      order: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }),
  }).isRequired,
  data: PropTypes.array,
  pdfPreview: PropTypes.bool,
};

export default DualAxesLineChart;
