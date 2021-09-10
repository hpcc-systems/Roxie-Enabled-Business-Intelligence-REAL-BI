import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);

const useStyles = makeStyles(() => ({
  gridRoot: {
    '& .react-resizable-handle': {
      width: '10px',
      height: '10px',
    },
  },
}));

function ChartsGrid(props) {
  const classes = useStyles();

  if (!props.layouts) return null;

  return (
    <>
      {props.layouts ? (
        <ResponsiveGridLayout
          className={classes.gridRoot}
          layouts={props.layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          onLayoutChange={props.handleLayoutChange}
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
      ) : null}
    </>
  );
}

export default ChartsGrid;
