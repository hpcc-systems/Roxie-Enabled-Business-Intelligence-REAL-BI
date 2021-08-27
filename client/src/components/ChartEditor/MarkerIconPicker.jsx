import React from 'react';

import RoomIcon from '@material-ui/icons/Room';
import ApartmentOutlinedIcon from '@material-ui/icons/ApartmentOutlined';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import NotListedLocationOutlinedIcon from '@material-ui/icons/NotListedLocationOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import { SketchPicker } from 'react-color';

import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles(() => ({
  popover: {
    position: 'absolute',
    zIndex: '2',
    top: '0',
    right: '60px',
    transform: 'translateY(-40%)',
  },
  base: props => ({
    background: props.markerColor,
    marginLeft: '10px',
    height: '40px',
    width: '40px',
    cursor: 'pointer',
    position: 'relative',
  }),
}));

function MarkerIconPicker(props) {
  const { markerColor, setMarkerColor, markerIcon, setMarketIcon } = props;
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

  const classes = useStyles({ markerColor });

  const handlePalletOpen = () => {
    setDisplayColorPicker(true);
  };

  const handlePalletClose = () => {
    setDisplayColorPicker(false);
  };

  const handleMarkerChange = event => {
    setMarketIcon(event.target.value);
  };

  return (
    <>
      <Box display='flex' alignItems='flex-end'>
        <FormControl style={{ flexGrow: 1 }}>
          <InputLabel>Choose an icon </InputLabel>
          <Select required value={markerIcon} autoWidth onChange={handleMarkerChange}>
            <MenuItem value='RoomIcon'>
              <RoomIcon />
            </MenuItem>
            <MenuItem value='ApartmentOutlinedIcon'>
              <ApartmentOutlinedIcon />
            </MenuItem>
            <MenuItem value='AccountBalanceIcon'>
              <AccountBalanceIcon />
            </MenuItem>
            <MenuItem value='FlagOutlinedIcon'>
              <FlagOutlinedIcon />
            </MenuItem>
            <MenuItem value='LocalTaxiIcon'>
              <LocalTaxiIcon />
            </MenuItem>
            <MenuItem value='EmojiPeopleIcon'>
              <EmojiPeopleIcon />
            </MenuItem>
            <MenuItem value='CheckCircleOutlineOutlinedIcon'>
              <CheckCircleOutlineOutlinedIcon />
            </MenuItem>
            <MenuItem value='NotListedLocationOutlinedIcon'>
              <NotListedLocationOutlinedIcon />
            </MenuItem>
          </Select>
        </FormControl>

        <ClickAwayListener onClickAway={handlePalletClose}>
          <Paper elevation={2} className={classes.base} onClick={handlePalletOpen}>
            {displayColorPicker ? (
              <Paper elevation={2} className={classes.popover}>
                <SketchPicker
                  color={markerColor}
                  onChange={color => setMarkerColor(color.hex)}
                  onChangeComplete={color => setMarkerColor(color.hex)}
                />
              </Paper>
            ) : null}
          </Paper>
        </ClickAwayListener>
      </Box>
    </>
  );
}

export default MarkerIconPicker;
