import React from 'react';
import { Heatmap } from '@ant-design/charts';
import _orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { formatValue } from '../../utils/misc';
import { chartFillColor } from '../../constants';

const colorList = ['#dddddd', '#9ec8e0', '#5fa4cd', '#2e7ab6', '#114d90'];

const HeatmapChart = ({ data, configuration, pdfPreview }) => {
  const {
    axis1: { label: xLabel, type: xType = 'string', value: xValue } = {},
    axis2: { label: yLabel, type: yType = 'string', value: yValue } = {},
    colorField,
    showDataLabels,
    sortBy: { order = 'asc', type: sortType = 'string', value: sortValue = xValue } = {},
  } = configuration;
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !colorField || !xValue || !yValue) {
    return null;
  }

  // Convert necessary values to strings
  data = data.map(row => ({
    ...row,
    [xValue]: String(formatValue(xType, row[xValue])),
    [yValue]: String(formatValue(yType, row[yValue])),
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
    appendPadding: [24, 0, 0, 0],
    color: colorList,
    colorField,
    data,
    forceFit: true,
    padding: 'auto',
    shape: 'square',
    sizeField: colorField,
    tooltip: { showContent: !pdfPreview },
    xAxis: { title: { style: { fill: chartFillColor }, text: customXLabel } },
    xField: xValue,
    yAxis: { title: { style: { fill: chartFillColor }, text: customYLabel } },
    yField: yValue,
  };

  // Add data labels property
  if (showDataLabels) {
    chartConfig.label = {
      formatter: row => {
        const value = row[colorField];
        return isNaN(value) ? value : Intl.NumberFormat('en-US').format(value);
      },
      style: { fill: chartFillColor, fontSize: 14 },
    };
  } else {
    chartConfig.label = null;
  }

  return <Heatmap {...chartConfig} />;
};

HeatmapChart.defaultProps = {
  configuration: {},
  data: [],
  pdfPreview: false,
};

HeatmapChart.propTypes = {
  configuration: PropTypes.shape({
    axis1: PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    axis2: PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    colorField: PropTypes.string,
    showDataLabels: PropTypes.bool,
    sortBy: PropTypes.shape({
      order: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }),
  }).isRequired,
  data: PropTypes.array,
  pdfPreview: PropTypes.bool,
};

export default HeatmapChart;
