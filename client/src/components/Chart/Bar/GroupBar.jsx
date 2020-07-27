import React from 'react';
import { GroupedBar } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

const GroupBarComp = ({ data, options }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label, description } = options;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

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
      [xAxis]: { formatter: v => thousandsSeparator(v) },
    },
    groupField: groupBy,
    xAxis: {
      grid: { visible: true },
      label: { visible: true },
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    xField: xAxis,
    yAxis: {
      line: { visible: true },
      title: {
        visible: true,
        text: customYLabel,
      },
    },
    yField: yAxis,
  };

  return <GroupedBar {...config} />;
};

export default GroupBarComp;
