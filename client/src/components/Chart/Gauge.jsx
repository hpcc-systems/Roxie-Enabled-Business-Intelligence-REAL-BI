import React from 'react';
import { Gauge } from '@ant-design/charts';

// Constants
import { chartFillColor } from '../../constants';

const GaugeComp = ({ data, configuration }) => {
  const {
    axis1: { type: valueType = 'string', value = null },
    axis2: { value: val2 = null },
    axis3: { value: val3 = null },
  } = configuration;

  const minVal = Number(val2);
  const maxVal = Number(val3);

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !value || !val2 || !val3 || !minVal || !maxVal) {
    return null;
  }

  // Create range array of equal segments
  const split = (min, max, segments) => {
    const result = [];
    let delta = (max - min) / (segments - 1);

    // Add smaller numbers to array and increase by delta
    while (min < max) {
      result.push(min);
      min += delta;
    }

    // Add max value to end of array
    result.push(max);

    return result;
  };

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [value]: valueType === 'number' ? Number(row[value]) : String(row[value]),
  }));

  const chartConfig = {
    color: ['#39B8FF', '#52619B', '#43E089', '#C0EDF3'],
    data,
    forceFit: true,
    min: minVal,
    max: maxVal,
    range: split(minVal, maxVal, 5),
    statistic: {
      color: chartFillColor,
      position: ['50%', '90%'],
      text: data[0][value],
      visible: true,
    },
    value: data[0][value],
  };

  return <Gauge {...chartConfig} />;
};

export default GaugeComp;
