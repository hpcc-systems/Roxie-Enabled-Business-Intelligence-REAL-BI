import React, { useState } from 'react';

import { Grid, Typography } from '@material-ui/core';
import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import DragHandleIcon from '@material-ui/icons/DragHandle';

// React Components
import ToolbarSubMenu from './ToolbarSubMenu';

// Utils
import { canEditCharts } from '../../utils/misc';

const ChartToolbar = props => {
  const { chart, dashboard, lastModifiedDate, pdfPreview } = props;
  const { configuration, sourceType } = chart;
  const { permission } = dashboard;
  const { chartDescription = '', isStatic, showLastExecuted, size = 12, title = '', type } = configuration;
  const [anchorEl, setAnchorEl] = useState(null);

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const datetimeStamp = `${sourceType === 'file' ? 'Last Modified:' : 'Last Executed:'} ${lastModifiedDate}`;

  return (
    <>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item>
          <DragHandleIcon className='dragElement' style={{ cursor: 'pointer' }} />
        </Grid>
        <Grid item>
          <Typography variant='h6' component='h1' align='center'>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          {canEditCharts(permission) && !pdfPreview && (
            <MoreHorizIcon style={{ cursor: 'pointer' }} onClick={showMenu} />
          )}
          <ToolbarSubMenu {...props} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </Grid>
      </Grid>

      <Typography variant='body1' component='p'>
        {chartDescription}
      </Typography>

      <Typography variant='body1' component='p'>
        {!isStatic && showLastExecuted && <small>{datetimeStamp}</small>}
      </Typography>
    </>
  );
};

export default ChartToolbar;
