import React, { useState, useRef } from 'react';

import { MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Box } from '@material-ui/core';

// React Components
import ToolbarSubMenu from './ToolbarSubMenu';
import CustomTooltip from '../Common/Tooltip';

// Utils
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
  const { configuration, source, sourceType, lastModifiedDate } = props.chart;
  const { chartDescription = '', isStatic, showLastExecuted, title = '' } = configuration;

  const { permission, fileName } = useSelector(state => state.dashboard.dashboard);

  const [anchorEl, setAnchorEl] = useState(null);

  const descriptionRef = useRef();
  const titleRef = useRef();

  const showMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const datetimeStamp = `${sourceType === 'file' ? 'Last Modified:' : 'Last Executed:'} ${
    lastModifiedDate || ''
  }`;

  const TooltipText = () => {
    return (
      <>
        {source && (
          <Typography variant='caption' component='p' align='center'>
            {source.name} [{source.target}] {fileName === source.name && ' (source: Tombolo)'}
          </Typography>
        )}

        <Typography variant='subtitle1' align='center' component='p'>
          {title}
        </Typography>
      </>
    );
  };

  return (
    <>
      <CustomTooltip title={<TooltipText />}>
        <Grid container justifyContent='space-between' alignItems='center' wrap='nowrap'>
          <Grid item className={classes.centerSvg}>
            {canEditCharts(permission) && (
              <DragHandleIcon className='dragElement' style={{ cursor: 'pointer' }} />
            )}
          </Grid>

          <Grid item xs={10}>
            <Box mx={1}>
              <Typography ref={titleRef} variant='h6' component='h1' align='center' noWrap>
                {title}
              </Typography>
            </Box>
          </Grid>

          <Grid item className={classes.centerSvg}>
            <MoreHorizIcon style={{ cursor: 'pointer' }} onClick={showMenu} />
            <ToolbarSubMenu
              {...props}
              anchorEl={anchorEl}
              permission={permission}
              setAnchorEl={setAnchorEl}
            />
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
