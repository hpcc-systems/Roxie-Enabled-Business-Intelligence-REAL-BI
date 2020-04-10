import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { Pie } from '@antv/g2plot';

// Constants
import { thousandsSeparater } from '../../constants';

// Helper Functions
const percentageOfPie = (num, total) => `${((Number(num) / total) * 100).toFixed(2)}%`; // Convert num and total to pie slice percentage
const reducer = (acc, currentVal) => Number(acc) + Number(currentVal); // Sum function for array.reduce()

const PieChartComp = ({ data, options }) => {
  const { xAxis, yAxis } = options;
  const total = data.map(obj => obj[yAxis]).reduce(reducer); // Gets total of yAxis values

  const config = {
    angleField: yAxis,
    colorField: xAxis,
    data,
    forceFit: true,
    label: {
      formatter: v => percentageOfPie(v, total),
      type: 'outer-center',
      visible: true,
    },
    meta: {
      [yAxis]: {
        formatter: v => thousandsSeparater(v),
      },
    },
    legend: {
      position: 'bottom',
      visible: true,
    },
    radius: 0.8,
    responsive: true,
    tooltip: {
      formatter: (v, text) => ({
        name: text,
        value: `${thousandsSeparater(v)} (${percentageOfPie(v, total)})`,
      }),
    },
  };

  return <ReactG2Plot Ctor={Pie} config={config} />;
};

export default PieChartComp;
