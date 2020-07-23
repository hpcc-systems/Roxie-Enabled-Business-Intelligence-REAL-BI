import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Tab, Tabs } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

// React Components
import Header from './Layout/Header';
import DirectoryDrawer from './Drawers/Directory';
import Dashboard from './Dashboard';
import NoCharts from './NoCharts';

// Redux Actions
import { getWorkspace, closeDashboardInWorkspace } from '../features/workspace/actions';
import { getDashboard, getDashboardParams, clearDashboard } from '../features/dashboard/actions';
import { getCharts } from '../features/chart/actions';

// React Hooks
import useDrawer from '../hooks/useDrawer';

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(2), minHeight: 48, maxHeight: 48 },
  span: { marginLeft: theme.spacing(1) },
  tab: { paddingTop: 0 },
}));

const Workspace = () => {
  const { workspaceID } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { openDashboards = [] } = useSelector(state => state.workspace.workspace);
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, span, tab } = useStyles();

  useEffect(() => {
    if (workspaceID) {
      dispatch(clearDashboard());
      getWorkspace(workspaceID).then(action => dispatch(action));
    }
  }, [dispatch, history, workspaceID]);

  const getDashboardInfo = useCallback(
    index => {
      const id = openDashboards[index].id;

      Promise.all([getDashboard(id), getCharts(id), getDashboardParams(id)]).then(actions => {
        // Batch dispatch each action to only have React re-render once
        batch(() => {
          dispatch(actions[0]);
          dispatch(actions[1]);
          dispatch(actions[2]);
        });
      });
    },
    [dispatch, openDashboards],
  );

  useEffect(() => {
    if (openDashboards.length > 0) {
      dispatch(clearDashboard());
      getDashboardInfo(tabIndex);
    }
  }, [dispatch, getDashboardInfo, openDashboards, tabIndex]);

  const changeTabIndex = (event, newValue) => {
    // Close open dashboard
    if (event.target.tagName !== 'SPAN') {
      const dashboardID = openDashboards[newValue].id;

      // Reset tab position
      setTabIndex(0);

      return Promise.all([closeDashboardInWorkspace(dashboardID, workspaceID), clearDashboard()]).then(
        actions => {
          batch(() => {
            dispatch(actions[0]);
            dispatch(actions[1]);
          });
        },
      );
    }

    // Change currently selected dashboard
    return setTabIndex(newValue);
  };

  return (
    <Fragment>
      <Header toggleDrawer={toggleDrawer} />
      {showDrawer && <DirectoryDrawer showDrawer={showDrawer} toggleDrawer={toggleDrawer} />}
      {openDashboards.length > 0 ? (
        <AppBar className={appbar} position='static' color='inherit'>
          <Tabs value={tabIndex} onChange={changeTabIndex}>
            {openDashboards.map(({ id, name }) => {
              return (
                <Tab
                  component='div'
                  key={id}
                  className={tab}
                  label={
                    <span className={span}>
                      {name}
                      <IconButton>
                        <CloseIcon />
                      </IconButton>
                    </span>
                  }
                />
              );
            })}
          </Tabs>
        </AppBar>
      ) : (
        <NoCharts />
      )}
      {dashboardID && <Dashboard />}
    </Fragment>
  );
};

export default Workspace;
