/* eslint-disable no-fallthrough */
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
  const { configuration, source, sourceType } = chart;
  const { chartDescription = '', isStatic, showLastExecuted, title = '' } = configuration;

  const { permission, fileName } = useSelector(state => state.dashboard.dashboard);

  const [anchorEl, setAnchorEl] = useState(null);

  const descriptionRef = useRef();
  const titleRef = useRef();

  const isDecriptionFits = useTooltipHover(descriptionRef);
  const isTitleFits = useTooltipHover(titleRef);

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const datetimeStamp = `${sourceType === 'file' ? 'Last Modified:' : 'Last Executed:'} ${
    lastModifiedDate || ''
  }`;

  const TooltipText = () => {
    return (
      <>
        <Typography variant='caption' component='p' align='center'>
          {source.name} [{source.target}] {fileName === source.name && ' (source: Tombolo)'}
        </Typography>
        {!isTitleFits && (
          <Typography variant='subtitle1' component='p'>
            {title}
          </Typography>
        )}
        {!isDecriptionFits && (
          <Typography variant='body2' component='p'>
            {chartDescription}
          </Typography>
        )}
      </>
    );
  };

  return (
    <>
      <CustomTooltip title={<TooltipText />}>
        <Grid container justify='space-between' alignItems='center' wrap='nowrap'>
          <Grid item className={classes.centerSvg}>
            {canEditCharts(permission) && (
              <DragHandleIcon className='dragElement' style={{ cursor: 'pointer' }} />
            )}
          </Grid>

          <Grid item xs={10}>
            <Typography ref={titleRef} variant='h6' component='h1' align='center' noWrap>
              {title}
            </Typography>
          </Grid>

          <Grid item className={classes.centerSvg}>
            {canEditCharts(permission) && !pdfPreview && (
              <MoreHorizIcon style={{ cursor: 'pointer' }} onClick={showMenu} />
            )}
            <ToolbarSubMenu {...props} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
          </Grid>
        </Grid>
      </CustomTooltip>

      <Typography ref={descriptionRef} variant='body1' component='p' noWrap>
        {chartDescription}
      </Typography>

      <Typography variant='caption' component='small'>
        {!isStatic && showLastExecuted && datetimeStamp}
      </Typography>
    </>
  );
};

export default ChartToolbar;
