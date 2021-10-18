import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import useNotifier from '../../hooks/useNotifier';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { updateLayoutInDBandStore } from '../../features/dashboard/actions';
import debounce from 'lodash/debounce';
const ResponsiveGridLayout = WidthProvider(Responsive);

const useStyles = makeStyles(() => ({
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

  const handleLayoutChange = debounce(async (layout, allLayouts) => {
    const { error } = await dispatch(updateLayoutInDBandStore(allLayouts));
    if (error) notifyResult('error', `Something went wrong, we could not save your layout. ${error}`);
  }, 500);

  if (!props.layouts) return null;

  return (
    <ResponsiveGridLayout
      className={classes.gridRoot}
      layouts={props.layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      onLayoutChange={handleLayoutChange}
      rowHeight={1}
      autoSize={true}
      draggableHandle='.dragElement'
      // verticalCompact={false}
      resizeHandles={['se']}
      isDraggable={props.permission === 'Owner'}
      isResizable={props.permission === 'Owner'}
    >
      {props.children}
    </ResponsiveGridLayout>
  );
}

export default ChartsGrid;
