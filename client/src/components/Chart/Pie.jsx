import React, { useEffect, useRef } from 'react';
import { Pie } from '@ant-design/charts';
import PropTypes from 'prop-types';
import { formatValue } from '../../utils/misc';
import { chartFillColor } from '../../constants';

const reducer = (acc, currentVal) => acc + currentVal; // Sum function for array.reduce()

const PieChart = ({ chartID, chartRelation, configuration, data, interactiveClick, pdfPreview }) => {
  const {
    axis1: { type: nameType = 'string', value: nameValue } = {},
    axis2: { type: valueType = 'string', value } = {},
    showDataLabels,
    type: chartType,
  } = configuration;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !nameValue || !value) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [nameValue]: formatValue(nameType, row[nameValue]),
    [value]: formatValue(valueType, row[value]),
  }));

  const chartConfig = {
    angleField: value,
    colorField: nameValue,
    data,
    forceFit: true,
    legend: { position: 'right-top' },
    meta: {
      value: {
        formatter: function formatter(v) {
          return ''.concat(v, ' \xA5');
        },
      },
    },
    tooltip: {
      formatter: row => {
        const formattedValue = isNaN(row[value]) ? row[value] : Intl.NumberFormat('en-US').format(row[value]);
        return { name: row[nameValue], value: formattedValue };
      },
      showContent: !pdfPreview,
      style: { fill: chartFillColor },
    },
  };

  if (chartType === 'donut') {
    chartConfig.radius = 1;
    chartConfig.innerRadius = 0.6;
    chartConfig.interactions = [{ type: 'element-active' }, { type: 'pie-statistic-active' }];
    chartConfig.statistic = {
      title: {
        style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis' },
        formatter: row => row?.[nameValue] || 'Total',
      },
      content: {
        style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis' },
        formatter: (row, data) => row?.[value] || data.map(obj => obj[value]).reduce(reducer),
      },
    };

    // Add data labels property
    if (showDataLabels) {
      chartConfig.label = {
        formatter: row => `${(row.percent * 100).toFixed(2)}%`,
        offset: '-50%',
        style: { fill: chartFillColor, fontSize: 14, textAlign: 'center' },
        type: 'inner',
      };
    } else {
      chartConfig.label = null;
    }
  } else {
    chartConfig.radius = 0.8;
    chartConfig.innerRadius = 0;
    chartConfig.interactions = [{ type: 'element-active' }];
    chartConfig.statistic = null;

    // Add data labels property
    if (showDataLabels) {
      chartConfig.label = {
        formatter: row => `${(row.percent * 100).toFixed(2)}%`,
        style: { fill: chartFillColor, fontSize: 12 },
        type: 'outer',
      };
    } else {
      chartConfig.label = null;
    }
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

  return <Pie {...chartConfig} chartRef={ref} />;
};

PieChart.defaultProps = {
  chartID: '',
  chartRelation: {},
  configuration: {},
  data: [],
  interactiveClick: () => {},
  pdfPreview: false,
};

PieChart.propTypes = {
  chartID: PropTypes.string,
  chartRelation: PropTypes.object,
  configuration: PropTypes.shape({
    axis1: PropTypes.shape({
      showTickLabels: PropTypes.bool,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    axis2: PropTypes.shape({
      showTickLabels: PropTypes.bool,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    showDataLabels: PropTypes.bool,
    type: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.array,
  interactiveClick: PropTypes.func,
  pdfPreview: PropTypes.bool,
};

export default PieChart;
