import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import clsx from 'clsx';

// React Components
import ToolbarSubMenu from './ToolbarSubMenu';

// Redux Actions
import { updateChart } from '../../features/dashboard/actions';

// Utils
import { canEditCharts } from '../../utils/misc';

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
  const { chart, dashboard, lastModifiedDate, pdfPreview } = props;
  const { configuration, sourceType } = chart;
  const { permission } = dashboard;
  const { chartDescription = '', isStatic, showLastExecuted, size = 12, title = '', type } = configuration;
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { description, ellipseBtnLg, ellipseBtnMd, ellipseBtnXs, tableDesc, typography } = useStyles();

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const updateChartWidth = async event => {
    const { value } = event.target;
    const newChartObj = { ...chart };

    // Update size in chart configuration
    newChartObj.configuration.size = value;

    try {
      const action = await updateChart(newChartObj, dashboard.id);
      dispatch(action);
    } catch (error) {
      dispatch(error);
    }
  };

  const datetimeStamp = `${sourceType === 'file' ? 'Last Modified:' : 'Last Executed:'} ${lastModifiedDate}`;

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
          {canEditCharts(permission) && !pdfPreview && (
            <Fragment>
              <MoreHorizIcon
                className={clsx(ellipseBtnXs, { [ellipseBtnMd]: size >= 4, [ellipseBtnLg]: size >= 9 })}
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

      <Typography className={clsx(description, { [tableDesc]: type === 'table' })}>
        {chartDescription}
        <br />
        {!isStatic && showLastExecuted && <small>{datetimeStamp}</small>}
      </Typography>
    </Fragment>
  );
};

export default ChartToolbar;
