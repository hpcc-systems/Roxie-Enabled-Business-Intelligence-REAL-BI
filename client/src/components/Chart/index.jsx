import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';

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

// Create styles
const useStyles = makeStyles(theme => ({
  progress: { margin: '0 0 10px 10px' },
  warningMsg: {
    backgroundColor: theme.palette.warning.main,
    borderRadius: '0 0 4px 4px',
    color: theme.palette.warning.contrastText,
    margin: '0 auto',
    padding: theme.spacing(0.15, 0.75),
    textAlign: 'center',
  },
}));

const ChartComp = ({
  chart: { configuration = {}, id: chartID },
  dataObj,
  interactiveClick,
  interactiveObj = {},
  pdfPreview,
  sourceType,
}) => {
  const { horizontal, params = [], isStatic = false, type } = configuration;
  const { progress, warningMsg } = useStyles();
  let { relations } = useSelector(state => state.dashboard.dashboard);
  let chartType = type;

  const { data = [], error, loading } = dataObj;

  if (!error && data) {
    if (chartType === 'bar') {
      chartType = horizontal ? 'bar' : 'column';
    }
  }

  const chartRelation = pdfPreview ? false : relations.find(({ sourceID }) => sourceID === chartID);

  // Don't render the progress wheel if the chart is a static textbox
  return loading && (chartType !== 'textBox' || (chartType === 'textBox' && !isStatic)) ? (
    <CircularProgress className={progress} />
  ) : (data.length > 0 || (chartType === 'textBox' && isStatic)) && !error ? (
    (() => {
      let chartComp;
      switch (chartType) {
        case 'bar':
          chartComp = (
            <BarChart
              chartID={chartID}
              configuration={configuration}
              data={data}
              chartRelation={chartRelation}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
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
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
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
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
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
          chartComp = <Map data={data} configuration={configuration} pdfPreview={pdfPreview} />;
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

      const countParamIndex = params.findIndex(
        ({ name, value }) => name === 'Count' && value !== null && value !== '',
      );
      const countParamValue = countParamIndex > -1 ? Number(params[countParamIndex].value) : -1;

      return (
        <Fragment>
          {chartComp}
          {data.length >= 5000 && (
            <Typography className={warningMsg} display='block'>
              Displaying 5,000+ rows of data is not recommended. Please consider filtering your data further
              to improve chart render time.
            </Typography>
          )}
          {data.length < 5000 && data.length === countParamValue && (
            <Typography className={warningMsg} display='block'>
              The number of returned rows is being altered by a chart level parameter.
            </Typography>
          )}
        </Fragment>
      );
    })()
  ) : (
    <NoData sourceType={sourceType} error={error} />
  );
};

export default ChartComp;
