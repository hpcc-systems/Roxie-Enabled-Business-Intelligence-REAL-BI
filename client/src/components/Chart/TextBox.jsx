import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles({
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subheader: { fontSize: 20, paddingBottom: 20 },
});

const LineChart = ({ options }) => {
  const { TextBox, chartDescription } = options;
  const { subheader } = useStyles();

  return (
    <Fragment>
      <Typography variant='subtitle2' align='center' color='inherit' className={subheader}>
        {chartDescription ? chartDescription : 'No description Received'}
      </Typography>
      <Typography variant='body2' align='center' color='inherit' className={subheader}>
        {TextBox ? TextBox : 'Check chart options and refresh...'}
      </Typography>
    </Fragment>
  );
};

export default LineChart;
