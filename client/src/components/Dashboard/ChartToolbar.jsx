import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import classnames from 'classnames';

// React Components
import ToolbarSubMenu from './ToolbarSubMenu';

// Redux Actions
import { updateChart } from '../../features/chart/actions';

// Utils
import { canEditCharts, createDateTimeStamp } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  description: { fontSize: '0.875rem', fontWeight: 'normal', margin: theme.spacing(1.5, 0, 1, 1) },
  ellipseBtnXs: { margin: '0 40%', marginTop: theme.spacing(1) },
  ellipseBtnMd: { margin: '0 50%', marginTop: theme.spacing(1) },
  ellipseBtnLg: { margin: '0 70%', marginTop: theme.spacing(1) },
  tableDesc: { marginLeft: theme.spacing(1.5) },
  typography: { fontSize: '1.15rem', fontWeight: 'bold', marginTop: theme.spacing(2) },
}));

const ChartToolbar = props => {
  const { chart, dashboard, datetimeStamp } = props;
  const { config, sourceType } = chart;
  const { role } = dashboard;
  const { chartDescription = '', size = 12, title = '', type } = config;
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { description, ellipseBtnLg, ellipseBtnMd, ellipseBtnXs, tableDesc, typography } = useStyles();

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const updateChartWidth = async event => {
    const { value } = event.target;
    const newChartObj = { ...chart };
    const { sourceID, sourceType } = newChartObj;
    let action;

    // Update size in chart config
    newChartObj.config.size = value;

    try {
      action = await updateChart(newChartObj, dashboard.id, sourceID, sourceType);
    } catch (error) {
      return console.error(error);
    }

    dispatch(action);
  };

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={1}></Grid>
        <Grid item xs={size > 4 ? 10 : 9}>
          <Typography className={typography} align='center'>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={size > 4 ? 1 : 2}>
          {canEditCharts(role) && (
            <Fragment>
              <MoreHorizIcon
                className={classnames(ellipseBtnXs, { [ellipseBtnMd]: size >= 4, [ellipseBtnLg]: size >= 9 })}
                onClick={showMenu}
              />
              <ToolbarSubMenu
                {...props}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                updateChartWidth={updateChartWidth}
              />
            </Fragment>
          )}
        </Grid>
      </Grid>

      <Typography className={classnames(description, { [tableDesc]: type === 'table' })}>
        {/*
          Conditionally render the chart description and <br /> only if a description is provided
          Always render the datetime stamp
        */}
        {chartDescription !== '' ? chartDescription : null}
        {chartDescription !== '' ? <br /> : null}
        <small>{createDateTimeStamp(datetimeStamp, sourceType)}</small>
      </Typography>
    </Fragment>
  );
};

export default ChartToolbar;
