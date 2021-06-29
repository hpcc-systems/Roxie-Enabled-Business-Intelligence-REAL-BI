import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

import ColorPicker from './ColorPicker';

// Utils
import { getConstrastTextColor, getMessage } from '../../../../utils/misc';

// Constants
import { comparisonOperands, messages } from '../../../../constants';

const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  button: {
    margin: theme.spacing(2.5, 0, 0, 1),
    minWidth: 30,
    padding: 0,
  },
  colorDiv: {
    margin: '0 auto',
    marginTop: theme.spacing(1.75),
    width: 30,
    height: 30,
    borderRadius: '50%',
  },
  grid: { marginTop: theme.spacing(3) },
  progress: { margin: 0, marginTop: 50 },
  typography: { marginTop: 20 },
}));

const TableConditionalFormatting = ({ eclRef, handleChangeObj, localState }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, configuration, selectedDataset = {}, sourceType } = localState;
  const { fields = [] } = selectedDataset;
  const { conditionals = [] } = configuration;
  const [tabIndex, setTabIndex] = useState(0);
  const [tabPercentage, setTabPercentage] = useState('');
  const { appbar, button, grid, progress, typography } = useStyles();

  const updateRule = (event, index) => {
    const { name, value } = event.target;
    const newConditionalArr = [...conditionals];

    // Update index
    if (name === 'color') {
      newConditionalArr[tabIndex].rules[index] = {
        ...newConditionalArr[tabIndex].rules[index],
        [name]: value,
        text: getConstrastTextColor(value),
      };
    } else {
      newConditionalArr[tabIndex].rules[index] = {
        ...newConditionalArr[tabIndex].rules[index],
        [name]: value,
      };
    }

    // Add new object to end of array for next entry
    if (newConditionalArr[tabIndex].rules.length - 1 === index) {
      newConditionalArr[tabIndex].rules.push({ operand: '>', value: '', color: '#FFF' });
    }

    return handleChangeObj(null, { name: 'configuration:conditionals', value: newConditionalArr });
  };

  const removeRule = index => {
    const newConditionalArr = [...conditionals];

    newConditionalArr[tabIndex].rules.splice(index, 1);

    // Array is empty, add an empty object
    if (newConditionalArr[tabIndex].rules.length === 0) {
      newConditionalArr[tabIndex].rules.push({ operand: '>', value: '', color: '#FFF' });
    }

    return handleChangeObj(null, { name: 'configuration:conditionals', value: newConditionalArr });
  };

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  useEffect(() => {
    if (
      fieldsArr.length > 0 &&
      messages.indexOf(fieldsArr[0].name) === -1 &&
      fieldsArr.length > conditionals.length
    ) {
      const conditionalsArr = fieldsArr.map(({ name }) => ({
        field: name,
        rules: [{ operand: '>', value: '', color: '#FFF' }],
      }));

      console.log(conditionalsArr);

      handleChangeObj(null, { name: 'configuration:conditionals', value: conditionalsArr });
    }
  }, []);

  useEffect(() => {
    if (fieldsArr.length > 4) {
      setTabPercentage('25%');
    } else {
      const percentage = (100 / fieldsArr.length).toFixed(1);
      setTabPercentage(`${percentage}%`);
    }
  });

  const conditionRules = conditionals[tabIndex]?.rules || [];

  return (
    <Grid item md={12} className={grid}>
      {chartID && messages.indexOf(fieldsArr[0].name) > -1 ? (
        <CircularProgress className={progress} size={20} />
      ) : messages.indexOf(fieldsArr[0].name) === -1 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar className={appbar} position='static' color='inherit'>
              <Tabs
                value={tabIndex}
                variant='scrollable'
                scrollButtons='auto'
                onChange={(event, index) => setTabIndex(index)}
              >
                {fieldsArr.map(({ name }, index) => {
                  return (
                    <Tab
                      key={index}
                      label={name}
                      style={{ maxWidth: tabPercentage, minWidth: tabPercentage }}
                      wrapped
                    />
                  );
                })}
              </Tabs>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            <Fragment>
              <FormLabel>Comparison</FormLabel>
              {conditionRules.map(({ operand, value, color }, index) => {
                const isPopulated = Boolean(value) || color !== '#FFF' || value === 0;
                return (
                  <Grid key={index} container spacing={2}>
                    <Grid item xs={1}>
                      {isPopulated && (
                        <Button className={button} onClick={() => removeRule(index)}>
                          <ClearIcon />
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth>
                        <Select
                          fullWidth
                          name='operand'
                          value={operand || '>'}
                          onChange={event => updateRule(event, index)}
                        >
                          {comparisonOperands.map(({ label, value }, index) => {
                            return (
                              <MenuItem key={index} value={value}>
                                {label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        type='number'
                        fullWidth
                        placeholder='value'
                        name='value'
                        value={value}
                        onChange={event => updateRule(event, index)}
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <ColorPicker color={color} updateField={updateRule} index={index} />
                    </Grid>
                  </Grid>
                );
              })}
            </Fragment>
          </Grid>
        </Grid>
      ) : (
        <Typography variant='h6' color='inherit' align='center' className={typography}>
          No Fields Available
        </Typography>
      )}
    </Grid>
  );
};

export default TableConditionalFormatting;
