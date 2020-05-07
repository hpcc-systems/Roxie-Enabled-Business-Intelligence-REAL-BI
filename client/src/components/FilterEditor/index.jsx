import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

// React Components
import FilterInfo from './FilterInfo';
import FilterMapper from './FilterMapper';

// Create styles
const useStyles = makeStyles(() => ({
  gridContainer: { overflowY: 'hidden' },
}));

const FilterEditor = props => {
  const { gridContainer } = useStyles();

  return (
    <Grid container spacing={4} className={gridContainer}>
      <Grid item xs={6}>
        <FilterInfo {...props} />
      </Grid>
      <Grid item xs={6}>
        <FilterMapper {...props} />
      </Grid>
    </Grid>
  );
};

export default FilterEditor;
