import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { batch, useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tab, Tabs, Typography } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
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
import _ from 'lodash';

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: {
    width: '100%',
  },
  selectedTab: {
    '& svg': { opacity: '1 !important' },
  },
  closeTab: { marginLeft: theme.spacing(1), opacity: 0 },
  tab: {
    '&:hover svg': { opacity: 1 },
  },
  tabWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& span': {
      flexGrow: 1,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
}));

const Workspace = () => {
  let { workspaceID, dashID } = useParams();
  const dispatch = useDispatch();
  const { workspace = {} } = useSelector(state => state.workspace);
  const { openDashboards = [] } = workspace;
  const { id: dashboardID } = useSelector(state => state.dashboard.dashboard);
  const [showDrawer, toggleDrawer] = useDrawer(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, selectedTab, closeTab, tab, tabWrapper } = useStyles();

  const [editCurrentDashboard, setEditCurrentDashboard] = useState(false);

  const isTabfromURLparamsUpdated = React.useRef(false); // we will keep a track to run tab switch only once and only if we have dashID and filename in URL

  useEffect(() => {
    const handleTabsAndActions = actions => {
      batch(() => {
        const lastViewedDash = localStorage.getItem(`lastViewedDashIndex:${workspaceID}`);
        lastViewedDash ? setTabIndex(parseInt(lastViewedDash)) : setTabIndex(0);
        actions.forEach(action => dispatch(action));
      });
    };

    if (workspaceID) {
      dispatch(clearDashboard());
      dashID = dashID ? dashID : null;
      getWorkspace(workspaceID, dashID)
        .then(handleTabsAndActions)
        .catch(action => dispatch(action));
    }
  }, [workspaceID]);

  const getDashboardInfo = async index => {
    dispatch(clearDashboard());
    try {
      const action = await getDashboard(openDashboards[index].id);
      dispatch(action);
    } catch (error) {
      dispatch(error);
    }
  };

  const debouncedGetDashboardInfo = useCallback(_.debounce(getDashboardInfo, 500), [openDashboards]);

  useEffect(() => {
    if (openDashboards.length > 0) {
      if (dashID) {
        if (!isTabfromURLparamsUpdated.current) {
          const urldashIDIndex = openDashboards.findIndex(dash => dash.id === dashID);
          urldashIDIndex > -1 && setTabIndex(urldashIDIndex);
        }
        isTabfromURLparamsUpdated.current = true;
      }
      // Reset tabIndex to 0 if it falls outside bounds of array
      if (tabIndex >= openDashboards.length) {
        setTabIndex(0);
        localStorage.setItem(`lastViewedDashIndex:${workspaceID}`, '0');
        return debouncedGetDashboardInfo(0);
      }
      debouncedGetDashboardInfo(tabIndex);
      localStorage.setItem(`lastViewedDashIndex:${workspaceID}`, tabIndex.toString());
    }
  }, [openDashboards, tabIndex]);

  useEffect(() => {
    if (openDashboards.length === 0 && dashboardID) {
      dispatch(clearDashboard());
    }
  }, [dashboardID, dispatch, openDashboards]);

  useEffect(() => {
    if (editCurrentDashboard) {
      toggleDrawer(true);
    }
  }, [editCurrentDashboard]);

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  const closeDashboardTab = async (event, dashboardID) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const actions = await Promise.all([
        closeDashboardInWorkspace(dashboardID, workspaceID),
        clearDashboard(),
      ]);
      batch(() => {
        actions.forEach(action => dispatch(action));
        setTabIndex(0);
      });
    } catch (error) {
      dispatch(error);
    }
  };

  const chartDialogOnInitialLoad = React.useRef(false);

  return (
    <Fragment>
      <Header toggleDrawer={toggleDrawer} />
      {showDrawer && (
        <DirectoryDrawer
          changeTabIndex={changeTabIndex}
          showDrawer={showDrawer}
          toggleDrawer={toggleDrawer}
          editCurrentDashboard={editCurrentDashboard}
          setEditCurrentDashboard={setEditCurrentDashboard}
        />
      )}
      {openDashboards.length > 0 ? (
        <AppBar className={appbar} position='static' color='inherit'>
          <Tabs value={tabIndex} onChange={changeTabIndex} variant='scrollable' scrollButtons='auto'>
            {openDashboards.map((dashboard, index) => {
              return (
                <Tab
                  component='div'
                  key={dashboard.id}
                  className={clsx(tab, { [selectedTab]: index === tabIndex })}
                  classes={{ wrapper: tabWrapper }}
                  label={
                    <>
                      <Typography component='span' variant='body1'>
                        {dashboard.name}
                      </Typography>

                      <CloseIcon
                        className={closeTab}
                        onClick={event => closeDashboardTab(event, dashboard.id)}
                        fontSize='small'
                      />
                    </>
                  }
                />
              );
            })}
          </Tabs>
        </AppBar>
      ) : (
        <NoCharts />
      )}
      {dashboardID && (
        <Dashboard
          setEditCurrentDashboard={setEditCurrentDashboard}
          isChartDialogCalled={chartDialogOnInitialLoad}
        />
      )}
    </Fragment>
  );
};

export default Workspace;
