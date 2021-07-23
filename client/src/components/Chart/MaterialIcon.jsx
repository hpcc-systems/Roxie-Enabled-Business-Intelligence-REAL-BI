import React from 'react';

import RoomIcon from '@material-ui/icons/Room';
import ApartmentOutlinedIcon from '@material-ui/icons/ApartmentOutlined';
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import NotListedLocationOutlinedIcon from '@material-ui/icons/NotListedLocationOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import { makeStyles } from '@material-ui/core/styles';
import { getConstrastTextColor } from '../../utils/misc';

const useStyles = makeStyles(theme => ({
  iconColor: props => ({
    color: props.iconColor,
  }),
}));

const MaterialIcon = ({ icon, color }) => {
  let iconColor = getConstrastTextColor(color);
  const classes = useStyles({ iconColor });

  switch (icon) {
    case 'RoomIcon':
      return <RoomIcon className={classes.iconColor} />;
    case 'ApartmentOutlinedIcon':
      return <ApartmentOutlinedIcon className={classes.iconColor} />;
    case 'FlagOutlinedIcon':
      return <FlagOutlinedIcon className={classes.iconColor} />;
    case 'NotListedLocationOutlinedIcon':
      return <NotListedLocationOutlinedIcon className={classes.iconColor} />;
    case 'CheckCircleOutlineOutlinedIcon':
      return <CheckCircleOutlineOutlinedIcon className={classes.iconColor} />;
    case 'AccountBalanceIcon':
      return <AccountBalanceIcon className={classes.iconColor} />;
    case 'LocalTaxiIcon':
      return <LocalTaxiIcon className={classes.iconColor} />;
    case 'EmojiPeopleIcon':
      return <EmojiPeopleIcon className={classes.iconColor} />;
    default:
      return null;
  }
};
export default MaterialIcon;
