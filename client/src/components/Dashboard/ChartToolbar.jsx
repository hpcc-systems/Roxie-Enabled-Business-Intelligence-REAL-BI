import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';

// Constants
import { canDeleteCharts, canEditCharts } from '../../utils/misc';

// Create styles
const useStyles = makeStyles({
  button: { minWidth: 40 },
  toolbar: { padding: 0 },
  typography: { flexGrow: 1, textAlign: 'center' },
});

const ChartToolbar = ({ chartID, dashboard, options, queryID, removeChart, toggleDialog }) => {
  const { role } = dashboard;
  const { title } = options;
  const { button, toolbar, typography } = useStyles();

  return (
    <Toolbar className={toolbar}>
      {canDeleteCharts(role) ? (
        <Button className={button} onClick={() => removeChart(chartID, queryID)}>
          <CloseIcon />
        </Button>
      ) : null}
      <Typography className={typography}>{title}</Typography>
      {canEditCharts(role) ? (
        <Button className={button}>
          <EditIcon onClick={() => toggleDialog(chartID)} />
        </Button>
      ) : null}
    </Toolbar>
  );
};

export default ChartToolbar;
