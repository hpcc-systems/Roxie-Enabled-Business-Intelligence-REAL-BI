import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);

function ChartsGrid(props) {
  return (
    <>
      {props.layouts ? (
        <ResponsiveGridLayout
          layouts={props.layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          onLayoutChange={props.handleLayoutChange}
          rowHeight={5}
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
