import React, { useEffect, Fragment } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { useSnackbar } from 'notistack';

//React Components
import BarChart from './Bar';
import ColumnChart from './Column';
import Gauge from './Gauge';
import Heatmap from './Heatmap';
import HistogramChart from './Histogram';
import LineChart from './Line';
import { ColumnLineChart, DualAxesLineChart } from './DualAxes';
import Map from './Map';
import NoData from './NoData';
import PieChart from './Pie';
import ScatterChart from './Scatter';
import Table from './Table';
import TextBox from './TextBox';

const ChartComp = ({
  chart: { configuration = {}, id: chartID },
  dataObj,
  interactiveClick,
  interactiveObj = {},
  pdfPreview,
  sourceType,
}) => {
  // Snackbar warning about data size
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  let relations = useSelector(state => state.dashboard.dashboard.relations);

  const { horizontal, params = [], isStatic = false, type } = configuration;

  let chartType = type;

  const { data = [], error, loading } = dataObj;

  if (!error && data) {
    if (chartType === 'bar') {
      chartType = horizontal ? 'bar' : 'column';
    }
  }

  const chartRelation = pdfPreview ? false : relations.find(({ sourceID }) => sourceID === chartID);

  const countParamIndex = params.findIndex(
    ({ name, value }) => name === 'Count' && value !== null && value !== '',
  );

  const countParamValue = countParamIndex > -1 ? Number(params[countParamIndex].value) : -1;

  const closeSnackbarButton = key => {
    const onClose = () => closeSnackbar(key);
    return <Button onClick={onClose}>Dismiss</Button>;
  };

  useEffect(() => {
    if (data.length >= 5000) {
      enqueueSnackbar(
        'Displaying 5,000+ rows of data is not recommended. Please consider filtering your data further to improve chart render time',
        {
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
          variant: 'warning',
          action: closeSnackbarButton,
        },
      );
    }
    if (data.length < 5000 && data.length === countParamValue) {
      enqueueSnackbar('The number of returned rows is being altered by a chart level parameter.', {
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        variant: 'info',
        action: closeSnackbarButton,
      });
    }
  }, [data]);

  let chartComp;
  switch (chartType) {
    case 'bar':
      chartComp = (
        <BarChart
          chartID={chartID}
          configuration={configuration}
          data={data}
          chartRelation={chartRelation}
          // ?? Not using interactiveObj but has interactiveClick on inital load. dont understand functionality
          // interactiveObj={interactiveObj}
          interactiveClick={interactiveClick}
          pdfPreview={pdfPreview}
        />
      );
      break;
    case 'column':
      chartComp = (
        <ColumnChart
          chartID={chartID}
          configuration={configuration}
          data={data}
          chartRelation={chartRelation}
          // ?? Not using interactiveObj but has interactiveClick on inital load. dont understand functionality
          // interactiveObj={interactiveObj}
          interactiveClick={interactiveClick}
          pdfPreview={pdfPreview}
        />
      );
      break;
    case 'columnline':
      chartComp = <ColumnLineChart configuration={configuration} data={data} pdfPreview={pdfPreview} />;
      break;
    case 'line':
      chartComp = (
        <LineChart
          chartID={chartID}
          configuration={configuration}
          data={data}
          chartRelation={chartRelation}
          // ?? Not using interactiveObj but has interactiveClick on inital load. dont understand functionality
          // interactiveObj={interactiveObj}
          interactiveClick={interactiveClick}
          pdfPreview={pdfPreview}
        />
      );
      break;
    case 'histogram':
      chartComp = <HistogramChart data={data} configuration={configuration} pdfPreview={pdfPreview} />;
      break;
    case 'dualline':
      chartComp = <DualAxesLineChart data={data} configuration={configuration} pdfPreview={pdfPreview} />;
      break;
    case 'pie':
    case 'donut':
      chartComp = <PieChart data={data} configuration={configuration} pdfPreview={pdfPreview} />;
      break;
    case 'scatter':
      chartComp = <ScatterChart data={data} configuration={configuration} pdfPreview={pdfPreview} />;
      break;
    case 'textBox':
      chartComp = <TextBox data={data} configuration={configuration} />;
      break;
    case 'heatmap':
      chartComp = <Heatmap data={data} configuration={configuration} pdfPreview={pdfPreview} />;
      break;
    case 'map':
      chartComp = <Map chartID={chartID} data={data} configuration={configuration} pdfPreview={pdfPreview} />;
      break;
    case 'gauge':
      chartComp = <Gauge data={data} configuration={configuration} pdfPreview={pdfPreview} />;
      break;
    case 'table':
      chartComp = (
        <Table
          chartID={chartID}
          configuration={configuration}
          data={data}
          interactiveClick={interactiveClick}
          interactiveObj={interactiveObj}
          pdfPreview={pdfPreview}
        />
      );
      break;
    default:
      chartComp = <Typography align='center'>Unknown chart type</Typography>;
  }

  const isStaticTextBox = () => chartType === 'textBox' && isStatic;

  // Don't render the progress wheel if the chart is a static textbox
  if (loading && !isStaticTextBox())
    return (
      <Box display='flex' justifyContent='center' alignItems='center' heigth='100%'>
        <CircularProgress />
      </Box>
    );

  if (error || (data.length === 0 && !isStaticTextBox()))
    return <NoData sourceType={sourceType} error={error} />;

  return <Fragment>{chartComp}</Fragment>;
};

export default ChartComp;
