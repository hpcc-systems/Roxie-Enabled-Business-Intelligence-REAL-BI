/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Column } from '@ant-design/charts';
import _orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { formatValue } from '../../utils/misc';
import { chartFillColor } from '../../constants';

const ColumnChart = ({ chartID, chartRelation, configuration, data, interactiveClick, pdfPreview }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue } = {},
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue } = {},
    groupBy: { type: groupByType = 'string', value: groupByValue } = {},
    percentageStack,
    showDataLabels,
    sortBy: { order = 'asc', type: sortType = 'string', value: sortValue = xValue } = {},
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

  let chartConfig = {
    appendPadding: [40, 0, 0, 0],
    data,
    autoFit: true,
    legend: { position: 'right-top' },
    meta: {
      [yValue]: {
        formatter: value => {
          return isNaN(value)
            ? value
            : percentageStack
            ? `${(value * 100).toFixed(2)}%`
            : Intl.NumberFormat('en-US').format(value);
        },
      },
    },
    tooltip: {
      formatter: datum => {
        const value = datum[yValue];
        return {
          name: groupByValue ? datum[groupByValue] : customYLabel,
          value: isNaN(value) ? value : Intl.NumberFormat('en-US').format(value),
        };
      },
      showContent: !pdfPreview,
    },
    xAxis: {
      min: 0,
      title: { style: { fill: chartFillColor }, text: customXLabel },
      label: { autoRotate: true },
    },
    xField: xValue,
    yAxis: {
      min: 0,
      title: { style: { fill: chartFillColor }, text: customYLabel },
    },
    yField: yValue,
    scrollbar: { type: 'horizontal' },
  };

  // Add data labels property
  if (showDataLabels) {
    chartConfig.label = {
      formatter: row => {
        const value = row[yValue];

        return isNaN(value)
          ? value
          : percentageStack
          ? `${(value * 100).toFixed(2)}%`
          : Intl.NumberFormat('en-US').format(value);
      },
      position: stacked ? 'middle' : 'top',
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

      chartConfig.tooltip = {
        formatter: datum => {
          const value = datum[yValue];
          return {
            name: groupByValue ? datum[groupByValue] : customYLabel,
            value: `${(value * 100).toFixed(2)}%`,
          };
        },
        showContent: !pdfPreview,
      };
    } else if (stacked) {
      chartConfig.isPercent = null;
      chartConfig.isStack = true;
      chartConfig.isGroup = true;
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

  const ref = useRef();
  const drilled = useRef(false);

  useEffect(() => {
    const chart = ref.current;

    chart.on('element:click', evt => {
      if (drilled.current) {
        drilled.current = false;
        return chart.update({
          ...chartConfig,
        });
      }
      const eventData = evt.data;
      if (eventData?.data) {
        const location = eventData.data.location;
        console.log('location :>> ', location);

        const newDataSet = [];
        for (const key in eventData.data) {
          if (key !== 'location' && key.length > 0 && key !== 'date' && key !== 'date_string') {
            const dataObj = { location, category: key, value: eventData.data[key] };
            newDataSet.push(dataObj);
          }
        }
        console.log('newDataSet :>> ', newDataSet);
        chart.update({
          ...chartConfig,
          data: newDataSet,
          yField: 'value',
          yAxis: {
            min: 0,
            title: { style: { fill: chartFillColor }, text: 'value' },
          },
          xField: 'category',
          xAxis: {
            min: 0,
            title: { style: { fill: chartFillColor }, text: 'category' },
          },

          tooltip: {
            formatter: datum => {
              const value = datum['value'];
              return {
                name: groupByValue ? datum[groupByValue] : customYLabel,
                value: isNaN(value) ? value : Intl.NumberFormat('en-US').format(value),
              };
            },
            showContent: !pdfPreview,
          },
        });
      }
      drilled.current = true;
    });

    console.log('xType :>> ', xType);
    console.log('xValue :>> ', xValue);
    console.log('groupByValue :>> ', groupByValue);
    console.log('yType :>> ', yType);
    console.log('yValue :>> ', yValue);

    if (ref.current && chartRelation && chartRelation?.sourceID === chartID) {
      ref.current.on('element:click', args => {
        const row = args.data.data;
        interactiveClick(chartID, chartRelation.sourceField, row[chartRelation.sourceField]);
      });
    }
  }, []);

  return <Column {...chartConfig} chartRef={ref} />;
};

ColumnChart.defaultProps = {
  chartID: '',
  chartRelation: {},
  configuration: {},
  data: [],
  interactiveClick: () => {},
  pdfPreview: false,
};

ColumnChart.propTypes = {
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

export default ColumnChart;
