import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Create styles
const useStyles = makeStyles({
  textContent: { paddingLeft: 8, paddingBottom: 8 },
});

const TextBox = ({ options }) => {
  console.log(options);
  const { textBoxContent, chartDescription } = options;
  const { textContent } = useStyles();

  return (
    <Fragment>
      {chartDescription ? (
        <Typography variant='subtitle2' align='left' color='inherit' className={textContent}>
          {chartDescription}
        </Typography>
      ) : null}
      {textBoxContent ? (
        <Typography variant='body2' align='left' color='inherit' className={textContent}>
          {textBoxContent}
        </Typography>
      ) : null}
    </Fragment>
  );
};

export default TextBox;
