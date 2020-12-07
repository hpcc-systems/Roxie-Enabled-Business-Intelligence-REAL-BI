import React from 'react';
import { Column } from '@ant-design/charts';
import moment from 'moment';

// Utils
import { thousandsSeparator, sortArr } from '../../../utils/misc';

// Constants
import { chartFillColor } from '../../../constants';

const ColumnComp = ({
  chartID,
  data,
  configuration,
  hasClickEvent,
  interactiveClick,
  interactiveObj,
  pdfPreview,
}) => {
  const {
    axis1: { label: xLabel, showTickLabels: xShowTickLabels, type: xType = 'string', value: xValue },
    axis2: { label: yLabel, showTickLabels: yShowTickLabels, type: yType = 'string', value: yValue },
    showDataLabels = false,
    sortBy = {},
  } = configuration;
  const { order: sortOrder = 'asc', type: sortType = 'string', value: sortValue = '' } = sortBy;

  const customXLabel = xLabel ? xLabel : xValue;
  const customYLabel = yLabel ? yLabel : yValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !yValue) {
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
    [yValue]:
      yType === 'date'
        ? moment(String(row[yValue])).format('L')
        : yType === 'number'
        ? Number(row[yValue])
        : String(row[yValue]),
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
    columnStyle: d => {
      const { chartID: objID, field, value } = interactiveObj;

      // Highlight columns from click event
      if (chartID === objID && field === customXLabel && d === value) {
        return { stroke: 'red' };
      }

      return;
    },
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'top',
      style: { fontSize: 12 },
      visible: showDataLabels,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: { [yValue]: { formatter: v => thousandsSeparator(v) } },
    tooltip: { visible: !pdfPreview },
    xAxis: {
      label: {
        style: { fill: chartFillColor },
        visible: xShowTickLabels,
      },
      min: 0,
      title: {
        style: { fill: chartFillColor },
        text: customXLabel,
        visible: true,
      },
    },
    xField: xValue,
    yAxis: {
      grid: { visible: true },
      label: {
        style: { fill: chartFillColor },
        visible: yShowTickLabels,
      },
      line: {
        style: { fill: chartFillColor },
        visible: true,
      },
      min: 0,
      title: {
        style: { fill: chartFillColor },
        text: customYLabel,
        visible: true,
      },
    },
    yField: yValue,
  };

  // Add click events
  if (hasClickEvent) {
    chartConfig.events = {
      onColumnClick: ({ data }) => interactiveClick(chartID, customXLabel, data[xValue]),
    };
  }

  return <Column {...chartConfig} />;
};

export default ColumnComp;
