import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Tooltip, Typography, Zoom } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';
import classnames from 'classnames';

// Constants
import { canDeleteCharts, canEditCharts, createDateTimeStamp } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(theme => ({
  button: { minWidth: 40 },
  toolbar: { position: 'absolute', top: '5px', right: '3px', padding: 0, minHeight: 'initial' },
  toolbarNoTitle: { marginTop: theme.spacing(-3) },
  typography: { fontWeight: 'bold', marginTop: theme.spacing(2) },
}));

const ChartToolbar = ({ chartID, dashboard, config, sourceID, removeChart, toggleDialog }) => {
  const { role } = dashboard;
  const { title } = config;
  const { button, toolbar, toolbarNoTitle, typography } = useStyles();

  return (
    <Fragment>
      <Typography className={typography} align='center'>
        {title}
      </Typography>
      <Typography
        className={typography}
        style={{ margin: '5px 80px 10px 55px', fontSize: '0.875rem', fontWeight: 'normal' }}
      >
        {config.chartDescription}
        <br />
        <small>{createDateTimeStamp()}</small>
      </Typography>
      <Toolbar className={classnames(toolbar, { [toolbarNoTitle]: !title })}>
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
