/* eslint-disable no-unused-vars */
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Paper } from '@material-ui/core';
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

// Utils
import { getChartData } from '../../utils/chart';

// React Grid Layout
import ChartsGrid from './ChartsGrid';
import _ from 'lodash';

const Dashboard = () => {
  const [interactiveObj, setInteractiveObj] = useState({});
  const [chartLayouts, setChartLayouts] = useState(null); //layouts for RGL library
  const [sourceID, setSourceID] = useState(null);
  const [compData, setCompData] = useState({});
  const [chartID, setChartID] = useState(null);

  const [dashboard, charts = [], cluster, dashboardID, relations] = useSelector(({ dashboard }) => [
    dashboard.dashboard,
    dashboard.dashboard.charts,
    dashboard.dashboard.cluster,
    dashboard.dashboard.id,
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
      // creating chartLayouts on initial load.
      createLayout();
    }
    // Unsubscribe from state updates
    return () => (isMounted.current = false);
  }, []);

  const handleLayoutChange = (layout, allLayouts) => {
    const currentLayout = JSON.stringify(allLayouts);
    localStorage.setItem(dashboardID, currentLayout);
    // console.log('i just got triggered  create handleLayoutChange:>> ', allLayouts);
    // console.log('i just got triggered  create handleLayoutChange:>>  CURRENT', layout);
    setChartLayouts(allLayouts);
  };

  const createLayout = () => {
    if (!isMounted.current) return null;
    //1.check in localStorage/db if there is a chart Layour object.
    const lastSavedLayout = JSON.parse(localStorage.getItem(dashboardID));
    if (lastSavedLayout) {
      // console.log('i just got triggered  lastSavedLayout:>>', lastSavedLayout);
      setChartLayouts(lastSavedLayout);
    } else {
      //2.if not then it is a dash with no charts and we will create new standart layou
      const initlayout = chartIDs.map((id, index) => ({
        i: id.toString(),
        x: index % 2 ? 6 : 0,
        y: index * 20,
        w: 6,
        h: 20,
        minW: 3,
        maxW: 12,
        minH: 20,
      }));
      // console.log(' create initlayout :>> ', initlayout);
      setChartLayouts({ lg: initlayout });
    }
  };

  const createChart = layout => {
    const chart = charts.find(el => el.id === layout.i);

    const eclDataset = chart?.configuration?.ecl?.dataset || '';
    const chartData = compData[chart.id] || compData[eclDataset] || {};

    return (
      <Paper key={chart.id}>
        <ChartTile
          key={chart.id}
          chart={chart}
          compData={chartData}
          dashboard={dashboard}
          interactiveClick={interactiveClick}
          interactiveObj={interactiveObj}
          removeChart={removeChart}
          toggleData={showData}
          toggleEdit={editChart}
        />
      </Paper>
    );
  };

  const addChartToLayout = chart => {
    console.log('chart :>> ', chart);
    console.log('chartIDs :>> ', chartIDs);
    const newLayoutItem = {
      i: chart.id,
      x: chartIDs.length % 2 ? 6 : 0,
      y: Infinity,
      w: 6,
      h: 20,
      minW: 3,
      maxW: 12,
      minH: 20,
    };
    const updatedLayouts = [...chartLayouts.lg, newLayoutItem];
    // console.log('updatedLayouts :>> ', updatedLayouts);
    setChartLayouts(chartLayouts => ({ ...chartLayouts, lg: updatedLayouts }));
  };

  const removeChartLayout = chartID => {
    const updatedLayouts = _.reject(chartLayouts.lg, { i: chartID });
    // console.log('updatedLayouts :>> ', updatedLayouts);
    setChartLayouts(chartLayouts => ({ ...chartLayouts, lg: updatedLayouts }));
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
        {chartLayouts && (
          <ChartsGrid layouts={chartLayouts} handleLayoutChange={handleLayoutChange}>
            {_.map(chartLayouts?.lg, layout => createChart(layout))}
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
