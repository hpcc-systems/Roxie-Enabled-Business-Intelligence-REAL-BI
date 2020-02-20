import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon, Refresh as RefreshIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles({
  button: { minWidth: 40 },
  div: { flex: 1 },
  toolbar: { padding: 0 },
});

const ChartToolbar = ({ chartID, query, refreshChart, removeChart, toggleDialog }) => {
  const { button, div, toolbar } = useStyles();

  return (
    <Toolbar className={toolbar}>
      <div className={div}>
        <Button className={button} onClick={() => removeChart(chartID)}>
          <CloseIcon />
        </Button>
      </div>
      <Button className={button}>
        <RefreshIcon onClick={() => refreshChart(chartID, query)} />
      </Button>
      <Button className={button}>
        <EditIcon onClick={() => toggleDialog(chartID)} />
      </Button>
    </Toolbar>
  );
};

export default ChartToolbar;
