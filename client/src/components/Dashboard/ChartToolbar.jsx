import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';

// Constants
import { canDeleteCharts, canEditCharts } from '../../utils/misc';

// Create styles
const useStyles = makeStyles(() => ({
  button: { minWidth: 40 },
  toolbar: { padding: 0 },
  typography: { flexGrow: 1, fontWeight: 'bold' },
}));

const ChartToolbar = ({ chartID, dashboard, options, sourceID, removeChart, toggleDialog }) => {
  const { role } = dashboard;
  const { title } = options;
  const { button, toolbar, typography } = useStyles();

  return (
    <Toolbar className={toolbar}>
      {canEditCharts(role) && (
        <Button className={button}>
          <EditIcon onClick={() => toggleDialog(chartID)} />
        </Button>
      )}
      <Typography className={typography} align='center'>
        {title}
      </Typography>
      {canDeleteCharts(role) && (
        <Button className={button} onClick={() => removeChart(chartID, sourceID)}>
          <CloseIcon />
        </Button>
      )}
    </Toolbar>
  );
};

export default ChartToolbar;
