import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Redux Actions
import { deleteDashboardParam } from '../../features/dashboard/actions';

// React Components
import Toolbar from './Toolbar';
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';
import NewChartDialog from '../Dialog/newChart';
import ShareLinkDialog from '../Dialog/shareLink';
import EditChartDialog from '../Dialog/editChart';
import FilterDrawer from '../Drawers/Filters';
import DeleteChartDialog from '../Dialog/DeleteChart';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

// Utils
import { checkForChartParams, getChartData } from '../../utils/chart';
import { getDashboardData } from '../../utils/dashboard';
import { sortArr } from '../../utils/misc';

const useStyles = makeStyles(() => ({
  clearDiv: { clear: 'both' },
}));

const Dashboard = () => {
  const [compData, setCompData] = useState({});
  const [chartID, setChartID] = useState(null);
  const [sourceID, setSourceID] = useState(null);
  const { dashboard } = useSelector(state => state.dashboard);
  const { clusterID, id: dashboardID, params = [] } = dashboard; // Destructure here instead of previous line to maintain reference to entire dashboard object
  const { charts } = useSelector(state => state.chart);
  const { showDialog: newChartShow, toggleDialog: newChartToggle } = useDialog(false);
  const { showDialog: shareLinkShow, toggleDialog: shareLinkToggle } = useDialog(false);
  const { showDialog: editChartShow, toggleDialog: editChartToggle } = useDialog(false);
  const { showDialog: deleteChartShow, toggleDialog: deleteChartToggle } = useDialog(false);
  const { showDrawer: showFilterDrawer, toggleDrawer: toggleFilterDrawer } = useDrawer(false);
  const dispatch = useDispatch();
  const { clearDiv } = useStyles();

  const editChart = chartID => {
    setChartID(chartID);
    editChartToggle();
  };

  const removeChart = async (chartID, sourceID) => {
    setChartID(chartID);
    setSourceID(sourceID);

    deleteChartToggle();
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
          if (typeof data !== 'object') {
            return setCompData(prevState => ({
              ...prevState,
              [chartID]: { data: [], error: data, loading: false },
            }));
          }

          // Set data in local state object with chartID as key
          setCompData(prevState => ({ ...prevState, [chartID]: { data, error: '', loading: false } }));
        });
      });
    }
  }, [charts, clusterID, dashboardID, params]);

  useEffect(() => {
    if (dashboardID && charts.length > 0) {
      dataCall();
    }
  }, [charts, dashboardID, dataCall]);

  return (
    <Fragment>
      <Toolbar
        dashboard={dashboard}
        refreshChart={dataCall}
        toggleDialog={newChartToggle}
        toggleDrawer={toggleFilterDrawer}
        toggleShare={shareLinkToggle}
      />
      <Container maxWidth='xl'>
        <Grid container direction='row' spacing={3}>
          {sortArr(charts, 'id').map((chart, index) => {
            const { id: chartID, config, sourceID, sourceName } = chart;
            const { ecl = {} } = config;
            const eclDataset = Object.keys(ecl) ? ecl.dataset : '';
            const dataObj = compData[chartID] || compData[sourceName] || compData[eclDataset] || {};

            return (
              <Grid key={index} item md={12}>
                <Paper variant='outlined'>
                  <ChartToolbar
                    chartID={chartID}
                    config={config}
                    dashboard={dashboard}
                    sourceID={sourceID}
                    removeChart={removeChart}
                    toggleDialog={editChart}
                  />
                  <div className={clearDiv}>
                    <Chart chart={chart} dashboard={dashboard} dataObj={dataObj} />
                  </div>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {showFilterDrawer && (
          <FilterDrawer
            dashboard={dashboard}
            deleteFilter={deleteFilter}
            showDrawer={showFilterDrawer}
            toggleDrawer={toggleFilterDrawer}
            compData={compData}
          />
        )}
        {newChartShow && <NewChartDialog show={newChartShow} toggleDialog={newChartToggle} />}
        {shareLinkShow && <ShareLinkDialog show={shareLinkShow} toggleShare={shareLinkToggle} />}
        {editChartShow && (
          <EditChartDialog chartID={chartID} show={editChartShow} toggleDialog={editChartToggle} />
        )}
        {deleteChartShow && (
          <DeleteChartDialog
            chartID={chartID}
            dashboard={dashboard}
            sourceID={sourceID}
            show={deleteChartShow}
            toggleDialog={deleteChartToggle}
          />
        )}
      </Container>
    </Fragment>
  );
};

export default Dashboard;
