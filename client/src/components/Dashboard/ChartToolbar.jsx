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
import debounce from 'lodash/debounce';

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
  const [isDescriptionFits, setIsDescriptionFits] = useState(true);
  const [isTitleFits, setIsTitleFits] = useState(true);

  const descriptionRef = useRef();
  const titleRef = useRef();

  React.useEffect(() => {
    let active = true; //prevents updating state on unmounted component
    const handleTooltip = debounce(elements => {
      const [title, description] = elements;
      if (title?.target?.scrollWidth > title?.target?.offsetWidth) {
        active && setIsTitleFits(false);
      } else {
        active && setIsTitleFits(true);
      }

      if (description?.target?.scrollWidth > description?.target?.offsetWidth) {
        active && setIsDescriptionFits(false);
      } else {
        active && setIsDescriptionFits(true);
      }
    }, 1000);

    const resizer = new ResizeObserver(handleTooltip);
    resizer.observe(titleRef.current);
    resizer.observe(descriptionRef.current);

    return () => {
      active = false;
      resizer.disconnect();
    };
  }, [configuration]);

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
        {!isTitleFits && (
          <Typography variant='subtitle1' align='center' component='p'>
            {title}
          </Typography>
        )}
        {!isDescriptionFits && (
          <Typography variant='body2' component='p'>
            {chartDescription}
          </Typography>
        )}
      </>
    );
  };

  const disableTooltip = isStatic && isTitleFits && isDescriptionFits;

  return (
    <>
      <CustomTooltip disableHoverListener={disableTooltip} title={<TooltipText />}>
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
            {canEditCharts(permission) && <MoreHorizIcon style={{ cursor: 'pointer' }} onClick={showMenu} />}
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
