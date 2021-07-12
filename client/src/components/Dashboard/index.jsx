/* eslint-disable no-unused-vars */
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Container, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import _orderBy from 'lodash/orderBy';
import { useSnackbar } from 'notistack';

// React Components
import ShareWorkspaceDialog from '../Dialog/ShareWorkspace';
import DataSnippetDialog from '../Dialog/DataSnippet';
import DeleteChartDialog from '../Dialog/DeleteChart';
import SharedWithDialog from '../Dialog/SharedWith';
import EditChartDialog from '../Dialog/editChart';
import NewChartDialog from '../Dialog/newChart';
import FilterDrawer from '../Drawers/Filters';
import ChartsGrid from './ChartsGrid';
import Relations from '../Dialog/Relations';
import ChartTile from './ChartTile';
import PdfDialog from '../Dialog/PDF';
import Toolbar from './Toolbar';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

// Utils
import { updateDashboardLayout } from '../../utils/dashboard';
import { getChartData } from '../../utils/chart';
import _ from 'lodash';

const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [interactiveObj, setInteractiveObj] = useState({});
  const [chartLayouts, setChartLayouts] = useState(null); //layouts for RGL library
  const [sourceID, setSourceID] = useState(null);
  const [compData, setCompData] = useState({});
  const [chartID, setChartID] = useState(null);

  const [
    dashboard,
    dashboardID,
    charts = [],
    dashboardLayout,
    cluster,
    relations,
  ] = useSelector(({ dashboard }) => [
    dashboard.dashboard,
    dashboard.dashboard.id,
    dashboard.dashboard.charts,
    dashboard.dashboard.layout,
    dashboard.dashboard.cluster,
    dashboard.dashboard.relations,
  ]);

  const [deleteChartShow, deleteChartToggle] = useDialog(false);
  const [sharedWithShow, sharedWithToggle] = useDialog(false);
  const [shareLinkShow, shareLinkToggle] = useDialog(false);
  const [editChartShow, editChartToggle] = useDialog(false);
  const [relationsShow, relationsToggle] = useDialog(false);
  const [newChartShow, newChartToggle] = useDialog(false);
  const [dataShow, dataToggle] = useDialog(false);
  const [pdfShow, pdfToggle] = useDialog(false);

  const [showFilterDrawer, toggleFilterDrawer] = useDrawer(false);

  const isMounted = useRef(true); // Using this variable to unsubscibe from state update if component is unmounted

  const chartIDs = charts.map(({ id }) => id);

  const editChart = useCallback(
    chartID => {
      setChartID(chartID);
      editChartToggle();
    },
    [chartID],
  );

  const showData = useCallback(
    chartID => {
      setChartID(chartID);
      dataToggle();
    },
    [chartID],
  );

  const removeChart = useCallback(
    async (chartID, sourceID) => {
      setChartID(chartID);
      setSourceID(sourceID);

      deleteChartToggle();
    },
    [chartID, sourceID],
  );

  const interactiveClick = useCallback(
    (chartID, field, clickValue) => {
      const effectedCharts = relations
        .filter(({ sourceID }) => sourceID === chartID)
        .map(({ targetID }) => targetID);

      // Remove duplicate Id's from array
      const effectedChartIds = Array.from(new Set(effectedCharts.map(Id => Id))).map(Id => {
        return effectedCharts.find(Id2 => Id2 === Id);
      });

      setInteractiveObj(prevState => ({ ...prevState, chartID, field, value: clickValue, effectedChartIds }));
    },
    [interactiveObj],
  );

  const dataCall = (chartIDs, interactiveObj) => {
    // Set initial object keys and loading
    chartIDs.forEach(Id => setCompData(prevState => ({ ...prevState, [Id]: { loading: true } })));
    // Fetch data for each chart
    chartIDs.forEach(Id => {
      (async () => {
        try {
          const results = await getChartData(Id, cluster.id, dashboardID, interactiveObj);
          if (!isMounted.current) return null;
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
          if (!isMounted.current) return null;
          setCompData(prevState => ({ ...prevState, [Id]: { error: error.message, loading: false } }));
        }
      })();
    });
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

  // Initial data call when component is loaded
  useEffect(() => {
    if (dashboard.id && charts.length > 0) {
      dataCall(chartIDs, {});
      createLayout(); // creating layouts for drag and resize lib on initial load.
    }
    return () => (isMounted.current = false); // Unsubscribe from state updates
  }, []);

  const createLayout = () => {
    if (!isMounted.current) return null;
    //1.check in redux store if there is a dashboardLayout.
    if (dashboardLayout) {
      setChartLayouts(JSON.parse(dashboardLayout)); //Layouts available, apply layouts on initial load
    } else {
      const initlayout = mapChartIdToLayout(chartIDs); //2.No layout found, either new dash or no charts yet, create standart layout base on chartIds.
      setChartLayouts({ lg: initlayout });
    }
  };

  // this function takes only array of ids, if u have single id put it in array and distructure result
  const mapChartIdToLayout = chartIdArray =>
    chartIdArray.map((id, index) => ({
      i: id.toString(),
      x: index % 2 ? 6 : 0,
      y: Infinity,
      w: 6,
      h: 20,
      minW: 3,
      maxW: 12,
      minH: 20,
    }));

  const createChart = layoutIndex => {
    const chart = charts.find(el => el.id === layoutIndex);
    const eclDataset = chart?.configuration?.ecl?.dataset || '';
    const chartData = compData[chart.id] || compData[eclDataset] || {};
    return (
      <Paper key={chart.id}>
        <ChartTile
          key={chart.id}
          chart={chart}
          compData={chartData}
          interactiveClick={interactiveClick}
          interactiveObj={interactiveObj}
          removeChart={removeChart}
          toggleData={showData}
          toggleEdit={editChart}
        />
      </Paper>
    );
  };

  const handleLayoutChange = async (layout, allLayouts) => {
    if (_.isEqual(chartLayouts, allLayouts)) return; // Do not updated DB if layouts hasnt changed
    const oldLayouts = { ...chartLayouts }; // 1. copy old Layout.
    setChartLayouts(() => allLayouts); // 2. setChartLayouts to new Layout
    try {
      await updateDashboardLayout(allLayouts, dashboardID); // 3. Make an update in DB
    } catch (error) {
      setChartLayouts(() => oldLayouts); // 4. if DB !200 revert to old layout
      // 5. show snack that we couldnt update layout.
      enqueueSnackbar(`Something went wrong, we could not save your layout. ${error.message}`, {
        anchorOrigin: { horizontal: 'right', vertical: 'top' },
        variant: 'error',
        preventDuplicate: true,
      });
    }
  };

  const addChartToLayout = chart => {
    const [newLayoutItem] = mapChartIdToLayout([chart.id]);
    if (chartLayouts) {
      const updatedLayouts = [...chartLayouts.lg, newLayoutItem];
      setChartLayouts(chartLayouts => ({ ...chartLayouts, lg: updatedLayouts }));
      enqueueSnackbar('New item has been added to dashboard', {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
    } else {
      setChartLayouts({ lg: [newLayoutItem] });
    }
  };

  const removeChartLayout = chartID => {
    const updatedLayouts = _.reject(chartLayouts.lg, { i: chartID });
    setChartLayouts(chartLayouts => ({ ...chartLayouts, lg: updatedLayouts }));
    enqueueSnackbar('Item deleted successfully!', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
    });
  };

  // console.log('rerender dashboard :>>  ');

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
      {/* MAIN CONTENT START! */}
      <Container maxWidth='xl' style={{ overflow: 'hidden', paddingBottom: '50px' }}>
        {chartLayouts && isMounted.current && (
          <ChartsGrid
            layouts={chartLayouts}
            handleLayoutChange={handleLayoutChange}
            permission={dashboard.permission}
          >
            {_.map(chartLayouts?.lg, layout => createChart(layout.i))}
          </ChartsGrid>
        )}
        {/* MAIN CONTENT END! */}
        {showFilterDrawer && (
          <FilterDrawer
            dashboard={dashboard}
            showDrawer={showFilterDrawer}
            toggleDrawer={toggleFilterDrawer}
            getChartData={dataCall}
          />
        )}
        {newChartShow && (
          <NewChartDialog
            show={newChartShow}
            toggleDialog={newChartToggle}
            getChartData={dataCall}
            addChartToLayout={addChartToLayout}
          />
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
            removeChartLayout={removeChartLayout}
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
