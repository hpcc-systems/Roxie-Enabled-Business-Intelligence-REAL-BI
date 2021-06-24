import React from 'react';
import { Gauge } from '@ant-design/charts';
import PropTypes from 'prop-types';
import { chartFillColor } from '../../constants';

const GaugeChart = ({ data, configuration }) => {
  const { axis1: { value } = {} } = configuration;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !value) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({ ...row, [value]: Number(row[value]) }));

  const chartConfig = {
    autoFit: true,
    axis: {
      label: { formatter: v => v * 100 },
      subTickLine: { count: 3 },
    },
    indicator: {
      pointer: { style: { stroke: '#AAA' } },
      pin: { style: { stroke: '#AAA' } },
    },
    percent: data[0][value],
    range: {
      color: ['l(0) 0:#B8E1FF 1:#3D76DD'],
      ticks: [0, 1],
    },
    statistic: {
      title: {
        formatter: data => `${(data.percent * 100).toFixed(2)}%`,
      },
      content: {
        formatter: () => value,
      },
    },
  };

  return <Gauge {...chartConfig} />;
};

GaugeChart.defaultProps = {
  configuration: {},
  data: [],
};

GaugeChart.propTypes = {
  configuration: PropTypes.shape({
    axis1: PropTypes.shape({
      value: PropTypes.string,
    }).isRequired,
  }).isRequired,
  data: PropTypes.array,
};

export default GaugeChart;
