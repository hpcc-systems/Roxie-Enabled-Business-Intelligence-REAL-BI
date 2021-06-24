import React from 'react';
import { Tooltip as MUItooltip, withStyles } from '@material-ui/core';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: '500px',
    fontSize: theme.typography.pxToRem(16),
  },
}))(MUItooltip);

function Tooltip({ title, disableHoverListener, children }) {
  return (
    <CustomTooltip
      title={title}
      interactive
      enterDelay={2000}
      enterNextDelay={1000}
      leaveDelay={1500}
      disableHoverListener={disableHoverListener}
    >
      {children}
    </CustomTooltip>
  );
  s;
}

export default Tooltip;
