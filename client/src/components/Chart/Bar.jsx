import React, { useEffect, useRef } from 'react';
import { Bar } from '@ant-design/charts';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { formatValue } from '../../utils/misc';
import { chartFillColor } from '../../constants';

const BarChart = ({ chartID, chartRelation, configuration, data, interactiveClick, pdfPreview }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue } = {},
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue } = {},
    groupBy: { type: groupByType = 'string', value: groupByValue } = {},
    percentageStack,
    showDataLabels,
    sortBy: { order = 'asc', type: sortType = 'string', value: sortValue = yValue } = {},
    stacked,
  } = configuration;
  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [groupByValue]: formatValue(groupByType, row[groupByValue]),
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
    data = _.orderBy(data, [`sort${sortValue}`], [order]);
  } else {
    data = data.map(row => ({ ...row, [sortValue]: formatValue(sortType, row[sortValue], true) }));
    data = _.orderBy(data, [sortValue], [order]);
  }

  const chartConfig = {
    appendPadding: [24, 0, 0, 0],
    data,
    forceFit: true,
    legend: { position: 'right-top' },
    meta: {
      [xValue]: {
        formatter: value => {
          return isNaN(value)
            ? value
            : percentageStack
            ? `${(value * 100).toFixed(2)}%`
            : Intl.NumberFormat('en-US').format(value);
        },
      },
    },
    padding: 'auto',
    tooltip: { showContent: !pdfPreview },
    xAxis: {
      min: 0,
      title: { style: { fill: chartFillColor }, text: customXLabel },
    },
    xField: xValue,
    yAxis: {
      min: 0,
      title: { style: { fill: chartFillColor }, text: customYLabel },
    },
    yField: yValue,
  };

  // Add data labels property
  if (showDataLabels) {
    chartConfig.label = {
      formatter: row => {
        const value = row[xValue];

        return isNaN(value)
          ? value
          : percentageStack
          ? `${(value * 100).toFixed(2)}%`
          : Intl.NumberFormat('en-US').format(value);
      },
      position: stacked ? 'middle' : 'right',
      style: { fill: chartFillColor, fontSize: 12 },
    };
  } else {
    chartConfig.label = null;
  }

  if (xShowTickLabels) {
    chartConfig.xAxis.label = { style: { fill: chartFillColor } };
  } else {
    chartConfig.xAxis.label = null;
  }

  if (yShowTickLabels) {
    chartConfig.yAxis.label = { style: { fill: chartFillColor } };
  } else {
    chartConfig.yAxis.label = null;
  }

  // Add groupby and stacked
  if (groupByValue) {
    if (percentageStack) {
      chartConfig.isPercent = true;
      chartConfig.isStack = true;
      chartConfig.isGroup = null;
    } else if (stacked) {
      chartConfig.isPercent = null;
      chartConfig.isStack = true;
      chartConfig.isGroup = null;
    } else {
      chartConfig.isPercent = null;
      chartConfig.isStack = null;
      chartConfig.isGroup = true;
    }

    chartConfig.seriesField = groupByValue;
  } else {
    chartConfig.isPercent = null;
    chartConfig.isStack = null;
    chartConfig.isGroup = null;
    chartConfig.seriesField = null;
  }

  // Add click event
  const ref = useRef();
  useEffect(() => {
    if (ref.current && chartRelation && chartRelation?.sourceID === chartID) {
      ref.current.on('element:click', args => {
        const row = args.data.data;
        interactiveClick(chartID, chartRelation.sourceField, row[chartRelation.sourceField]);
      });
    }
  }, []);

  return <Bar {...chartConfig} chartRef={ref} />;
};

BarChart.defaultProps = {
  chartID: '',
  chartRelation: {},
  configuration: {},
  data: [],
  interactiveClick: () => {},
  pdfPreview: false,
};

BarChart.propTypes = {
  chartID: PropTypes.string,
  chartRelation: PropTypes.object,
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
    groupBy: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    }),
    percentageStack: PropTypes.bool,
    showDataLabels: PropTypes.bool,
    sortBy: PropTypes.shape({
      order: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }),
    stacked: PropTypes.bool,
  }).isRequired,
  data: PropTypes.array,
  interactiveClick: PropTypes.func,
  pdfPreview: PropTypes.bool,
};

export default BarChart;
