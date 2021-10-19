import React, { useEffect, Fragment } from 'react';
import { Box, CircularProgress, Divider, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

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
import useNotifier from '../../hooks/useNotifier';
import GraphChart from './GraphChart';

const ChartComp = ({
  chart: { configuration = {}, id: chartID, data = [], error, loading },
  interactiveClick,
  interactiveObj = {},
  pdfPreview = false,
  sourceType,
  showDuplicatedRecordsWarning,
}) => {
  // Snackbar warning about data size
  const notifyResult = useNotifier();

  let relations = useSelector(state => state.dashboard.dashboard.relations);

  const { horizontal, params = [], isStatic = false, type } = configuration;

  let chartType = type;

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

  useEffect(() => {
    if (data.length >= 5000) {
      notifyResult(
        'warning',
        'Displaying 5,000+ rows of data is not recommended. Please consider filtering your data further to improve chart render time',
      );
    }
    if (data.length < 5000 && data.length === countParamValue) {
      notifyResult('info', 'The number of returned rows is being altered by a chart level parameter.');
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
          showDuplicatedRecordsWarning={showDuplicatedRecordsWarning}
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
    case 'graph':
      chartComp = <GraphChart data={data} configuration={configuration} />;
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

  // Don't render the progress wheel if the chart is a static textbox
  if (loading && !isStatic)
    return (
      <Box display='flex' mt={2} justifyContent='center' alignItems='center'>
        <CircularProgress />
      </Box>
    );

  if (error || (data.length === 0 && !isStatic))
    return (
      <>
        <NoData sourceType={sourceType} error={error} />
        {chartType === 'textBox' && (
          <Fragment>
            <Divider />
            {chartComp}
          </Fragment>
        )}
      </>
    );

  return <Fragment>{chartComp}</Fragment>;
};

export default React.memo(ChartComp);
