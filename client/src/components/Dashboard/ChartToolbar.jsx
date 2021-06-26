import React, { useState, useRef } from 'react';

import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

// React Components
import ToolbarSubMenu from './ToolbarSubMenu';
import CustomTooltip from '../Common/Tooltip';

// Utils
import useTooltipHover from '../../hooks/useTooltipHover';
import { canEditCharts } from '../../utils/misc';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  centerSvg: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ChartToolbar = props => {
  const classes = useStyles();
  const { chart, lastModifiedDate, pdfPreview } = props;
  const { configuration, sourceType } = chart;
  const { chartDescription = '', isStatic, showLastExecuted, title = '' } = configuration;

  const permission = useSelector(state => state.dashboard.dashboard.permission);

  const [anchorEl, setAnchorEl] = useState(null);

  const descriptionRef = useRef();
  const titleRef = useRef();

  const descriptionoverStatus = useTooltipHover(descriptionRef);
  const titleHoverStatus = useTooltipHover(titleRef);

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
          {canEditCharts(permission) && (
            <DragHandleIcon className='dragElement' style={{ cursor: 'pointer' }} />
          )}
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
