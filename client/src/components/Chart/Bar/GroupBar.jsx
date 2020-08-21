import React from 'react';
import { GroupedBar } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const GroupBarComp = ({ data, config }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label } = config;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !groupBy || !xAxis || !yAxis) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xAxis, sortOrder);

  const chartConfig = {
    data,
    forceFit: true,
    label: { visible: false },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    groupField: groupBy,
    xAxis: {
      grid: { visible: true },
      label: { visible: true },
      title: {
        visible: true,
        text: customXLabel,
        fill: chartFillColor,
      },
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      title: {
        visible: true,
        text: customYLabel,
        fill: chartFillColor,
      },
    },
    yField: yAxis,
  };

  return <GroupedBar {...chartConfig} />;
};

export default GroupBarComp;
