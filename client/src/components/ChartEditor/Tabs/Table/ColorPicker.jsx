import React, { useState } from 'react';
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
  base: {
    margin: 'auto',
    height: '40px',
    width: '40px',
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
    setPickerColor('#ffff'); // reset value to default
    setDisplayColorPicker(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Paper elevation={2} style={{ background: color }} className={classes.base} onClick={handleClick}>
        {displayColorPicker ? (
          <div className={classes.popover}>
            <SketchPicker
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
