import React from 'react';
import { Tooltip as MUItooltip, withStyles } from '@material-ui/core';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: '500px',
    background: theme.palette.primary.main,
  },
}))(MUItooltip);

function Tooltip({ title, children }) {
  return (
    <CustomTooltip arrow interactive placement='top' title={title} enterDelay={500}>
      {children}
    </CustomTooltip>
  );
}

export default Tooltip;
