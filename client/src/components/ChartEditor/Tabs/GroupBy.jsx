import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { getMessage, hasPercentageStackOption, hasStackedOption } from '../../../utils/misc';
import AxisGroupOptions from '../AxisConfig/GroupOptions';
import ConfigCheckbox from '../AxisConfig/ConfigCheckbox';

const useStyles = makeStyles(theme => ({
  topFormControl: { marginTop: theme.spacing(3) },
  typography: { marginTop: theme.spacing(2.5) },
}));

const GroupByTab = props => {
  const {
    eclRef: { current: { dataset: eclDataset } = {} } = {},
    handleCheckbox,
    localState: {
      configuration: { percentageStack, stacked, type },
      dataset,
      sourceType,
    },
  } = props;
  const { topFormControl, typography } = useStyles();

  return dataset || eclDataset ? (
    <Fragment>
      <Grid container spacing={2} alignContent='space-between' className={topFormControl}>
        <AxisGroupOptions
          {...props}
          field='groupBy'
          label={
            type === 'columnline'
              ? 'Group By (Column)'
              : type === 'dualline'
              ? 'Group By (Line 1)'
              : 'Group By'
          }
        >
          {hasStackedOption(type) && (
            <Grid item xs={6} sm={2}>
              <ConfigCheckbox
                name='configuration:stacked'
                checked={stacked}
                handleChange={handleCheckbox}
                label='Stacked'
                labelPlacement='top'
              />
            </Grid>
          )}
          {hasPercentageStackOption(type) && stacked && (
            <Grid item xs={6} sm={3}>
              <ConfigCheckbox
                name='configuration:percentageStack'
                checked={percentageStack}
                handleChange={handleCheckbox}
                label='Percentage (%)'
                labelPlacement='top'
              />
            </Grid>
          )}
        </AxisGroupOptions>
      </Grid>
      {(type === 'columnline' || type === 'dualline') && (
        <Grid container alignContent='space-between' spacing={2}>
          <AxisGroupOptions
            {...props}
            canStack={false}
            field='groupBy2'
            label={type === 'dualline' ? 'Group By (Line 2)' : 'Group By (Line)'}
          />
        </Grid>
      )}
    </Fragment>
  ) : (
    <Typography variant='h6' color='inherit' align='center' className={typography}>
      {getMessage(sourceType)}
    </Typography>
  );
};

export default GroupByTab;
