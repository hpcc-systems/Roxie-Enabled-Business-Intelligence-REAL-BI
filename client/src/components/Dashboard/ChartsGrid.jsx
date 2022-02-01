import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Paper } from '@material-ui/core';
import useNotifier from '../../hooks/useNotifier';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { setChartAsActive, updateLayoutInDBandStore } from '../../features/dashboard/actions';
import ChartTile from './ChartTile';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

const ResponsiveGridLayout = WidthProvider(Responsive);

const useStyles = makeStyles(() => ({
  chartPaper: { overflow: 'hidden' },
  gridRoot: {
    '& .react-resizable-handle': {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '25px',
      height: '25px',
    },
  },
}));

function ChartsGrid(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const notifyResult = useNotifier();
  const dashboard = useSelector(({ dashboard }) => dashboard.dashboard);
  const { layout, activeChart, permission } = dashboard;

  const handleLayoutChange = debounce(async (currentLayout, allLayouts) => {
    if (permission !== 'Owner') return; // do not trigger updates if Dashboard permission is not Owner

    const equal = isEqual(layout, allLayouts);
    if (equal) return; // do not trigger updates if layouts are equal

    const { error } = await dispatch(updateLayoutInDBandStore(allLayouts));
    if (error) notifyResult('error', `Something went wrong, we could not save your layout. ${error}`);
  }, 500);

  const editChart = useCallback(
    chartID => {
      dispatch(setChartAsActive(chartID));
      props.editChartToggle();
    },
    [activeChart],
  );

  const removeChart = useCallback(
    async chartID => {
      dispatch(setChartAsActive(chartID));
      props.deleteChartToggle();
    },
    [activeChart],
  );

  const createChart = layoutIndex => {
    return (
      <Paper className={classes.chartPaper} key={layoutIndex}>
        <ChartTile
          chartId={layoutIndex}
          interactiveClick={props.interactiveClick}
          interactiveObj={props.interactiveObj}
          removeChart={removeChart}
          toggleEdit={editChart}
        />
      </Paper>
    );
  };

  return (
    <ResponsiveGridLayout
      className={classes.gridRoot}
      layouts={layout}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      onLayoutChange={handleLayoutChange}
      rowHeight={1}
      autoSize={true}
      draggableHandle='.dragElement'
      // verticalCompact={false}
      resizeHandles={['se']}
      isDraggable={permission === 'Owner'}
      isResizable={permission === 'Owner'}
    >
      {layout?.lg.map(layout => createChart(layout.i))}
    </ResponsiveGridLayout>
  );
}

export default React.memo(ChartsGrid);
