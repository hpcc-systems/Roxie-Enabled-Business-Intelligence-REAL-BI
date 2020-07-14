import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

// React Components
import FilterInfo from './FilterInfo';
import FilterMapper from './FilterMapper';

// Create styles
const useStyles = makeStyles(theme => ({
  gridContainer: { overflowY: 'hidden' },
  typography: {
    ...theme.typography.button,
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

const FilterEditor = props => {
  const { error } = props.localState;
  const { gridContainer, typography } = useStyles();

  return (
    <Grid container spacing={4} className={gridContainer}>
      <Grid item xs={6}>
        {error !== '' && (
          <Typography className={typography} align='center'>
            {error}
          </Typography>
        )}
        <FilterInfo {...props} />
      </Grid>
      <Grid item xs={6}>
        <FilterMapper {...props} />
      </Grid>
    </Grid>
  );
};

export default FilterEditor;
