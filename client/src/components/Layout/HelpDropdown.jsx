import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core';
import { ArrowDropDown, Help, MenuBook } from '@material-ui/icons';

const HelpDropDown = ({ anchorRef, handleClose, handleToggle, open, useStyles }) => {
  const { button, buttonIcon, buttonLabel, menuIcon, menuItem, menuLabel } = useStyles();

  return (
    <Fragment>
      <IconButton className={button} color='inherit' onClick={() => handleToggle(1)} ref={anchorRef}>
        <Help className={buttonIcon} />
        <Typography variant='body1' color='inherit' className={buttonLabel}>
          Help
        </Typography>
        <ArrowDropDown />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={event => handleClose(event, 1)}>
                <MenuList autoFocusItem={open} id='helpMenu'>
                  <MenuItem className={menuItem} onClick={event => handleClose(event, 1)}>
                    <Link to={'/docs/User_Guide.pdf'} target='_blank'>
                      <ListItemIcon className={menuIcon}>
                        <MenuBook />
                      </ListItemIcon>
                      <Typography color='inherit' className={menuLabel}>
                        User Guide
                      </Typography>
                    </Link>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};

export default HelpDropDown;
