import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
// React Components
import ShareWorkspaceDialog from '../Dialog/ShareWorkspace';
import DeleteChartDialog from '../Dialog/DeleteChart';
import SharedWithDialog from '../Dialog/SharedWith';
import EditChartDialog from '../Dialog/editChart';
import NewChartDialog from '../Dialog/newChart';
import FilterDrawer from '../Drawers/Filters';
import Relations from '../Dialog/Relations';
import CheckCluster from './CheckCluster';
// import PdfDialog from '../Dialog/PDF';
import ChartsGrid from './ChartsGrid';
import Toolbar from './Toolbar';

// React Hooks
import useDialog from '../../hooks/useDialog';
import useDrawer from '../../hooks/useDrawer';

import { refreshAllChartsData, refreshDataByChartIds } from '../../features/dashboard/actions';

const useStyles = makeStyles(() => ({
  dashboardRoot: { overflow: 'hidden', paddingBottom: '50px' },
}));

const Dashboard = ({ isChartDialogCalled, setEditCurrentDashboard }) => {
  const dispatch = useDispatch();
  const dashboard = useSelector(({ dashboard }) => dashboard.dashboard);
  const { isClusterCredsValid, permission, charts = [], relations } = dashboard;

  const [interactiveObj, setInteractiveObj] = useState({});
  const classes = useStyles();

  const [deleteChartShow, deleteChartToggle] = useDialog(false);
  const [sharedWithShow, sharedWithToggle] = useDialog(false);
  const [shareLinkShow, shareLinkToggle] = useDialog(false);
  const [editChartShow, editChartToggle] = useDialog(false);
  const [relationsShow, relationsToggle] = useDialog(false);
  const [newChartShow, newChartToggle] = useDialog(false);
  // const [pdfShow, pdfToggle] = useDialog(false);

  const [showFilterDrawer, toggleFilterDrawer] = useDrawer(false);

  const interactiveClick = useCallback(
    (chartID, field, clickValue) => {
      const effectedCharts = relations.map(el => {
        if (el.sourceID === chartID) return el.targetID;
      });
      const effectedChartIds = [...new Set(effectedCharts)]; // Remove duplicate Id's from array
      setInteractiveObj(prevState => ({ ...prevState, chartID, field, value: clickValue, effectedChartIds }));
      dispatch(refreshDataByChartIds(effectedChartIds || []));
    },
    [interactiveObj],
  );

  const resetDashboardCharts = chartIds => {
    if (chartIds) {
      setInteractiveObj({});
      dispatch(refreshDataByChartIds(chartIds));
    } else {
      dispatch(refreshAllChartsData());
    }
  };

  // Initial data call when component is loaded
  useEffect(() => {
    if (permission === 'Owner' && !isChartDialogCalled.current) {
      if (dashboard.fileName && charts.length === 0) {
        newChartToggle(true);
        isChartDialogCalled.current = true;
      }
    }
  }, []);

  return (
    <Fragment>
      <Toolbar
        dashboard={dashboard}
        refreshChart={() => resetDashboardCharts()}
        hasInteractiveFilter={Object.keys(interactiveObj).length > 0}
        resetInteractiveFilter={() => resetDashboardCharts(interactiveObj.effectedChartIds)}
        // togglePDF={pdfToggle}
        toggleShare={shareLinkToggle}
        toggleDrawer={toggleFilterDrawer}
        toggleSharedWith={sharedWithToggle}
        toggleNewChartDialog={newChartToggle}
        toggleRelationsDialog={relationsToggle}
      />
      {/* MAIN CONTENT START! */}
      <Container maxWidth='xl' className={classes.dashboardRoot}>
        {isClusterCredsValid ? (
          <ChartsGrid
            interactiveClick={interactiveClick}
            interactiveObj={interactiveObj}
            editChartToggle={editChartToggle}
            deleteChartToggle={deleteChartToggle}
          />
        ) : (
          <CheckCluster setEditCurrentDashboard={setEditCurrentDashboard} />
        )}
        {/* MAIN CONTENT END! */}
        {showFilterDrawer && <FilterDrawer showDrawer={showFilterDrawer} toggleDrawer={toggleFilterDrawer} />}
        {deleteChartShow && <DeleteChartDialog show={deleteChartShow} toggleDialog={deleteChartToggle} />}
        {shareLinkShow && <ShareWorkspaceDialog show={shareLinkShow} toggleDialog={shareLinkToggle} />}
        {sharedWithShow && <SharedWithDialog show={sharedWithShow} toggleDialog={sharedWithToggle} />}
        {editChartShow && <EditChartDialog show={editChartShow} toggleDialog={editChartToggle} />}
        {newChartShow && <NewChartDialog show={newChartShow} toggleDialog={newChartToggle} />}
        {relationsShow && <Relations show={relationsShow} toggleDialog={relationsToggle} />}
        {/* {pdfShow && <PdfDialog compData={compData} show={pdfShow} toggleDialog={pdfToggle} />} */}
      </Container>
    </Fragment>
  );
};

export default Dashboard;
