import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles({
  button: { minWidth: 40 },
  div: { flex: 1 },
  toolbar: { padding: 0 },
  typography: { flexGrow: 1 },
});

const ChartToolbar = ({ chartID, options, removeChart, toggleDialog }) => {
  const { title } = options;
  const { button, div, toolbar, typography } = useStyles();

  return (
    <Toolbar className={toolbar}>
      <div className={div}>
        <Button className={button} onClick={() => removeChart(chartID)}>
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
