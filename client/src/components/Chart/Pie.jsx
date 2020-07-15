import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Pie } from '@antv/g2plot';

// Utils
import { checkForNumber, thousandsSeparator } from '../../utils/misc';

// Helper Functions
const percentageOfPie = (num, total) => `${((Number(num) / total) * 100).toFixed(2)}%`; // Convert num and total to pie slice percentage
const reducer = (acc, currentVal) => acc + currentVal; // Sum function for array.reduce()

const PieChart = ({ data, options }) => {
  const { name, value, chartDescription } = options;

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
      text: chartDescription,
    },
    meta: {
      [value]: {
        formatter: v => thousandsSeparator(v),
      },
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

  return <ReactG2Plot Ctor={Pie} config={config} />;
};

export default PieChart;
