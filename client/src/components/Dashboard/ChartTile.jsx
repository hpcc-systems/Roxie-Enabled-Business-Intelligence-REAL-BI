import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';

// React Components
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';
import { useDispatch, useSelector } from 'react-redux';
import { getChartData } from '../../utils/chart';
import { chartDataError, fetchChartData, updateChartConfigObject } from '../../features/dashboard/actions';

const ChartTile = props => {
  const { chartId, interactiveClick, interactiveObj, ...restProps } = props;

  const [dashboard, charts] = useSelector(({ dashboard }) => [
    dashboard.dashboard,
    dashboard.dashboard.charts,
  ]);
  const dispatch = useDispatch();
  const chart = charts.find(chart => chart.id === chartId);

  useEffect(() => {
    let isMounted = true;
    if (!chart.configuration.isStatic) {
      (async () => {
        try {
          if (!isMounted) return null;
          dispatch(fetchChartData({ id: chartId, loading: true }));
          const chartData = await getChartData(chartId, dashboard.cluster.id, dashboard.id, interactiveObj);
          if (!isMounted) return null;
          dispatch(updateChartConfigObject({ id: chartId, error: '', loading: false, ...chartData }));
        } catch (error) {
          if (!isMounted) return null;
          dispatch(chartDataError({ id: chartId, error: error.message, loading: false }));
        }
      })();
    }
    // graph charts will not automatically adjust size to outer div, but it will resize if refreshed, to trigger resize on static chart we will set it to loading state then rebuild it
    if (chart.configuration.isStatic && chart.configuration.type === 'graph') {
      dispatch(fetchChartData({ id: chartId, loading: true }));
      setTimeout(() => {
        dispatch(updateChartConfigObject({ id: chartId, loading: false }));
      }, 10);
    }
    return () => (isMounted = false);
  }, [chart.toggleRefresh]);

  const toolbarHeight = React.useRef(null);

  return (
    <Box px={1} pb={2} height='100%'>
      {/* dynamically check the height of the toolbar with useReff */}
      <Box ref={toolbarHeight}>
        <ChartToolbar chart={chart} {...restProps} />
      </Box>
      {/* use calc to find out how much space is left to fit a chart in, this is required by chart library*/}
      <Box height={`calc(100% - ${toolbarHeight?.current?.offsetHeight || 0}px)`}>
        <SnackbarProvider>
          <Box height='100%'>
            <Chart chart={chart} interactiveClick={interactiveClick} interactiveObj={interactiveObj} />
          </Box>
        </SnackbarProvider>
      </Box>
    </Box>
  );
};

export default ChartTile;
