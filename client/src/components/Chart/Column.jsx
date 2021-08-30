/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { Column } from '@ant-design/charts';
import _orderBy from 'lodash/orderBy';
import PropTypes from 'prop-types';
import { formatValue } from '../../utils/misc';

const ColumnChart = ({ chartID, chartRelation, configuration, data, interactiveClick, pdfPreview }) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue } = {},
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue } = {},
    groupBy: { type: groupByType = 'string', value: groupByValue } = {},
    percentageStack,
    showDataLabels,
    sortBy: { order = 'asc', type: sortType = 'string', value: sortValue = xValue } = {},
    stacked,
    drillDown = null,
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

  const chartConfig = {
    appendPadding: [20, 5, 0, 5],
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
    xField: xValue,
    yField: yValue,
    xAxis: {
      top: true,
      nice: true,
      min: 0,
      title: { autoRotate: true, text: customXLabel },
      label: {
        autoHide: true,
        style: { fontSize: 12 },
        autoRotate: true,
        formatter: text => (text.length > 13 ? text.substring(0, 13) + '...' : text),
      },
    },
    yAxis: {
      top: true,
      nice: true,
      min: 0,
      title: { autoRotate: true, text: customYLabel },
      label: {
        autoHide: true,
        style: { fontSize: 12 },
        autoRotate: true,
        formatter: text => (text.length > 13 ? text.substring(0, 13) + '...' : text),
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
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
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
      style: {
        fontWeight: 600,
      },
    };
  }

  if (!xShowTickLabels) {
    chartConfig.xAxis.label = null;
  }

  if (!yShowTickLabels) {
    chartConfig.yAxis.label = null;
  }

  if (drillDown?.hasDrillDown) {
    chartConfig.columnStyle = {
      cursor: 'pointer',
    };
  }

  // Add groupby and stacked
  if (groupByValue) {
    chartConfig.isGroup = true;
    chartConfig.seriesField = groupByValue;

    if (stacked) {
      chartConfig.isStack = true;
      chartConfig.isGroup = null;
    }

    if (percentageStack) {
      chartConfig.isPercent = true;
      chartConfig.tooltip = {
        formatter: datum => {
          const value = datum[yValue];
          return {
            name: groupByValue ? datum[groupByValue] : customYLabel,
            value: `${(value * 100).toFixed(2)}%`,
          };
        },
      };
    }
  }

  const ref = useRef();
  const drillDownApplied = useRef(false);

  useEffect(() => {
    const chart = ref.current;
    if (drillDown?.hasDrillDown) {
      const { drilledByField, drilledOptions } = drillDown;

      chart.on('plot:dblclick', () => {
        // Closing drill down, going back to original chart
        if (drillDownApplied.current) {
          drillDownApplied.current = false;
          return chart.update(chartConfig);
        }
      });

      chart.on('element:click', evt => {
        if (drillDownApplied.current) return;
        const eventData = evt.data; // this relates to plot element we have clicked on

        if (eventData?.data) {
          const newDataSet = drilledOptions.map(optionName => {
            const record = {
              drilledByField: eventData.data[drilledByField],
              yAxis: eventData.data[optionName],
              xAxis: optionName,
            };
            if (groupByValue) {
              record[groupByValue] = eventData.data[groupByValue];
            }
            return record;
          });

          chart.update({
            ...chartConfig, // preserve original chart config
            data: newDataSet,
            yField: 'yAxis',
            xField: 'xAxis',
            xAxis: {
              ...chartConfig.xAxis,
              title: { ...chartConfig.xAxis.title, text: eventData.data[drilledByField] },
            },
            tooltip: {
              formatter: datum => {
                const value = datum['yAxis'];
                return {
                  name: datum['xAxis'],
                  value: isNaN(value) ? value : Intl.NumberFormat('en-US').format(value),
                };
              },
            },
          });
        }

        drillDownApplied.current = true;
      });
    }

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
