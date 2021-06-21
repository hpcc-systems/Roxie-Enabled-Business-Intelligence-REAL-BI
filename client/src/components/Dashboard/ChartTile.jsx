import React from 'react';
import { Box } from '@material-ui/core';

// React Components
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';

const ChartTile = props => {
  const { chart, compData, dashboard, interactiveClick, interactiveObj, pdfPreview = false } = props;
  const { id: chartID, configuration } = chart;
  const { ecl = {} } = configuration;
  const eclDataset = ecl.dataset || '';

  const dataObj = compData[chartID] || compData[eclDataset] || {};
  const lastModifiedDate = dataObj.lastModifiedDate ? dataObj.lastModifiedDate : null;

  return (
    <Box position='relative' p={1}>
      <ChartToolbar {...props} lastModifiedDate={lastModifiedDate} />
      <Chart
        chart={chart}
        dataObj={dataObj}
        interactiveClick={interactiveClick}
        interactiveObj={interactiveObj}
        pdfPreview={pdfPreview}
      />
    </Box>
  );
};

export default ChartTile;
