import React from 'react';
import { DualLine } from '@ant-design/charts';
import _ from 'lodash';

// Utils
import { thousandsSeparator, formatValue } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const DualLineComp = ({ data, configuration, pdfPreview }) => {
  const {
    axis1: { label: xLabel, type: xType = 'string', value: xValue },
    axis2: { type: yType1 = 'string', value: yValue1 },
    axis3: { type: yType2 = 'string', value: yValue2 },
    showDataLabels = false,
    sortBy = {},
  } = configuration;
  const { order: sortOrder = 'asc', type: sortType = 'string', value: sortValue = xValue } = sortBy;

  const customXLabel = xLabel ? xLabel : xValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue1 || !yValue2) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [xValue]: formatValue(xType, row[xValue]),
    [yValue1]: formatValue(yType1, row[yValue1]),
    [yValue2]: formatValue(yType2, row[yValue2]),
  }));

  // Determine how to sort data array
  /*
    If sortValue === xValue then when mapping over array, create a new key in object to prevent overwriting
    the formatted ouput the user sees on the chart
  */
  if (sortValue === xValue) {
    data = data.map(row => ({ ...row, [`sort${sortValue}`]: formatValue(sortType, row[sortValue], true) }));
    data = _.orderBy(data, [`sort${sortValue}`], [sortOrder]);
  } else {
    data = data.map(row => ({ ...row, [sortValue]: formatValue(sortType, row[sortValue], true) }));
    data = _.orderBy(data, [sortValue], [sortOrder]);
  }

  const chartConfig = {
    data: [data, data],
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'top',
      style: { fontSize: 12 },
      visible: showDataLabels,
    },
    legend: {
      position: 'bottom',
      visible: true,
    },
    lineConfigs: [
      {
        point: { visible: true },
        color: '#5c90f9',
      },
      {
        point: { visible: true },
        color: '#e76c5e',
      },
    ],
    meta: {
      yValue1: { formatter: v => thousandsSeparator(v) },
      yValue2: { formatter: v => thousandsSeparator(v) },
    },
    tooltip: { visible: !pdfPreview },
    xField: xValue,
    xAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: true,
      },
      title: {
        style: { fill: chartFillColor },
        text: customXLabel,
        visible: true,
      },
    },
    yField: [yValue1, yValue2],
  };

  return <DualLine {...chartConfig} />;
};

export default DualLineComp;
