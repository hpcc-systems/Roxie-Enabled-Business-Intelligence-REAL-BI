import React from 'react';
import { Box } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

// React Components
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';

const ChartTile = props => {
  const { chart, compData, interactiveClick, interactiveObj, pdfPreview = false } = props;
  return (
    <Box p={1} height='100%'>
      {/* chart info size is about 77px */}
      <ChartToolbar {...props} lastModifiedDate={compData.lastModifiedDate} />
      {/* use calc to find out how much space is left to fit a chart in */}
      <Box height='calc(100% - 77px)'>
        <SnackbarProvider>
          <Chart
            chart={chart}
            dataObj={compData}
            interactiveClick={interactiveClick}
            interactiveObj={interactiveObj}
            pdfPreview={pdfPreview}
          />
        </SnackbarProvider>
      </Box>
    </Box>
  );
};

export default React.memo(ChartTile);
