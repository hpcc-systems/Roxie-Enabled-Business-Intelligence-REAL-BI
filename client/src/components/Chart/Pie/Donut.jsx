import React from 'react';
import { Donut } from '@ant-design/charts';
import moment from 'moment';

// Constants
import { chartFillColor } from '../../../constants';

const DonutComp = ({ chartID, data, configuration, hasClickEvent, interactiveClick, interactiveObj }) => {
  const {
    axis1: { label: nameLabel, type: nameType = 'string', value: nameValue },
    axis2: { label: valueLabel, type: valueType = 'string', value },
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

  const chartConfig = {
    angleField: value,
    colorField: nameValue,
    data,
    forceFit: true,
    label: { visible: false },
    legend: {
      title: {
        style: { fill: chartFillColor },
        text: [customNameLabel],
        visible: true,
      },
      position: 'right-top',
      visible: true,
    },
    padding: 'auto',
    pieStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Highlight columns from click event
      if (chartID === objID && field === customNameLabel && d === value) {
        return { stroke: 'red' };
      }

      return;
    },
    radius: 0.8,
    statistic: {
      totalLabel: customValueLabel,
    },
  };

  // Add click events
  if (hasClickEvent) {
    chartConfig.events = {
      onRingClick: ({ data }) => interactiveClick(chartID, customNameLabel, data[nameValue]),
    };
  }

  return <Donut {...chartConfig} />;
};

export default DonutComp;
