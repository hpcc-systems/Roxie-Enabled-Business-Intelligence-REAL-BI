import React from 'react';
import { Tooltip as MUItooltip, withStyles } from '@material-ui/core';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: '500px',
    background: theme.palette.primary.main,
  },
}))(MUItooltip);

function Tooltip({ title, disableHoverListener = false, children }) {
  return (
    <CustomTooltip
      arrow
      placement='top'
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
}

export default Tooltip;
