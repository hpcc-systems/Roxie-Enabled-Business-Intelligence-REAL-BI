import React from 'react';
import { Donut } from '@ant-design/charts';

// Constants
import { chartFillColor } from '../../../constants';
import { formatValue } from '../../../utils/misc';

const DonutComp = ({
  chartID,
  data,
  configuration,
  chartRelation,
  interactiveClick,
  interactiveObj,
  pdfPreview,
}) => {
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
    [nameValue]: formatValue(nameType, row[nameValue]),
    [value]: formatValue(valueType, row[value]),
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
    tooltip: { visible: !pdfPreview },
  };

  // Add click events
  if (chartRelation?.sourceID === chartID) {
    chartConfig.events = {
      onRingClick: ({ data }) =>
        interactiveClick(chartID, chartRelation.sourceField, data[chartRelation.sourceField]),
    };
  }

  return <Donut {...chartConfig} />;
};

export default DonutComp;
