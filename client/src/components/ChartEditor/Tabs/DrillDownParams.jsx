import React from 'react';
import {
  CircularProgress,
  FormControlLabel,
  FormControl,
  InputLabel,
  Checkbox,
  MenuItem,
  Select,
  Input,
  Paper,
  Grid,
  Box,
  Chip,
} from '@material-ui/core';

function DrillDownParams(props) {
  const { configuration, selectedDataset } = props.localState;
  const { drillDown } = configuration;
  const { formFieldsUpdate } = props;

  const selectDomElement = React.useRef(null);

  const handleDrillDownChange = event => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    configuration.drillDown = { ...drillDown, [name]: value };
    formFieldsUpdate({ configuration });

    if (event.target.name === 'hasDrillDown' && event.target.checked) {
      //Dom element is not mounted yet, delay event and scroll when component is there
      setTimeout(() => {
        selectDomElement.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  const isDrillDownDisabled = !configuration.axis1?.value || !configuration.axis2?.value;

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            name='hasDrillDown'
            disabled={isDrillDownDisabled}
            checked={drillDown.hasDrillDown}
            onChange={handleDrillDownChange}
          />
        }
        label='Add drill down'
      />

      {drillDown.hasDrillDown && (
        <Paper elevation={3}>
          <Box p={2}>
            {selectedDataset.fields ? (
              <Grid container direction='column' spacing={2}>
                <Grid item xs={12}>
                  <FormControl required fullWidth>
                    <InputLabel>Select drill down field</InputLabel>
                    <Select
                      name='drilledByField'
                      value={drillDown.drilledByField}
                      onChange={handleDrillDownChange}
                    >
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      {selectedDataset.fields.map(({ name }, index) => {
                        return (
                          <MenuItem key={index} value={name}>
                            {name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl required fullWidth>
                    <InputLabel>Select data to be shown</InputLabel>
                    <Select
                      name='drilledOptions'
                      multiple
                      ref={selectDomElement}
                      value={drillDown.drilledOptions}
                      onChange={handleDrillDownChange}
                      input={<Input />}
                      renderValue={selected => (
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {selected.map((value, index) => (
                            <Chip key={index} label={value} style={{ margin: 2 }} />
                          ))}
                        </div>
                      )}
                    >
                      {selectedDataset.fields.map(({ name }, index) => (
                        <MenuItem key={index} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            ) : (
              <Box textAlign='center'>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
}

export default DrillDownParams;
