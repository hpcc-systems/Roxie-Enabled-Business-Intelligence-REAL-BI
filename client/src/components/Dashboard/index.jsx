import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper } from '@material-ui/core';

// Redux Actions
import { getDashboard } from '../../features/dashboard/actions';
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
  const [callType, setCallType] = useState('single');
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
      Promise.all([getDashboard(lastDashboard), getCharts(lastDashboard)]).then(actions => {
        actions.map(action => dispatch(action));
      });
    }
  }, [dispatch, lastDashboard]);

  const editChart = chartID => {
    setChartID(chartID);
    editChartToggle();
  };

  const removeChart = (chartID, queryID) => {
    deleteChart(chartID, dashboard.id, queryID).then(action => dispatch(action));
  };

  const dataCall = useCallback(() => {
    const { clusterID, id: dashboardID } = dashboard;
    const dashboardParamsExist = dashboard.params.some(({ value }) => value !== null);
    const chartParamsExist = checkForChartParams(charts);

    if (dashboardParamsExist || (!dashboardParamsExist && !chartParamsExist)) {
      setCallType('single');

      // Fetch data for dashboard
      getDashboardData(clusterID, dashboardID).then(data => {
        const newDataObj = {};

        // Create nested object for local state
        Object.keys(data).forEach(key => {
          return (newDataObj[key] = { data: { ...data[key] }, loading: false });
        });

        // Set data in local state object with chartID as key
        setQueryData(prevState => ({ ...prevState, ...newDataObj }));
      });
    } else {
      setCallType('multiple');

      // Set initial object keys and loading
      charts.forEach(({ id: chartID }) => {
        setQueryData(prevState => ({ ...prevState, [chartID]: { loading: true } }));
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
              let dataObj;

              if (callType === 'single') {
                dataObj = queryData[queryName];
              } else {
                dataObj = queryData[chartID];
              }

              // Data not loaded
              if (!dataObj || !dataObj.data) {
                dataObj = {};
              }

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
                    <Chart chart={chart} dataObj={dataObj} />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          <FilterDrawer
            dashboard={dashboard}
            showDrawer={showDrawer}
            toggleDrawer={toggleDrawer}
            queryData={queryData}
          />
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
