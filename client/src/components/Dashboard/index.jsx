/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Paper } from '@material-ui/core';
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
  // layouts for drag and drop
  const [chartLayouts, setChartLayouts] = useState(null);

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
  }, []);

  const handleLayoutChange = (layout, allLayouts) => {
    const currentLayout = JSON.stringify(allLayouts);
    localStorage.setItem(dashboardID, currentLayout);
    console.log('i just got triggered  create handleLayoutChange:>> ', allLayouts);
    setChartLayouts(allLayouts);
  };

  const createLayout = () => {
    //1.check in localStorage/db if there is a chart Layour object.
    const lastSavedLayout = JSON.parse(localStorage.getItem(dashboardID));
    if (lastSavedLayout) {
      console.log('i just got triggered  create layout:>> ');
      setChartLayouts(lastSavedLayout);
    } else {
      //2.if not then it is a dash with no charts and we will create new standart layou
      const initlayout = chartIDs.map((id, index) => ({
        i: id.toString(),
        x: 0,
        y: index * 35,
        w: 12,
        h: 36,
        minW: 2,
        maxW: 12,
        minH: 36,
      }));
      setChartLayouts({ lg: initlayout });
    }
  };

  const createChart = layout => {
    const chart = charts.find(el => el.id === layout.i);
    if (!chart) return;
    return (
      <Paper key={chart.id}>
        <ChartTile
          key={chart.id.toString()}
          chart={chart}
          compData={compData}
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
    const newLayoutItem = {
      i: chart.id.toString(),
      x: 0,
      y: Infinity,
      w: 12,
      h: 36,
      minW: 2,
      maxW: 12,
      minH: 36,
    };
    const updatedLayouts = { ...chartLayouts };
    updatedLayouts.lg.push(newLayoutItem);
    setChartLayouts(updatedLayouts);
    console.log('chartLayouts :>> ', chartLayouts);
  };

  const removeChartLayout = chartID => {
    console.log('chart :>> ', chartID);
    const updatedLayouts = _.reject(chartLayouts.lg, { i: chartID });
    console.log('updatedLayouts :>> ', updatedLayouts);
    setChartLayouts(chartLayouts => ({ ...chartLayouts, lg: updatedLayouts }));
  };

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
      <Container maxWidth='xl' style={{ overflow: 'hidden' }}>
        {chartLayouts && (
          <ChartsGrid layouts={chartLayouts} handleLayoutChange={handleLayoutChange}>
            {_.map(chartLayouts.lg, layout => createChart(layout))}
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

// const initlayout = chartIDs.map((id, index) => {
//   const lg = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 12,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   const md = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 10,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   const sm = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 6,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   const xs = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 4,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   return { lg, md, sm, xs };
// });

// const initlayout = chartIDs.map((id, index) => {
//   const lg = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 12,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   const md = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 10,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   const sm = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 6,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   const xs = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 4,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   const xxs = {
//     i: id.toString(),
//     x: 0,
//     y: index * 27,
//     w: 2,
//     h: 27,
//     minW: 2,
//     maxW: 12,
//     minH: 5,
//   };
//   return { lg, md, sm, xs, xxs };
// });
