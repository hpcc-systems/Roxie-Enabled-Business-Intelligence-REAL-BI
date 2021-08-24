import React from 'react';
import { Box } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

// React Components
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';

const ChartTile = props => {
  const { chart, compData, interactiveClick, interactiveObj, pdfPreview = false } = props;

  const toolbarHeight = React.useRef(null);

  return (
    <Box px={1} pb={2} height='100%'>
      {/* dynamically check the height of the toolbar with useReff */}
      <Box ref={toolbarHeight}>
        <ChartToolbar {...props} lastModifiedDate={compData.lastModifiedDate} />
      </Box>
      {/* use calc to find out how much space is left to fit a chart in, this is required by chart library*/}
      <Box height={`calc(100% - ${toolbarHeight?.current?.offsetHeight || 0}px)`}>
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
