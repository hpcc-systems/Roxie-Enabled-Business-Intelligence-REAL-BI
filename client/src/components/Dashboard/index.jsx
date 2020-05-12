import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper } from '@material-ui/core';

// Redux Actions
import { getDashboard, getDashboardParams } from '../../features/dashboard/actions';
import { deleteChart, getCharts } from '../../features/chart/actions';

// React Components
import Login from './Login';
import NoCharts from './NoCharts';
import Toolbar from './Toolbar';
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';
import NewChartDialog from '../Dialog/newChart';
import EditChartDialog from '../Dialog/editChart';
import FilterDrawer from '../Drawers/Filters';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

// Utils
import { checkForChartParams, getChartData } from '../../utils/chart';
import { getDashboardData } from '../../utils/dashboard';

const Dashboard = () => {
  const [queryData, setQueryData] = useState({});
  const [chartID, setChartID] = useState(null);
  const { id: userID, lastDashboard } = useSelector(state => state.auth.user);
  const { dashboard } = useSelector(state => state.dashboard);
  const { charts } = useSelector(state => state.chart);
  const { showDialog: newChartShow, toggleDialog: newChartToggle } = useDialog(false);
  const { showDialog: editChartShow, toggleDialog: editChartToggle } = useDialog(false);
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (lastDashboard) {
      Promise.all([
        getDashboard(lastDashboard),
        getCharts(lastDashboard),
        getDashboardParams(lastDashboard),
      ]).then(actions => {
        // Batch dispatch each action to only have React re-render once
        batch(() => {
          dispatch(actions[0]);
          dispatch(actions[1]);
          dispatch(actions[2]);
        });
      });
    }
  }, [dispatch, lastDashboard]);

  const editChart = chartID => {
    setChartID(chartID);
    editChartToggle();
  };

  const removeChart = async (chartID, queryID) => {
    let actions = [];

    actions[0] = await deleteChart(chartID, dashboard.id, queryID);
    actions[1] = await getDashboardParams(dashboard.id);

    batch(() => {
      dispatch(actions[0]);
      dispatch(actions[1]);
    });
  };

  const dataCall = useCallback(() => {
    const { clusterID, id: dashboardID, params = [] } = dashboard;
    const dashboardParamsExist = params.some(({ value }) => value !== null);
    const chartParamsExist = checkForChartParams(charts);

    if (dashboardParamsExist || (!dashboardParamsExist && !chartParamsExist)) {
      // Fetch data for dashboard
      getDashboardData(clusterID, dashboardID).then(data => {
        const newDataObj = {};

        // Create nested object for local state
        Object.keys(data).forEach(key => {
          return (newDataObj[key] = { data: { ...data[key] }, loading: false });
        });

        // Set data in local state object with query name as key
        setQueryData(newDataObj);
      });
    } else {
      // Set initial object keys and loading
      charts.forEach(({ id: chartID }) => {
        setQueryData(prevState => ({ ...prevState, [chartID]: {} }));
      });

      // Fetch data for each chart
      charts.forEach(({ id: chartID }) => {
        getChartData(chartID, dashboard.clusterID).then(data => {
          // Set data in local state object with chartID as key
          setQueryData(prevState => ({ ...prevState, [chartID]: { data, loading: false } }));
        });
      });
    }
  }, [charts, dashboard]);

  useEffect(() => {
    if (Object.keys(dashboard).length > 0 && charts.length > 0) {
      dataCall();
    }
  }, [charts, dashboard, dataCall]);

  return userID ? (
    Object.keys(dashboard).length > 0 ? (
      <Fragment>
        <Toolbar
          name={dashboard.name}
          refreshChart={dataCall}
          toggleDialog={newChartToggle}
          toggleDrawer={toggleDrawer}
        />
        <Container maxWidth='xl'>
          <Grid container direction='row' spacing={3}>
            {charts.map((chart, index) => {
              const { id: chartID, options, queryID, queryName } = chart;
              const dataObj = queryData[chartID] || queryData[queryName] || {};

              return (
                // Change grid column layout based on numver of charts
                <Grid key={index} item md={12}>
                  <Paper variant='outlined'>
                    <ChartToolbar
                      chartID={chartID}
                      options={options}
                      queryID={queryID}
                      removeChart={removeChart}
                      toggleDialog={editChart}
                    />
                    <Chart chart={chart} dashboard={dashboard} dataObj={dataObj} dispatch={dispatch} />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          {showDrawer && (
            <FilterDrawer
              dashboard={dashboard}
              showDrawer={showDrawer}
              toggleDrawer={toggleDrawer}
              queryData={queryData}
            />
          )}
          {newChartShow && <NewChartDialog show={newChartShow} toggleDialog={newChartToggle} />}
          {editChartShow && (
            <EditChartDialog chartID={chartID} show={editChartShow} toggleDialog={editChartToggle} />
          )}
        </Container>
      </Fragment>
    ) : (
      <NoCharts />
    )
  ) : (
    <Login />
  );
};

export default Dashboard;
