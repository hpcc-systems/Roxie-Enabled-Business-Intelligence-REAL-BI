import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Grid,
  Paper,
  ClickAwayListener,
  Typography,
} from '@material-ui/core';
import { SketchPicker } from 'react-color';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  popover: {
    position: 'absolute',
    zIndex: '2',
    top: '0',
    left: '60px',
    transform: 'translateY(-50%)',
  },
  base: props => ({
    background: props.strokeColor,
    marginLeft: '10px',
    height: '40px',
    width: '40px',
    cursor: 'pointer',
    position: 'relative',
  }),
}));

function GraphConfiguration(props) {
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

  const graphChart = props.localState.configuration.graphChart;
  const chartConfig = graphChart.config;

  const classes = useStyles({ strokeColor: chartConfig.strokeColor });

  const configuration = props.localState.configuration;
  const datasetFields = props.localState.selectedDataset.fields;
  const formFieldsUpdate = props.formFieldsUpdate;
  const isStatic = configuration.isStatic;

  const handleChange = e => {
    const fieldName = e.target.name;
    const newConfig = { ...chartConfig, [fieldName]: e.target.value };
    formFieldsUpdate({
      configuration: { ...configuration, graphChart: { ...graphChart, config: newConfig } },
    });
  };

  const handleStrokeColorChange = color => {
    const newConfig = { ...chartConfig, strokeColor: color };
    formFieldsUpdate({
      configuration: { ...configuration, graphChart: { ...graphChart, config: newConfig } },
    });
  };

  const dataFields = [
    { name: 'nodesField', label: 'Select Nodes Field' },
    { name: 'edgesField', label: 'Select Edges Field' },
  ];

  return (
    <Box p={2} my={1} component={Paper}>
      <Grid container spacing={2} alignItems='flex-end'>
        {!isStatic &&
          dataFields.map(({ name, label }) => (
            <Grid key={name} item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='select-label'>{label}</InputLabel>
                <Select
                  name={name}
                  required
                  value={datasetFields ? chartConfig[name] : ''}
                  onChange={handleChange}
                  labelId='select-label'
                >
                  {datasetFields ? (
                    datasetFields.map((field, index) => (
                      <MenuItem key={index} value={field.name}>
                        {field.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value=''>No Dataset Fields Found</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          ))}

        {/* <Grid item xs={6}>
          <FormControl fullWidth>
            // TODO FIGURE OUT HOW TO UPDATE LAYOUT DYNAMICALLY SO APP WILL NOT CRUSH
          <InputLabel id='select-label'>Choose Layout orientation</InputLabel>
            <Select
              name='rankdir'
              required
              disabled={isStatic ? graphChart.nodes.length === 0 : !chartConfig.nodesField}
              value={chartConfig.rankdir || ''}
              onChange={handleChange}
              labelId='select-label'
            >
              <MenuItem value='LR'>Left To Right</MenuItem>
              <MenuItem value='RL'>Right To Left</MenuItem>
              <MenuItem value='TB'>Top To Bottom</MenuItem>
              <MenuItem value='BT'>Bottom To Top</MenuItem>
            </Select> 
          </FormControl>
        </Grid>*/}
        <Grid item xs={12} container alignItems='flex-end' spacing={2}>
          <Grid item>
            <Typography variant='body2'>Choose Stroke Color: </Typography>
          </Grid>
          <Grid item>
            <ClickAwayListener onClickAway={() => setDisplayColorPicker(false)}>
              <Paper elevation={2} className={classes.base} onClick={() => setDisplayColorPicker(true)}>
                {displayColorPicker ? (
                  <Paper elevation={3} className={classes.popover}>
                    <SketchPicker
                      color={chartConfig.strokeColo}
                      onChange={color => handleStrokeColorChange(color.hex)}
                      onChangeComplete={color => handleStrokeColorChange(color.hex)}
                    />
                  </Paper>
                ) : null}
              </Paper>
            </ClickAwayListener>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GraphConfiguration;
