import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar } from '@material-ui/core';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';

// Create styles
const useStyles = makeStyles({
  div: { flex: 1 },
  closeBtn: { width: 16 },
  toolbar: { padding: 0 },
});

const ChartToolbar = ({ chartID, removeChart }) => {
  const { div, closeBtn, toolbar } = useStyles();

  return (
    <Toolbar className={toolbar}>
      <div className={div}>
        <Button className={closeBtn} onClick={() => removeChart(chartID)}>
          <CloseIcon />
        </Button>
      </div>
      <Button>
        <EditIcon />
      </Button>
    </Toolbar>
  );
};

export default ChartToolbar;
