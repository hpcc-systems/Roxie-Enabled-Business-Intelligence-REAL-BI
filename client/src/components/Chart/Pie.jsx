import React from 'react';
import { Pie } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator } from '../../utils/misc';

// Helper Functions
const percentageOfPie = (num, total) => `${((Number(num) / total) * 100).toFixed(2)}%`; // Convert num and total to pie slice percentage
const reducer = (acc, currentVal) => acc + currentVal; // Sum function for array.reduce()

const PieComp = ({ data, options }) => {
  const { name, value, description } = options;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !name || !value) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [name]: checkForNumber(row[name]),
    [value]: checkForNumber(row[value]),
  }));

  const total = data.map(obj => obj[value]).reduce(reducer); // Gets total of yAxis values

  const config = {
    angleField: value,
    colorField: name,
    data,
    forceFit: true,
    label: {
      formatter: v => percentageOfPie(v, total),
      type: 'outer-center',
      visible: true,
    },
    description: {
      visible: true,
      text: description,
    },
    legend: {
      position: 'bottom',
      visible: true,
    },
    radius: 0.8,
    tooltip: {
      formatter: (v, text) => ({
        name: text,
        value: `${thousandsSeparator(v)} (${percentageOfPie(v, total)})`,
      }),
    },
  };

  return <Pie {...config} />;
};

export default PieComp;
