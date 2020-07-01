import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper } from '@material-ui/core';

// Redux Actions
import { deleteDashboardParam, getDashboard, getDashboardParams } from '../../features/dashboard/actions';
import { deleteChart, getCharts } from '../../features/chart/actions';
import { updateLastDashboard } from '../../features/auth/actions';

// React Components
import NoCharts from './NoCharts';
import Toolbar from './Toolbar';
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';
import NewChartDialog from '../Dialog/newChart';
import ShareLinkDialog from '../Dialog/shareLink';
import EditChartDialog from '../Dialog/editChart';
import FilterDrawer from '../Drawers/Filters';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

// Utils
import { checkForChartParams, getChartData } from '../../utils/chart';
import { getDashboardData } from '../../utils/dashboard';
import { sortArr } from '../../utils/misc';

const Dashboard = () => {
  const [compData, setCompData] = useState({});
  const [chartID, setChartID] = useState(null);
  const { dashboard } = useSelector(state => state.dashboard);
  const { clusterID, id: dashboardID, params = [] } = dashboard; // Destructure here instead of previous line to maintain reference to entire dashboard object
  const { charts } = useSelector(state => state.chart);
  const history = useHistory();
  const { dashboardID: urlID } = useParams();
  const { showDialog: newChartShow, toggleDialog: newChartToggle } = useDialog(false);
  const { showDialog: shareLinkShow, toggleDialog: shareLinkToggle } = useDialog(false);
  const { showDialog: editChartShow, toggleDialog: editChartToggle } = useDialog(false);
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (urlID) {
      Promise.all([getDashboard(urlID), getCharts(urlID), getDashboardParams(urlID)]).then(actions => {
        // DB didn't return data, dashboard may not exist
        if (Object.keys(actions[0].payload).length === 0) {
          // Clear last dashboard ID to prevent infinite loop error
          updateLastDashboard(null).then(action => {
            dispatch(action);
            history.push('/dashboard');
          });
        } else {
          // Batch dispatch each action to only have React re-render once
          batch(() => {
            dispatch(actions[0]);
            dispatch(actions[1]);
            dispatch(actions[2]);
          });
        }
      });
    }
  }, [dispatch, history, urlID]);

  const editChart = chartID => {
    setChartID(chartID);
    editChartToggle();
  };

  const removeChart = async (chartID, sourceID) => {
    let actions = [];

    actions[0] = await deleteChart(chartID, dashboardID, sourceID);
    actions[1] = await getDashboardParams(dashboardID);

    batch(() => {
      dispatch(actions[0]);
      dispatch(actions[1]);
    });
  };

  const deleteFilter = filterID => {
    deleteDashboardParam(dashboardID, filterID).then(action => dispatch(action));
  };

  const dataCall = useCallback(() => {
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

        // Set data in local state object with source name as key
        setCompData(newDataObj);
      });
    } else {
      // Set initial object keys and loading
      charts.forEach(({ id: chartID }) => {
        setCompData(prevState => ({ ...prevState, [chartID]: {} }));
      });

      // Fetch data for each chart
      charts.forEach(({ id: chartID }) => {
        getChartData(chartID, clusterID).then(data => {
          // Set data in local state object with chartID as key
          setCompData(prevState => ({ ...prevState, [chartID]: { data, loading: false } }));
        });
      });
    }
  }, [charts, clusterID, dashboardID, params]);

  useEffect(() => {
    if (dashboardID && charts.length > 0) {
      dataCall();
    }
  }, [charts, dashboardID, dataCall]);

  return dashboardID ? (
    <Fragment>
      <Toolbar
        dashboard={dashboard}
        refreshChart={dataCall}
        toggleDialog={newChartToggle}
        toggleDrawer={toggleDrawer}
        toggleShare={shareLinkToggle}
      />
      <Container maxWidth='xl'>
        <Grid container direction='row' spacing={3}>
          {sortArr(charts, 'id').map((chart, index) => {
            const { id: chartID, options, sourceID, sourceName } = chart;
            const dataObj = compData[chartID] || compData[sourceName] || {};

            return (
              <Grid key={index} item md={12}>
                <Paper variant='outlined'>
                  <ChartToolbar
                    chartID={chartID}
                    dashboard={dashboard}
                    options={options}
                    sourceID={sourceID}
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
            deleteFilter={deleteFilter}
            showDrawer={showDrawer}
            toggleDrawer={toggleDrawer}
            compData={compData}
          />
        )}
        {newChartShow && <NewChartDialog show={newChartShow} toggleDialog={newChartToggle} />}
        {shareLinkShow && <ShareLinkDialog show={shareLinkShow} toggleShare={shareLinkToggle} />}
        {editChartShow && (
          <EditChartDialog chartID={chartID} show={editChartShow} toggleDialog={editChartToggle} />
        )}
      </Container>
    </Fragment>
  ) : (
    <NoCharts />
  );
};

export default Dashboard;
