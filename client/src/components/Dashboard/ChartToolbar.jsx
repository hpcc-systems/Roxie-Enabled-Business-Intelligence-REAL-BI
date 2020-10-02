import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Tooltip, Typography, Zoom } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';
import classnames from 'classnames';

// Utils
import { canDeleteCharts, canEditCharts, createDateTimeStamp } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { minWidth: 40 },
  description: { fontSize: '0.875rem', fontWeight: 'normal', margin: theme.spacing(1.5, 10, 1, 6.5) },
  tableDesc: { marginLeft: theme.spacing(1.5) },
  toolbar: { position: 'absolute', top: '5px', right: '3px', padding: 0, minHeight: 'initial' },
  toolbarNoTitle: { marginTop: theme.spacing(0) },
  typography: { fontSize: '1.15rem', fontWeight: 'bold', marginTop: theme.spacing(2) },
}));

const ChartToolbar = ({ chartID, dashboard, config, sourceID, removeChart, toggleDialog }) => {
  const { role } = dashboard;
  const { chartDescription = '', title = '', type } = config;
  const { button, description, tableDesc, toolbar, toolbarNoTitle, typography } = useStyles();

  return (
    <Fragment>
      <Typography className={typography} align='center'>
        {title}
      </Typography>
      <Typography className={classnames(description, { [tableDesc]: type === 'table' })}>
        {/*
          Conditionally render the chart description and <br /> only if a description is provided
          Always render the datetime stamp
        */}
        {chartDescription !== '' ? chartDescription : null}
        {chartDescription !== '' ? <br /> : null}
        <small>{createDateTimeStamp()}</small>
      </Typography>
      <Toolbar className={classnames(toolbar, { [toolbarNoTitle]: title === '' })}>
        {canEditCharts(role) && (
          <Tooltip title='Edit Chart' TransitionComponent={Zoom} arrow placement='top'>
            <Button className={button}>
              <EditIcon onClick={() => toggleDialog(chartID)} />
            </Button>
          </Tooltip>
        )}
        {canDeleteCharts(role) && (
          <Tooltip title='Delete Chart' TransitionComponent={Zoom} arrow placement='top'>
            <Button className={button} onClick={() => removeChart(chartID, sourceID)}>
              <CloseIcon />
            </Button>
          </Tooltip>
        )}
      </Toolbar>
    </Fragment>
  );
};

export default ChartToolbar;
