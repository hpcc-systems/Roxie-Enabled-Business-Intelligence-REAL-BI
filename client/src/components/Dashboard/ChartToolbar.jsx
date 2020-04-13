import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles({
  button: { minWidth: 40 },
  toolbar: { padding: 0 },
  typography: { flexGrow: 1, textAlign: 'center' },
});

const ChartToolbar = ({ chartID, options, queryID, removeChart, toggleDialog }) => {
  const { title } = options;
  const { button, toolbar, typography } = useStyles();

  return (
    <Toolbar className={toolbar}>
      <div>
        <Button className={button} onClick={() => removeChart(chartID, queryID)}>
          <CloseIcon />
        </Button>
      </div>
      <Typography className={typography}>{title}</Typography>
      <Button className={button}>
        <EditIcon onClick={() => toggleDialog(chartID)} />
      </Button>
    </Toolbar>
  );
};

export default ChartToolbar;
