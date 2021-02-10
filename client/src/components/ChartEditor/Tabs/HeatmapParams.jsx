import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@material-ui/core';
import { getMessage } from '../../../utils/misc';
import { messages } from '../../../constants';
import ConfigOptions from '../AxisConfig/ConfigOptions';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

const HeatmapParams = props => {
  const {
    eclRef: {
      current: { schema = [] },
    },
    handleChangeObj,
    localState: { chartID, configuration, selectedDataset: { fields = [] } = {}, sourceType },
  } = props;
  const { formControl, progress } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <ConfigOptions
          {...props}
          field='axis1'
          label='X Axis'
          showAxisLabelOption={false}
          showLabelOption={false}
        />
      </Grid>
      <Grid container spacing={2}>
        <ConfigOptions
          {...props}
          field='axis2'
          label='Y Axis'
          showAxisLabelOption={false}
          showLabelOption={false}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tooltip
            title='The field used to determine the density of a given point on the X and Y axes.'
            placement='right'
          >
            <FormControl className={formControl} fullWidth>
              <InputLabel>Density Field</InputLabel>
              {chartID && messages.indexOf(fieldsArr[0].name) > -1 ? (
                <CircularProgress className={progress} size={20} />
              ) : (
                <Select
                  name='configuration:colorField'
                  value={configuration.colorField || ''}
                  onChange={handleChangeObj}
                >
                  {fieldsArr.map(({ name, value = name }, index) => {
                    return (
                      <MenuItem key={index} value={value}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </FormControl>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HeatmapParams;
