import React, { useEffect, useRef } from 'react';
import { Line } from '@ant-design/charts';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { formatValue } from '../../utils/misc';
import { chartFillColor } from '../../constants';

const LineChart = ({ chartID, chartRelation, configuration, data, interactiveClick, pdfPreview }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue } = {},
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue } = {},
    groupBy: { type: groupByType = 'string', value: groupByValue } = {},
    showDataLabels,
    sortBy: { order = 'asc', type: sortType = 'string', value: sortValue = xValue } = {},
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
    appendPadding: [24, 0, 0, 0],
    data,
    forceFit: true,
    legend: { position: 'right-top' },
    meta: {
      [yValue]: {
        formatter: value => (isNaN(value) ? value : Intl.NumberFormat('en-US').format(value)),
      },
    },
    padding: 'auto',
    point: { size: 4 },
    tooltip: {
      formatter: datum => {
        const yVal = datum[yValue];
        return {
          name: customYLabel,
          value: isNaN(yVal) ? yVal : Intl.NumberFormat('en-US').format(yVal),
        };
      },
      showContent: !pdfPreview,
    },
    xAxis: { title: { style: { fill: chartFillColor }, text: customXLabel } },
    xField: xValue,
    yAxis: { title: { style: { fill: chartFillColor }, text: customYLabel } },
    yField: yValue,
  };

  // Add data labels property
  if (showDataLabels) {
    chartConfig.label = {
      formatter: row => {
        const value = row[yValue];
        return isNaN(value) ? value : Intl.NumberFormat('en-US').format(value);
      },
      position: 'top',
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
    chartConfig.seriesField = groupByValue;
  } else {
    chartConfig.seriesField = null;
  }

  // Add click event
  const ref = useRef();
  useEffect(() => {
    if (ref.current && chartRelation && chartRelation?.sourceID === chartID) {
      ref.current.on('element:click', args => {
        const row = args.data.data;

        if (Array.isArray(row)) {
          if (groupByValue) {
            interactiveClick(chartID, chartRelation.sourceField, row[0][chartRelation.sourceField]);
          }
        } else {
          interactiveClick(chartID, chartRelation.sourceField, row[chartRelation.sourceField]);
        }
      });
    }
  }, []);

  return <Line {...chartConfig} chartRef={ref} />;
};

LineChart.defaultProps = {
  chartID: '',
  chartRelation: {},
  configuration: {},
  data: [],
  interactiveClick: () => {},
  pdfPreview: false,
};

LineChart.propTypes = {
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

export default LineChart;
