import React from 'react';
import { Donut } from '@ant-design/charts';

// Utils
import { checkForNumber } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const DonutComp = ({ chartID, data, config, interactiveClick, interactiveObj, relations }) => {
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

  const chartConfig = {
    angleField: value,
    colorField: nameValue,
    data,
    forceFit: true,
    label: {
      visible: false,
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
  if (relations[chartID]) {
    chartConfig.events = {
      onRingClick: ({ data }) => interactiveClick(chartID, customNameLabel, data[nameValue]),
    };
  }

  return <Donut {...chartConfig} />;
};

export default DonutComp;
