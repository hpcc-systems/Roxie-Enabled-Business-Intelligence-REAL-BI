import React, { Fragment, useEffect, useRef, useState } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { Container, Grid } from '@material-ui/core';
import _orderBy from 'lodash/orderBy';

// React Components
import Toolbar from './Toolbar';
import NewChartDialog from '../Dialog/newChart';
import ShareWorkspaceDialog from '../Dialog/ShareWorkspace';
import EditChartDialog from '../Dialog/editChart';
import FilterDrawer from '../Drawers/Filters';
import DeleteChartDialog from '../Dialog/DeleteChart';
import Relations from '../Dialog/Relations';
import ChartTile from './ChartTile';
import PdfDialog from '../Dialog/PDF';
import DataSnippetDialog from '../Dialog/DataSnippet';
import SharedWithDialog from '../Dialog/SharedWith';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

// Redux Action
import { updateChart } from '../../features/dashboard/actions';

// Utils
import { getChartData } from '../../utils/chart';

const Dashboard = () => {
  const [chartID, setChartID] = useState(null);
  const [sourceID, setSourceID] = useState(null);
  const [compData, setCompData] = useState({});
  const [interactiveObj, setInteractiveObj] = useState({});
  const {
    dashboard,
    dashboard: { charts = [], cluster, id: dashboardID, relations },
  } = useSelector(state => state.dashboard);
  const { showDialog: newChartShow, toggleDialog: newChartToggle } = useDialog(false);
  const { showDialog: shareLinkShow, toggleDialog: shareLinkToggle } = useDialog(false);
  const { showDialog: editChartShow, toggleDialog: editChartToggle } = useDialog(false);
  const { showDialog: relationsShow, toggleDialog: relationsToggle } = useDialog(false);
  const { showDialog: deleteChartShow, toggleDialog: deleteChartToggle } = useDialog(false);
  const { showDialog: pdfShow, toggleDialog: pdfToggle } = useDialog(false);
  const { showDialog: dataShow, toggleDialog: dataToggle } = useDialog(false);
  const { showDialog: sharedWithShow, toggleDialog: sharedWithToggle } = useDialog(false);
  const { showDrawer: showFilterDrawer, toggleDrawer: toggleFilterDrawer } = useDrawer(false);
  const dragItemID = useRef(null);
  const dragNode = useRef(null);
  const targetItemID = useRef(null);
  const isDifferentNode = useRef(null);
  const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();
  const chartIDs = charts.map(({ id }) => id);

  const editChart = chartID => {
    setChartID(chartID);
    editChartToggle();
  };

  const showData = chartID => {
    setChartID(chartID);
    dataToggle();
  };

  const removeChart = async (chartID, sourceID) => {
    setChartID(chartID);
    setSourceID(sourceID);

    deleteChartToggle();
  };

  const dataCall = (chartIDs, interactiveObj) => {
    // Set initial object keys and loading
    chartIDs.forEach(Id => setCompData(prevState => ({ ...prevState, [Id]: { loading: true } })));

    // Fetch data for each chart
    chartIDs.forEach(Id => {
      (async () => {
        try {
          const results = await getChartData(Id, cluster.id, dashboardID, interactiveObj);
          setCompData(prevState => ({
            ...prevState,
            [Id]: {
              data: results.data,
              error: '',
              lastModifiedDate: results.lastModifiedDate,
              loading: false,
            },
          }));
        } catch (error) {
          setCompData(prevState => ({ ...prevState, [Id]: { error: error.message, loading: false } }));
        }
      })();
    });
  };

  const interactiveClick = (chartID, field, clickValue) => {
    const effectedCharts = relations
      .filter(({ sourceID }) => sourceID === chartID)
      .map(({ targetID }) => targetID);

    // Remove duplicate Id's from array
    const effectedChartIds = Array.from(new Set(effectedCharts.map(Id => Id))).map(Id => {
      return effectedCharts.find(Id2 => Id2 === Id);
    });

    setInteractiveObj(prevState => ({ ...prevState, chartID, field, value: clickValue, effectedChartIds }));
  };

  // Initial data call when component is loaded
  useEffect(() => {
    if (dashboard.id && charts.length > 0) {
      dataCall(chartIDs, {});
    }
  }, []);

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

  const handleDragEnd = async () => {
    dragNode.current.removeEventListener('dragend', handleDragEnd);

    if (isDifferentNode.current) {
      // Get chart objects and sort values
      const draggedChart = charts.find(({ id }) => id === dragItemID.current);
      const targetChart = charts.find(({ id }) => id === targetItemID.current);
      const dragSortVal = draggedChart.configuration.sort;
      const targetSortVal = targetChart.configuration.sort;

      // Switch sort values in chart objects
      draggedChart.configuration.sort = targetSortVal;
      targetChart.configuration.sort = dragSortVal;

      try {
        const actions = await Promise.all([
          updateChart(draggedChart, dashboard.id),
          updateChart(targetChart, dashboard.id),
        ]);
        batch(() => actions.forEach(action => dispatch(action)));
      } catch (error) {
        dispatch(error);
      }
    }

    dragItemID.current = null;
    dragNode.current = null;
    setDragging(false);
  };

  const resetDashboardCharts = chartIDs => {
    dataCall(chartIDs, {});
    setInteractiveObj({});
  };

  // Data call when interactiveObj changes
  useEffect(() => {
    const chartIDs = interactiveObj.effectedChartIds || [];
    dataCall(chartIDs, interactiveObj);
  }, [interactiveObj]);

  return (
    <Fragment>
      <Toolbar
        dashboard={dashboard}
        dataFetchInProgress={Object.keys(compData).some(key => compData[key].loading === true)}
        hasInteractiveFilter={Object.keys(interactiveObj).length > 0}
        resetInteractiveFilter={() => resetDashboardCharts(interactiveObj.effectedChartIds)}
        refreshChart={() => resetDashboardCharts(chartIDs)}
        toggleNewChartDialog={newChartToggle}
        toggleRelationsDialog={relationsToggle}
        toggleDrawer={toggleFilterDrawer}
        togglePDF={pdfToggle}
        toggleShare={shareLinkToggle}
        toggleSharedWith={sharedWithToggle}
      />
      <Container maxWidth='xl'>
        <Grid container direction='row' spacing={3}>
          {_orderBy(charts, [({ configuration }) => configuration?.sort || ''], ['asc']).map(
            (chart, index) => {
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
                  toggleData={showData}
                  toggleEdit={editChart}
                />
              );
            },
          )}
        </Grid>

        {showFilterDrawer && (
          <FilterDrawer
            dashboard={dashboard}
            showDrawer={showFilterDrawer}
            toggleDrawer={toggleFilterDrawer}
            getChartData={dataCall}
          />
        )}
        {newChartShow && (
          <NewChartDialog show={newChartShow} toggleDialog={newChartToggle} getChartData={dataCall} />
        )}
        {shareLinkShow && <ShareWorkspaceDialog show={shareLinkShow} toggleDialog={shareLinkToggle} />}
        {editChartShow && (
          <EditChartDialog
            chartID={chartID}
            show={editChartShow}
            toggleDialog={editChartToggle}
            getChartData={dataCall}
          />
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
        {pdfShow && <PdfDialog compData={compData} show={pdfShow} toggleDialog={pdfToggle} />}
        {dataShow && (
          <DataSnippetDialog data={compData[chartID]?.data || []} show={dataShow} toggleDialog={dataToggle} />
        )}
        {sharedWithShow && <SharedWithDialog show={sharedWithShow} toggleDialog={sharedWithToggle} />}
      </Container>
    </Fragment>
  );
};

export default Dashboard;
