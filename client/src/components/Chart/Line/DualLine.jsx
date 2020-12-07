import React from 'react';
import { DualLine } from '@ant-design/charts';
import moment from 'moment';

// Utils
import { thousandsSeparator, sortArr } from '../../../utils/misc';

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
  const { order: sortOrder = 'asc', type: sortType = 'string', value: sortValue = '' } = sortBy;

  const customXLabel = xLabel ? xLabel : xValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue1 || !yValue2) {
    return null;
  }

  // Convert necessary values to specified data type
  data = data.map(row => ({
    ...row,
    [xValue]:
      xType === 'date'
        ? moment(String(row[xValue])).format('L')
        : xType === 'number'
        ? Number(row[xValue])
        : String(row[xValue]),
    [yValue1]:
      yType1 === 'date'
        ? moment(String(row[yValue1])).format('L')
        : yType1 === 'number'
        ? Number(row[yValue1])
        : String(row[yValue1]),
    [yValue2]:
      yType2 === 'date'
        ? moment(String(row[yValue2])).format('L')
        : yType2 === 'number'
        ? Number(row[yValue2])
        : String(row[yValue2]),
  }));

  // Determine how to sort data array
  if (sortValue === '' || sortValue === xValue) {
    data = sortArr(data, xValue, sortOrder);
  } else {
    // Convert necessary values to specified data type
    data = data.map(row => ({
      ...row,
      [sortValue]:
        sortType === 'date'
          ? moment(String(row[sortValue])).format('L')
          : sortType === 'number'
          ? Number(row[sortValue])
          : String(row[sortValue]),
    }));

    data = sortArr(data, sortValue, sortOrder);
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
