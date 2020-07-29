import React, { useRef } from 'react';
import { GroupedColumnChart } from '@opd/g2plot-react';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

const GroupColumn = ({ data, options }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label, description } = options;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;
  const chartRef = useRef();

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

  const config = {
    data,
    forceFit: true,
    label: { visible: false },
    description: {
      visible: true,
      text: description,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [yAxis]: { formatter: v => thousandsSeparator(v) },
    },
    groupField: groupBy,
    xAxis: {
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    xField: xAxis,
    yAxis: {
      title: {
        visible: true,
        text: customYLabel,
      },
    },
    yField: yAxis,
  };

  return <GroupedColumnChart {...config} chartRef={chartRef} />;
};

export default GroupColumn;
