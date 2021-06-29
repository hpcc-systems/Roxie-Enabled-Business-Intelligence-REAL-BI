import React, { useState } from 'react';
import { ChromePicker } from 'react-color';

import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles(() => ({
  popover: {
    position: 'absolute',
    zIndex: '2',
    top: '0',
    right: '0',
    transform: 'translateY(-100%)',
  },
  base: {
    height: '40px',
    cursor: 'pointer',
    position: 'relative',
  },
}));

function ColorPicker({ color, updateField, index }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [pickerColor, setPickerColor] = useState(color);

  const classes = useStyles();

  const handleClick = () => {
    setDisplayColorPicker(true);
  };
  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Paper elevation={2} style={{ background: pickerColor }} className={classes.base} onClick={handleClick}>
        {displayColorPicker ? (
          <div className={classes.popover}>
            <ChromePicker
              color={pickerColor}
              onChange={color => setPickerColor(color.hex)}
              onChangeComplete={color => updateField({ target: { name: 'color', value: color.hex } }, index)}
            />
          </div>
        ) : null}
      </Paper>
    </ClickAwayListener>
  );
}

export default ColorPicker;
