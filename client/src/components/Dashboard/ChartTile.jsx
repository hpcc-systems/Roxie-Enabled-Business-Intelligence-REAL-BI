import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import classnames from 'classnames';

// React Components
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';

const useStyles = makeStyles(() => ({
  clearDiv: { clear: 'both' },
  div: { cursor: 'pointer', height: '100%', opacity: 1 },
  draggedDiv: {
    border: `1px dashed ${grey[400]}`,
    borderRadius: 4,
    opacity: 0.75,
    '& > div': {
      opacity: 0,
    },
  },
}));

const ChartTile = props => {
  const {
    chart,
    compData,
    dragging,
    dragItemID,
    handleDragEnter,
    handleDragStart,
    interactiveClick,
    interactiveObj,
  } = props;
  const { id: chartID, configuration } = chart;
  const { ecl = {}, size = 12 } = configuration;
  const eclDataset = ecl.dataset || '';
  const { clearDiv, div, draggedDiv } = useStyles();

  const dataObj = compData[chartID] || compData[eclDataset] || {};
  const lastModifiedDate = dataObj.lastModifiedDate ? dataObj.lastModifiedDate : null;

  return (
    <Grid item md={size}>
      <div
        className={classnames(div, { [draggedDiv]: dragging && dragItemID.current === chartID })}
        draggable
        onDragStart={event => handleDragStart(event, chartID)}
        onDragEnter={dragging ? event => handleDragEnter(event, chartID) : null}
      >
        <Paper variant='outlined' style={{ position: 'relative' }}>
          <ChartToolbar {...props} lastModifiedDate={lastModifiedDate} />
          <div className={clearDiv}>
            <Chart
              chart={chart}
              dataObj={dataObj}
              interactiveClick={interactiveClick}
              interactiveObj={interactiveObj}
            />
          </div>
        </Paper>
      </div>
    </Grid>
  );
};

export default ChartTile;
