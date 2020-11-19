import React from 'react';
import { Pie } from '@ant-design/charts';
import moment from 'moment';

// Utils
import { thousandsSeparator } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

// Helper Functions
const percentageOfPie = (num, total) => `${((Number(num) / total) * 100).toFixed(2)}%`; // Convert num and total to pie slice percentage
const reducer = (acc, currentVal) => acc + currentVal; // Sum function for array.reduce()

const PieComp = ({ data, configuration, pdfPreview }) => {
  const {
    axis1: { label: nameLabel, type: nameType = 'string', value: nameValue },
    axis2: { label: valueLabel, type: valueType = 'string', value },
    showDataLabels = false,
  } = configuration;

  const customNameLabel = nameLabel ? nameLabel : nameValue;
  const customValueLabel = valueLabel ? valueLabel : value;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !nameValue || !value) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [nameValue]:
      nameType === 'date'
        ? moment(String(row[nameValue])).format('L')
        : nameType === 'number'
        ? Number(row[nameValue])
        : String(row[nameValue]),
    [value]:
      valueType === 'date'
        ? moment(String(row[value])).format('L')
        : valueType === 'number'
        ? Number(row[value])
        : String(row[value]),
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
      visible: showDataLabels,
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
      visible: !pdfPreview,
    },
  };

  return <Pie {...chartConfig} />;
};

export default PieComp;
