import React, { useState, useRef } from 'react';

import { Grid, Typography } from '@material-ui/core';
import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import DragHandleIcon from '@material-ui/icons/DragHandle';

// React Components
import ToolbarSubMenu from './ToolbarSubMenu';
import CustomTooltip from '../Common/Tooltip';

// Utils
import { canEditCharts } from '../../utils/misc';
import useTooltipHover from '../../hooks/useTooltipHover';

const useStyles = makeStyles(theme => ({
  centerSvg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ChartToolbar = props => {
  const { chart, dashboard, lastModifiedDate, pdfPreview } = props;
  const { configuration, sourceType } = chart;
  const { permission } = dashboard;
  const { chartDescription = '', isStatic, showLastExecuted, size = 12, title = '', type } = configuration;
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();

  const titleRef = useRef();
  const descriptionRef = useRef();

  const titleHoverStatus = useTooltipHover(titleRef);
  const descriptionoverStatus = useTooltipHover(descriptionRef);

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const datetimeStamp = `${sourceType === 'file' ? 'Last Modified:' : 'Last Executed:'} ${
    lastModifiedDate || ''
  }`;

  return (
    <>
      <Grid container justify='space-between' alignItems='center' wrap='nowrap'>
        <Grid item className={classes.centerSvg}>
          <DragHandleIcon className='dragElement' style={{ cursor: 'pointer' }} />
        </Grid>
        <Grid item xs={10}>
          <CustomTooltip title={title} disableHoverListener={titleHoverStatus}>
            <Typography ref={titleRef} variant='h6' component='h1' align='center' noWrap>
              {title}
            </Typography>
          </CustomTooltip>
        </Grid>
        <Grid item className={classes.centerSvg}>
          {canEditCharts(permission) && !pdfPreview && (
            <MoreHorizIcon style={{ cursor: 'pointer' }} onClick={showMenu} />
          )}
          <ToolbarSubMenu {...props} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </Grid>
      </Grid>
      <CustomTooltip title={chartDescription} disableHoverListener={descriptionoverStatus}>
        <Typography ref={descriptionRef} variant='body1' component='p' noWrap>
          {chartDescription}
        </Typography>
      </CustomTooltip>
      <Typography variant='caption' component='small'>
        {!isStatic && showLastExecuted && datetimeStamp}
      </Typography>
    </>
  );
};

export default ChartToolbar;
