import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Container, Grid } from '@material-ui/core';

// React Components
import Toolbar from './Toolbar';
import NewChartDialog from '../Dialog/newChart';
import ShareLinkDialog from '../Dialog/shareLink';
import EditChartDialog from '../Dialog/editChart';
import FilterDrawer from '../Drawers/Filters';
import DeleteChartDialog from '../Dialog/DeleteChart';
import Relations from '../Dialog/Relations';
import ChartTile from './ChartTile';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

// Utils
import { getChartData } from '../../utils/chart';
import { sortArr } from '../../utils/misc';
import { updateChart } from '../../features/chart/actions';

const Dashboard = () => {
  const [chartID, setChartID] = useState(null);
  const [sourceID, setSourceID] = useState(null);
  const [compData, setCompData] = useState({});
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
  const dragItemID = useRef(null);
  const dragNode = useRef(null);
  const targetItemID = useRef(null);
  const isDifferentNode = useRef(null);
  const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();

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

  useEffect(() => {
    if ((dashboard.id || interactiveObj.value) && charts.length > 0) {
      dataCall();
    }
  }, [charts, dashboard, dataCall, interactiveObj.value]);

  const handleDragStart = (event, chartID) => {
    dragItemID.current = chartID;
    dragNode.current = event.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);

    // Create minor asynchronous delay before changing state and 'draggedDiv' style getting applied
    // This allows us to have the ghost image being dragged around but the component not display as a duplicate
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (event, chartID) => {
    if (chartID !== dragItemID.current) {
      isDifferentNode.current = true;
      targetItemID.current = chartID;
    } else {
      isDifferentNode.current = false;
      targetItemID.current = null;
    }
  };

  const handleDragEnd = () => {
    dragNode.current.removeEventListener('dragend', handleDragEnd);

    if (isDifferentNode.current) {
      // Get chart objects and sort values
      const draggedChart = charts.find(({ id }) => id === dragItemID.current);
      const targetChart = charts.find(({ id }) => id === targetItemID.current);
      const dragSortVal = draggedChart.config.sort;
      const targetSortVal = targetChart.config.sort;

      // Switch sort values in chart objects
      draggedChart.config.sort = targetSortVal;
      targetChart.config.sort = dragSortVal;

      Promise.all([
        updateChart(draggedChart, dashboard.id, draggedChart.sourceID, draggedChart.sourceType),
        updateChart(targetChart, dashboard.id, targetChart.sourceID, targetChart.sourceType),
      ]).then(actions => {
        batch(() => {
          actions.forEach(action => dispatch(action));
        });
      });
    }

    dragItemID.current = null;
    dragNode.current = null;
    setDragging(false);
  };

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
          {sortArr(charts, 'config::sort').map((chart, index) => {
            return (
              <ChartTile
                key={index}
                chart={chart}
                compData={compData}
                dashboard={dashboard}
                dragging={dragging}
                dragItemID={dragItemID}
                handleDragEnter={handleDragEnter}
                handleDragStart={handleDragStart}
                interactiveClick={interactiveClick}
                interactiveObj={interactiveObj}
                removeChart={removeChart}
                toggleDialog={editChart}
              />
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
