import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// React Components
import Toolbar from './Toolbar';
import ChartToolbar from './ChartToolbar';
import Chart from '../Chart';
import NewChartDialog from '../Dialog/newChart';
import ShareLinkDialog from '../Dialog/shareLink';
import EditChartDialog from '../Dialog/editChart';
import FilterDrawer from '../Drawers/Filters';
import DeleteChartDialog from '../Dialog/DeleteChart';
import Relations from '../Dialog/Relations';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

// Redux Action
import { updateChart } from '../../features/chart/actions';

// Utils
import { getChartData } from '../../utils/chart';
import { sortArr } from '../../utils/misc';

const useStyles = makeStyles(() => ({
  clearDiv: { clear: 'both' },
}));

const Dashboard = () => {
  const [compData, setCompData] = useState({});
  const [chartID, setChartID] = useState(null);
  const [sourceID, setSourceID] = useState(null);
  const [interactiveObj, setInteractiveObj] = useState({});
  const { dashboard } = useSelector(state => state.dashboard);
  const { clusterID, id: dashboardID } = dashboard; // Destructure here instead of previous line to maintain reference to entire dashboard object
  const { charts } = useSelector(state => state.chart);
  const { showDialog: newChartShow, toggleDialog: newChartToggle } = useDialog(false);
  const { showDialog: shareLinkShow, toggleDialog: shareLinkToggle } = useDialog(false);
  const { showDialog: editChartShow, toggleDialog: editChartToggle } = useDialog(false);
  const { showDialog: relationsShow, toggleDialog: relationsToggle } = useDialog(false);
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

  const dataCall = useCallback(() => {
    // Set initial object keys and loading
    charts.forEach(({ id: chartID }) => {
      setCompData(prevState => ({ ...prevState, [chartID]: { loading: true } }));
    });

    // Fetch data for each chart
    charts.forEach(({ id: chartID }) => {
      getChartData(chartID, clusterID, interactiveObj, dashboardID).then(data => {
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
  }, [charts, clusterID, dashboardID, interactiveObj]);

  const interactiveClick = (chartID, field, clickValue) => {
    // Click same value twice, clear interactive click value
    if (clickValue === interactiveObj.value) {
      return setInteractiveObj({});
    }

    // Set interactive click values
    setInteractiveObj({ chartID, field, value: clickValue });
  };

  const updateChartWidth = async (event, chartObj) => {
    const { value } = event.target;
    const { sourceID, sourceType } = chartObj;
    let action;

    // Update size in chart config
    chartObj.config.size = value;

    try {
      action = await updateChart(chartObj, dashboard.id, sourceID, sourceType);
    } catch (error) {
      return console.error(error);
    }

    dispatch(action);
  };

  useEffect(() => {
    if ((dashboard.id || interactiveObj.value) && charts.length > 0) {
      dataCall();
    }
  }, [charts, dashboard, dataCall, interactiveObj.value]);

  return (
    <Fragment>
      <Toolbar
        dashboard={dashboard}
        refreshChart={dataCall}
        toggleNewChartDialog={newChartToggle}
        toggleRelationsDialog={relationsToggle}
        toggleDrawer={toggleFilterDrawer}
        toggleShare={shareLinkToggle}
      />
      <Container maxWidth='xl'>
        <Grid container direction='row' spacing={3}>
          {sortArr(charts, 'id').map((chart, index) => {
            const { id: chartID, config, sourceName } = chart;
            const { dataset, ecl = {}, size = 12 } = config;
            const eclDataset = ecl.dataset || '';
            const dataObj =
              compData[chartID] || compData[sourceName] || compData[dataset] || compData[eclDataset] || {};

            return (
              <Grid key={index} item md={Number(size)}>
                <Paper variant='outlined' style={{ position: 'relative' }}>
                  <ChartToolbar
                    chart={chart}
                    dashboard={dashboard}
                    removeChart={removeChart}
                    toggleDialog={editChart}
                    updateChartWidth={updateChartWidth}
                  />
                  <div className={clearDiv}>
                    <Chart
                      chart={chart}
                      dataObj={dataObj}
                      interactiveClick={interactiveClick}
                      interactiveObj={interactiveObj}
                    />
                  </div>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {showFilterDrawer && (
          <FilterDrawer
            dashboard={dashboard}
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
        {relationsShow && <Relations show={relationsShow} toggleDialog={relationsToggle} />}
      </Container>
    </Fragment>
  );
};

export default Dashboard;
