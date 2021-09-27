import React from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';

import { getMessage } from '../../../utils/misc';
import { messages } from '../../../constants';

import MarkerIconPicker from '../MarkerIconPicker';
import ClearIcon from '@material-ui/icons/Clear';
import Remove from '@material-ui/icons/Remove';

import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const useStyles = makeStyles(() => ({
  cancelSetting: {
    cursor: 'pointer',
  },
  submitButton: {},
}));

const MapParams = props => {
  const { eclRef, localState } = props;
  const { schema = [] } = eclRef.current;
  const { chartID, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const mapMarkers = props.localState.configuration.mapMarkers;

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  if (chartID && messages.indexOf(fieldsArr[0].name) > -1) return null;

  return (
    <Grid item xs={12}>
      <Box pt={1}>
        {mapMarkers.map(marker => (
          <MarkerSetting key={marker.id || uuidv4()} marker={marker} fieldsArr={fieldsArr} {...props} />
        ))}
      </Box>
    </Grid>
  );
};

const MarkerSetting = props => {
  const { marker, handleChangeObj, fieldsArr } = props;
  const mapMarkers = props.localState.configuration.mapMarkers;

  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [latitude, setLatitude] = React.useState(marker.latitude);
  const [longitude, setLongitude] = React.useState(marker.longitude);
  const [markerIcon, setMarketIcon] = React.useState(marker.markerIcon);
  const [markerColor, setMarkerColor] = React.useState(marker.markerColor);
  const [popUpInfoArray, setPopUpInfoArray] = React.useState(marker.popUpInfo);

  const handleRemovePopup = popUpField => {
    const filtered = popUpInfoArray.filter(el => el.id !== popUpField.id);
    setPopUpInfoArray(filtered);
  };

  const handlePopUpArrayChange = (event, index) => {
    const { name, value } = event.target;
    const newPopUpInfoArray = [...popUpInfoArray];
    const newPopUp = { ...newPopUpInfoArray[index] };
    if (!newPopUp.id) newPopUp.id = uuidv4();

    newPopUpInfoArray[index] = { ...newPopUp, [name]: value };

    // Add new object to end of array for next entry
    if (newPopUpInfoArray.length - 1 === index) {
      newPopUpInfoArray.push({ id: null, label: '', datafieldName: '' });
    }
    setPopUpInfoArray(newPopUpInfoArray);
  };

  const handeRemoveMarker = (event, marker) => {
    event.preventDefault();
    const filtered = mapMarkers.filter(el => el.id !== marker.id);
    handleChangeObj(null, { name: 'configuration:mapMarkers', value: filtered });
    enqueueSnackbar('Marker has been removed', {
      variant: 'info',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });
  };

  const handleSaveSetting = event => {
    event.preventDefault();
    const newMarker = {
      id: marker.id || uuidv4(),
      popUpInfo: popUpInfoArray,
      latitude,
      longitude,
      markerIcon,
      markerColor,
    };
    const existingMarkerIndex = mapMarkers.findIndex(el => el.id === newMarker.id);
    enqueueSnackbar(`${existingMarkerIndex > -1 ? 'Marker has been updated' : 'New marker created'}`, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    });
    if (existingMarkerIndex > -1) {
      mapMarkers[existingMarkerIndex] = newMarker;
      return handleChangeObj(null, { name: 'configuration:mapMarkers', value: [...mapMarkers] });
    }
    handleChangeObj(null, { name: 'configuration:mapMarkers', value: [...mapMarkers, newMarker] });
  };

  const isParamsChanged = () => {
    return !_.isEqual(marker, {
      id: marker.id,
      popUpInfo: popUpInfoArray,
      latitude,
      longitude,
      markerIcon,
      markerColor,
    });
  };

  const disableButton = () => {
    const basicMarkerSettingsCheck =
      latitude.length === 0 || longitude.length === 0 || markerIcon.length === 0;

    const popUp = popUpInfoArray.length > 1 ? popUpInfoArray[popUpInfoArray.length - 2] : null;
    if (popUp) {
      const oneOfPopUpFieldsEmpty =
        (popUp.label.length === 0 && popUp.datafieldName.length > 0) ||
        (popUp.label.length > 0 && popUp.datafieldName.length === 0);
      return basicMarkerSettingsCheck || oneOfPopUpFieldsEmpty;
    }
    return basicMarkerSettingsCheck;
  };

  return (
    <Box component={Paper} elevation={3} p={2} my={1} width='100%'>
      <Box display='flex' justifyContent='space-between'>
        <Typography variant='subtitle2' component='h1'>
          {marker.id
            ? 'Marker settings:'
            : `Create new Marker: You currently have ${mapMarkers.length - 1} active ${
                mapMarkers.length - 1 == 1 ? 'marker' : 'markers'
              } `}
        </Typography>
        {marker.id && (
          <ClearIcon className={classes.cancelSetting} onClick={e => handeRemoveMarker(e, marker)} />
        )}
      </Box>
      {/* First row */}
      <Grid container alignItems='flex-end' spacing={2}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Latitude</InputLabel>
            <Select value={latitude} onChange={event => setLatitude(event.target.value)}>
              {fieldsArr.map(({ name }, index) => {
                return (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Longitude</InputLabel>
            <Select value={longitude} onChange={event => setLongitude(event.target.value)}>
              {fieldsArr.map(({ name }, index) => {
                return (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={5}>
          <MarkerIconPicker
            markerColor={markerColor}
            setMarkerColor={setMarkerColor}
            markerIcon={markerIcon}
            setMarketIcon={setMarketIcon}
          />
        </Grid>
      </Grid>
      {/* End First row */}
      {/* Second row */}
      <Box my={2}>
        <Typography variant='subtitle2' component='h1'>
          Marker pop up information:
        </Typography>
        {popUpInfoArray.map((popUpField, index) => {
          return (
            <Grid key={index} container spacing={2} alignItems='flex-end'>
              <Grid item xs={11} sm={5}>
                <TextField
                  required={popUpInfoArray[index].datafieldName !== ''}
                  fullWidth
                  label='Popup field name'
                  name='label'
                  value={popUpInfoArray[index].label}
                  onChange={event => handlePopUpArrayChange(event, index)}
                  autoComplete='off'
                />
              </Grid>
              <Grid item xs={11} sm={5}>
                <FormControl required={popUpInfoArray[index].label !== ''} fullWidth>
                  <InputLabel>Select corresponding field</InputLabel>
                  <Select
                    name='datafieldName'
                    value={popUpInfoArray[index].datafieldName}
                    onChange={event => handlePopUpArrayChange(event, index)}
                  >
                    {fieldsArr.map(({ name }, index) => {
                      return (
                        <MenuItem key={index} value={name}>
                          {name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {popUpInfoArray.length - 1 !== index && (
                <Grid item xs={1}>
                  <Remove className={classes.cancelSetting} onClick={() => handleRemovePopup(popUpField)} />
                </Grid>
              )}
            </Grid>
          );
        })}
      </Box>
      <Box m={2} display='flex' justifyContent='flex-end'>
        {marker.id && isParamsChanged() && (
          <Button disabled={disableButton()} className={classes.submitButton} onClick={handleSaveSetting}>
            Edit Marker
          </Button>
        )}
        {!marker.id && (
          <Button disabled={disableButton()} className={classes.submitButton} onClick={handleSaveSetting}>
            Create New Marker
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MapParams;
