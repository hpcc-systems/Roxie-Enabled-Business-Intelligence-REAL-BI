import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Tab, Tabs } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import _orderBy from 'lodash/orderBy';
import clsx from 'clsx';

// React Components
import Header from './Layout/Header';
import DirectoryDrawer from './Drawers/Directory';
import Dashboard from './Dashboard';
import NoCharts from './NoCharts';

// Redux Actions
import { getWorkspace, closeDashboardInWorkspace } from '../features/workspace/actions';
import { getDashboard, clearDashboard } from '../features/dashboard/actions';

// React Hooks
import useDrawer from '../hooks/useDrawer';

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(2), minHeight: 48, maxHeight: 48 },
  selectedTab: {
    '& button': { opacity: '1 !important' },
  },
  span: { margin: theme.spacing(1, 0, 0, 1) },
  tab: {
    maxWidth: 270,
    paddingTop: 0,
    '& button': {
      opacity: 0,
      marginLeft: theme.spacing(3),
      padding: 0,
    },
    '&:hover button': { opacity: 1 },
  },
}));

const Workspace = () => {
  const { workspaceID } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { workspace = {} } = useSelector(state => state.workspace);
  const { openDashboards = [] } = workspace;
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const { showDrawer, toggleDrawer } = useDrawer(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, selectedTab, span, tab } = useStyles();

  useEffect(() => {
    if (workspaceID) {
      dispatch(clearDashboard());
      getWorkspace(workspaceID)
        .then(action => dispatch(action))
        .catch(action => dispatch(action));
    }
  }, [dispatch, history, workspaceID]);

  const getDashboardInfo = useCallback(
    index => {
      (async () => {
        try {
          const action = await getDashboard(_orderBy(openDashboards, ['updatedAt'], ['asc'])[index].id);
          dispatch(action);
        } catch (error) {
          dispatch(error);
        }
      })();
    },
    [dispatch, openDashboards],
  );

  useEffect(() => {
    if (openDashboards.length > 0) {
      dispatch(clearDashboard());

      // Reset tabIndex to 0 if it falls outside bounds of array
      if (tabIndex >= openDashboards.length) {
        setTabIndex(0);
        return getDashboardInfo(0);
      }

      getDashboardInfo(tabIndex);
    }
  }, [dispatch, getDashboardInfo, openDashboards, tabIndex]);

  useEffect(() => {
    if (openDashboards.length === 0 && dashboardID) {
      dispatch(clearDashboard());
    }
  }, [dashboardID, dispatch, openDashboards]);

  const changeTabIndex = (event, newValue) => setTabIndex(newValue);

  const closeDashboardTab = async dashboardID => {
    try {
      const actions = await Promise.all([
        closeDashboardInWorkspace(dashboardID, workspaceID),
        clearDashboard(),
      ]);
      // Reset tab position
      setTabIndex(0);
      batch(() => actions.forEach(action => dispatch(action)));
    } catch (error) {
      dispatch(error);
    }
  };

  return (
    <Fragment>
      <Header toggleDrawer={toggleDrawer} />
      {showDrawer && <DirectoryDrawer showDrawer={showDrawer} toggleDrawer={toggleDrawer} />}
      {openDashboards.length > 0 ? (
        <AppBar className={appbar} position='static' color='inherit'>
          <Tabs value={tabIndex} onChange={changeTabIndex}>
            {_orderBy(openDashboards, ['updatedAt'], ['asc']).map((dashboard, index) => {
              return (
                <Tab
                  component='div'
                  key={dashboard.id}
                  className={clsx(tab, { [selectedTab]: index === tabIndex })}
                  label={
                    <span className={span}>
                      {dashboard.name}
                      <IconButton onClick={() => closeDashboardTab(dashboard.id)}>
                        <CloseIcon fontSize='small' />
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
