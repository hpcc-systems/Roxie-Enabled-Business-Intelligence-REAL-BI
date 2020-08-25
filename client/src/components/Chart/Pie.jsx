import React from 'react';
import { Pie } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

// Helper Functions
const percentageOfPie = (num, total) => `${((Number(num) / total) * 100).toFixed(2)}%`; // Convert num and total to pie slice percentage
const reducer = (acc, currentVal) => acc + currentVal; // Sum function for array.reduce()

const PieComp = ({ data, config }) => {
  const {
    axis1: { label: nameLabel, value: nameValue },
    axis2: { label: valueLabel, value },
  } = config;

  const customNameLabel = nameLabel ? nameLabel : nameValue;
  const customValueLabel = valueLabel ? valueLabel : value;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !nameValue || !value) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [nameValue]: checkForNumber(row[nameValue]),
    [value]: checkForNumber(row[value]),
  }));

  const total = data.map(obj => obj[value]).reduce(reducer); // Gets total of yAxis values

  const chartConfig = {
    angleField: value,
    colorField: nameValue,
    data,
    forceFit: true,
    label: {
      formatter: v => percentageOfPie(v, total),
      style: { fill: chartFillColor },
      type: 'outer-center',
      visible: true,
    },
    legend: {
      title: {
        style: { fill: chartFillColor },
        text: [customNameLabel],
        visible: true,
      },
      position: 'right-top',
      visible: true,
    },
    radius: 0.8,
    tooltip: {
      formatter: v => ({
        name: customValueLabel,
        value: `${thousandsSeparator(v)} (${percentageOfPie(v, total)})`,
      }),
      style: { fill: chartFillColor },
      title: ' ', // Have to pass in a space or it will duplicate information
    },
  };

  return <Pie {...chartConfig} />;
};

export default PieComp;
